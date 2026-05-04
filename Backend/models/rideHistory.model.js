const mongoose = require('mongoose');

const rideHistorySchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        required: true
    },
    pickup: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    destination: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    fare: {
        type: Number,
        required: true
    },
    captainEarnings: {
        type: Number,
        required: true
    },
    distance: {
        type: Number  // in meters
    },
    duration: {
        type: Number  // in seconds
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('rideHistory', rideHistorySchema);
