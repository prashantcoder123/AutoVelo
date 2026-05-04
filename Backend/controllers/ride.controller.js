// const rideService = require('../services/ride.service');
// const { validationResult } = require('express-validator');
// const mapService = require('../services/maps.service');
// const { sendMessageToSocketId } = require('../socket');
// const rideModel = require('../models/ride.model');


// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

// module.exports.getFare = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination } = req.query;

//     try {
//         const fare = await rideService.getFare(pickup, destination);
//         return res.status(200).json(fare);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.confirmRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-confirmed',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.startRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId, otp } = req.query;

//     try {
//         const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//         console.log(ride);

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-started',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.endRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.endRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-ended',
//             data: ride
//         })



//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     } s
// }

// module.exports.paymentDone = async (req, res) => {
//     try {
//         const { rideId } = req.body

//         const ride = await rideModel.findById(rideId).populate('captain')

//         console.log("🔥 PAYMENT API HIT")
//         console.log("Ride:", ride)

//         console.log("Captain socketId:", ride.captain.socketId) // 👈 IMPORTANT

//         sendMessageToSocketId(ride.captain.socketId, {
//             event: 'payment-received',
//             data: {
//                 fare: ride.fare
//             }
//         })

//         res.status(200).json({ message: "Payment event sent" })

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: err.message })
//     }
// }

const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // 🔥 1. Get coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const destinationCoordinates = await mapService.getAddressCoordinate(destination);

        // 🚨 safety check
        if (!pickupCoordinates || !destinationCoordinates) {
            return res.status(400).json({ message: "Invalid pickup or destination" });
        }

        // 🔥 2. Create ride with lat/lng
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup: {
                address: pickup,
                lat: pickupCoordinates.lat,   // ✅ FIXED
                lng: pickupCoordinates.lng
            },
            destination: {
                address: destination,
                lat: destinationCoordinates.lat,
                lng: destinationCoordinates.lng
            },
            vehicleType
        });

        res.status(201).json(ride);

        // 🔥 3. Find nearby captains
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat,   // ✅ FIXED
            pickupCoordinates.lng,
            2 // km radius
        );

        // 🔥 4. Remove OTP before sending
        ride.otp = "";

        // 🔥 5. Populate user
        const rideWithUser = await rideModel
            .findOne({ _id: ride._id })
            .populate('user');

        // 🔥 6. Send ride to captains via socket
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({
            rideId,
            otp,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({
            rideId,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.paymentDone = async (req, res) => {
    try {
        const { rideId } = req.body;

        const ride = await rideModel
            .findById(rideId)
            .populate('captain');

        console.log("🔥 PAYMENT API HIT");
        console.log("Ride:", ride);

        if (!ride || !ride.captain) {
            return res.status(400).json({ message: "Ride or captain not found" });
        }

        console.log("Captain socketId:", ride.captain.socketId);

        sendMessageToSocketId(ride.captain.socketId, {
            event: 'payment-received',
            data: {
                fare: ride.fare
            }
        });

        res.status(200).json({ message: "Payment event sent" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};