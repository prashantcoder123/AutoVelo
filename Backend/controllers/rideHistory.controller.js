const rideHistoryModel = require('../models/rideHistory.model');
const rideModel = require('../models/ride.model');

// 📜 Get captain's ride history
module.exports.getCaptainRideHistory = async (req, res) => {
    try {
        const captainId = req.captain._id;

        // Try rideHistory first
        let history = await rideHistoryModel
            .find({ captain: captainId })
            .populate('user', 'fullname email')
            .sort({ completedAt: -1 });

        // Fallback: also check completed rides from ride model
        if (history.length === 0) {
            const completedRides = await rideModel
                .find({ captain: captainId, status: 'completed' })
                .populate('user', 'fullname email')
                .sort({ _id: -1 });

            history = completedRides.map(ride => ({
                _id: ride._id,
                ride: ride._id,
                user: ride.user,
                captain: captainId,
                pickup: ride.pickup,
                destination: ride.destination,
                fare: ride.fare,
                captainEarnings: Math.round(ride.fare * 0.92),
                distance: ride.distance,
                duration: ride.duration,
                completedAt: ride._id.getTimestamp()
            }));
        }

        // 💰 Calculate total earnings
        const totalEarnings = history.reduce((sum, ride) => sum + (ride.captainEarnings || Math.round(ride.fare * 0.92)), 0);
        const totalRides = history.length;

        res.status(200).json({
            totalRides,
            totalEarnings,
            rides: history
        });

    } catch (error) {
        console.error("Ride History Error:", error);
        res.status(500).json({ message: "Failed to fetch ride history" });
    }
};

// 📜 Get user's ride history
module.exports.getUserRideHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Try rideHistory first
        let history = await rideHistoryModel
            .find({ user: userId })
            .populate('captain', 'fullname email vehicle')
            .sort({ completedAt: -1 });

        // Fallback: also check completed rides from ride model
        if (history.length === 0) {
            const completedRides = await rideModel
                .find({ user: userId, status: 'completed' })
                .populate('captain', 'fullname email vehicle')
                .sort({ _id: -1 });

            history = completedRides.map(ride => ({
                _id: ride._id,
                ride: ride._id,
                user: userId,
                captain: ride.captain,
                pickup: ride.pickup,
                destination: ride.destination,
                fare: ride.fare,
                captainEarnings: Math.round(ride.fare * 0.92),
                distance: ride.distance,
                duration: ride.duration,
                completedAt: ride._id.getTimestamp()
            }));
        }

        // 💰 Calculate total spent
        const totalSpent = history.reduce((sum, ride) => sum + ride.fare, 0);
        const totalRides = history.length;

        res.status(200).json({
            totalRides,
            totalSpent,
            rides: history
        });

    } catch (error) {
        console.error("User Ride History Error:", error);
        res.status(500).json({ message: "Failed to fetch ride history" });
    }
};
