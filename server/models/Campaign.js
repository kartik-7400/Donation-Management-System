const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Campaign title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Campaign description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    image: {
        type: String,
        default: '' // URL or base64 encoded image
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for total raised (calculated from donations)
campaignSchema.virtual('totalRaised', {
    ref: 'Donation',
    localField: '_id',
    foreignField: 'campaignId',
    match: { paymentStatus: 'success' }
});

// Index for faster queries
campaignSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
