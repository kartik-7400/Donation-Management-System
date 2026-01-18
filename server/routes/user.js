const express = require('express');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/history
// @desc    Get donation history for logged-in user
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user._id })
            .populate('campaignId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            count: donations.length,
            donations: donations.map(d => ({
                id: d._id,
                razorpayOrderId: d.razorpayOrderId,
                razorpayPaymentId: d.razorpayPaymentId,
                amount: d.amount,
                currency: d.currency,
                paymentStatus: d.paymentStatus,
                campaign: d.campaignId ? {
                    id: d.campaignId._id,
                    title: d.campaignId.title
                } : null,
                createdAt: d.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation history', error: error.message });
    }
});

module.exports = router;
