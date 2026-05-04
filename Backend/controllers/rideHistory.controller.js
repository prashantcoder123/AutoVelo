const rideHistoryModel = require('../models/rideHistory.model');

// 📜 Get captain's ride history
module.exports.getCaptainRideHistory = async (req, res) => {
    try {
        const captainId = req.captain._id;

        const history = await rideHistoryModel
            .find({ captain: captainId })
            .populate('user', 'fullname email')
            .sort({ completedAt: -1 });

        // 💰 Calculate total earnings
        const totalEarnings = history.reduce((sum, ride) => sum + ride.captainEarnings, 0);
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
