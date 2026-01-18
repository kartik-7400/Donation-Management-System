const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(auth, isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats (total users, total successful donations)
// @access  Admin
router.get('/dashboard', async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get total successful donations amount
        const donationStats = await Donation.aggregate([
            { $match: { paymentStatus: 'success' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = donationStats[0] || { totalAmount: 0, count: 0 };

        res.json({
            totalUsers,
            totalDonations: stats.count,
            totalAmountRaised: stats.totalAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
});

// @route   GET /api/admin/users
// @desc    Get list of all registered users
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            count: users.length,
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// @route   GET /api/admin/donations
// @desc    Get all donations with their statuses
// @access  Admin
router.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('userId', 'name email')
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
                user: d.userId ? {
                    id: d.userId._id,
                    name: d.userId.name,
                    email: d.userId.email
                } : null,
                campaign: d.campaignId ? {
                    id: d.campaignId._id,
                    title: d.campaignId.title
                } : null,
                createdAt: d.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations', error: error.message });
    }
});

module.exports = router;
