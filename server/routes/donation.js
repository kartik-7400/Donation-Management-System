const express = require('express');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

// @route   GET /api/donate/key
// @desc    Get Razorpay key for frontend
// @access  Private
router.get('/key', auth, (req, res) => {
    res.json({ key: process.env.RAZORPAY_API_KEY });
});

// @route   POST /api/donate/initiate
// @desc    Create Razorpay order and save pending donation
// @access  Private
router.post('/initiate', auth, async (req, res) => {
    try {
        const { amount, currency = 'INR', campaignId } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ message: 'Please enter a valid amount.' });
        }

        if (!campaignId) {
            return res.status(400).json({ message: 'Please select a campaign.' });
        }

        // Razorpay expects amount in paise (1 INR = 100 paise)
        const amountInPaise = Math.round(amount * 100);

        // Create Razorpay order
        const options = {
            amount: amountInPaise,
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                userName: req.user.name,
                userEmail: req.user.email,
                campaignId: campaignId
            }
        };

        const order = await razorpay.orders.create(options);

        // Create donation with pending status
        const donation = new Donation({
            userId: req.user._id,
            campaignId: campaignId,
            amount: amount, // Store original amount (not in paise)
            currency: currency,
            paymentStatus: 'pending',
            razorpayOrderId: order.id
        });

        await donation.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                paymentStatus: donation.paymentStatus
            },
            // Prefill data for Razorpay checkout
            prefill: {
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error initiating donation', error: error.message });
    }
});

// @route   POST /api/donate/verify
// @desc    Verify Razorpay payment signature and update donation status
// @access  Private
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details.'
            });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update donation status to success
            const donation = await Donation.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    paymentStatus: 'success',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            if (!donation) {
                return res.status(404).json({
                    success: false,
                    message: 'Donation not found.'
                });
            }

            res.json({
                success: true,
                message: 'Payment verified successfully!',
                donation: {
                    id: donation._id,
                    amount: donation.amount,
                    currency: donation.currency,
                    paymentStatus: donation.paymentStatus,
                    razorpayPaymentId: donation.razorpayPaymentId
                }
            });
        } else {
            // Update donation status to failed
            await Donation.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { paymentStatus: 'failed' }
            );

            res.status(400).json({
                success: false,
                message: 'Payment verification failed. Invalid signature.'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
});

// @route   POST /api/donate/failed
// @desc    Mark donation as failed (user cancelled or payment failed)
// @access  Private
router.post('/failed', auth, async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }

        const donation = await Donation.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id, userId: req.user._id },
            { paymentStatus: 'failed' },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found.' });
        }

        res.json({
            success: true,
            message: 'Payment marked as failed',
            donation: {
                id: donation._id,
                amount: donation.amount,
                paymentStatus: donation.paymentStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating donation', error: error.message });
    }
});

module.exports = router;
