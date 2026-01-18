const express = require('express');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/campaigns
// @desc    Get all active campaigns (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();

        // Calculate totalRaised for each campaign
        const campaignsWithStats = await Promise.all(
            campaigns.map(async (campaign) => {
                const stats = await Donation.aggregate([
                    { $match: { campaignId: campaign._id, paymentStatus: 'success' } },
                    { $group: { _id: null, totalRaised: { $sum: '$amount' }, count: { $sum: 1 } } }
                ]);

                return {
                    id: campaign._id,
                    title: campaign.title,
                    description: campaign.description,
                    image: campaign.image,
                    totalRaised: stats[0]?.totalRaised || 0,
                    donationCount: stats[0]?.count || 0,
                    createdAt: campaign.createdAt
                };
            })
        );

        res.json({ campaigns: campaignsWithStats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
});

// @route   GET /api/campaigns/:id
// @desc    Get single campaign by ID (public)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).lean();

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Calculate stats
        const stats = await Donation.aggregate([
            { $match: { campaignId: campaign._id, paymentStatus: 'success' } },
            { $group: { _id: null, totalRaised: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        res.json({
            campaign: {
                id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                isActive: campaign.isActive,
                totalRaised: stats[0]?.totalRaised || 0,
                donationCount: stats[0]?.count || 0,
                createdAt: campaign.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================

// @route   GET /api/campaigns/admin/all
// @desc    Get all campaigns including inactive (admin)
// @access  Admin
router.get('/admin/all', auth, isAdmin, async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();

        const campaignsWithStats = await Promise.all(
            campaigns.map(async (campaign) => {
                const stats = await Donation.aggregate([
                    { $match: { campaignId: campaign._id, paymentStatus: 'success' } },
                    { $group: { _id: null, totalRaised: { $sum: '$amount' }, count: { $sum: 1 } } }
                ]);

                return {
                    id: campaign._id,
                    title: campaign.title,
                    description: campaign.description,
                    image: campaign.image,
                    isActive: campaign.isActive,
                    totalRaised: stats[0]?.totalRaised || 0,
                    donationCount: stats[0]?.count || 0,
                    createdAt: campaign.createdAt
                };
            })
        );

        res.json({ campaigns: campaignsWithStats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign (admin)
// @access  Admin
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, image, isActive } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const campaign = new Campaign({
            title,
            description,
            image: image || '',
            isActive: isActive !== undefined ? isActive : true
        });

        await campaign.save();

        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: {
                id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                isActive: campaign.isActive,
                createdAt: campaign.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign (admin)
// @access  Admin
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, image, isActive } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { title, description, image, isActive },
            { new: true, runValidators: true }
        );

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json({
            message: 'Campaign updated successfully',
            campaign: {
                id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                isActive: campaign.isActive,
                createdAt: campaign.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating campaign', error: error.message });
    }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign (admin)
// @access  Admin
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting campaign', error: error.message });
    }
});

module.exports = router;
