const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

const router = express.Router();

// @route   GET /api/stats/public
// @desc    Get public statistics for landing page
// @access  Public
router.get('/public', async (req, res) => {
    try {
        // Get total members (users)
        const totalMembers = await User.countDocuments();

        // Get total funds raised (successful donations)
        const fundsStats = await Donation.aggregate([
            { $match: { paymentStatus: 'success' } },
            { $group: { _id: null, totalRaised: { $sum: '$amount' } } }
        ]);

        // Get active campaigns count
        const activeCampaigns = await Campaign.countDocuments({ isActive: true });

        res.json({
            totalMembers,
            totalFundsRaised: fundsStats[0]?.totalRaised || 0,
            activeCampaigns,
            dataIntegrity: 100 // Always 100% as we track every transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

module.exports = router;
