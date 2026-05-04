// const rideModel = require('../models/ride.model');
// const mapService = require('./maps.service');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');


// async function getFare(pickup, destination) {

//     if (!pickup || !destination) {
//         throw new Error('Pickup and destination are required');
//     }

//     const distanceTime = await mapService.getDistanceTime(pickup, destination);

//     const baseFare = {
//         auto: 10,
//         car: 20,
//         moto: 15
//     };

//     const perKmRate = {
//         auto: 1.2,
//         car: 2,
//         moto: 1.5
//     };

//     const perMinuteRate = {
//         auto: 0.2,
//         car: 0.5,
//         moto: 0.3
//     };


//     const fare = {
//         auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
//         car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
//         moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
//     };

//     return fare;


// }

// module.exports.getFare = getFare;


// function getOtp(num) {
//     function generateOtp(num) {
//         const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
//         return otp;
//     }
//     return generateOtp(num);
// }


// module.exports.createRide = async ({
//     user, pickup, destination, vehicleType
// }) => {
//     if (!user || !pickup || !destination || !vehicleType) {
//         throw new Error('All fields are required');
//     }

//     const fare = await getFare(pickup, destination);



//     const ride = rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp: getOtp(6),
//         fare: fare[vehicleType]
//     })

//     return ride;
// }


// module.exports.confirmRide = async ({
//     rideId, captain
// }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'accepted',
//         captain: captain._id
//     })

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     return ride;

// }

// module.exports.startRide = async ({ rideId, otp, captain }) => {
//     if (!rideId || !otp) {
//         throw new Error('Ride id and OTP are required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'accepted') {
//         throw new Error('Ride not accepted');
//     }

//     if (ride.otp !== otp) {
//         throw new Error('Invalid OTP');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'ongoing'
//     })

//     return ride;
// }

// module.exports.endRide = async ({ rideId, captain }) => {
//     if (!rideId) {
//         throw new Error('Ride id is required');
//     }

//     const ride = await rideModel.findOne({
//         _id: rideId,
//         captain: captain._id
//     }).populate('user').populate('captain').select('+otp');

//     if (!ride) {
//         throw new Error('Ride not found');
//     }

//     if (ride.status !== 'ongoing') {
//         throw new Error('Ride not ongoing');
//     }

//     await rideModel.findOneAndUpdate({
//         _id: rideId
//     }, {
//         status: 'completed'
//     })

//     return ride;
// }

const rideModel = require('../models/ride.model');
const rideHistoryModel = require('../models/rideHistory.model');
const mapService = require('./maps.service');
const crypto = require('crypto');


// 🔥 GET FARE (FIXED)
async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // ✅ Handle both string & object
    const pickupAddress =
        typeof pickup === 'string' ? pickup : pickup.address;

    const destinationAddress =
        typeof destination === 'string' ? destination : destination.address;

    const distanceTime = await mapService.getDistanceTime(
        pickupAddress,
        destinationAddress
    );

    // 🚨 SAFETY CHECK (prevents crash)
    if (
        !distanceTime ||
        !distanceTime.distance ||
        !distanceTime.duration
    ) {
        console.log("❌ Distance API failed:", distanceTime);
        throw new Error('Unable to calculate distance');
    }

    const baseFare = {
        auto: 10,
        car: 20,
        moto: 15
    };

    const perKmRate = {
        auto: 1.2,
        car: 2,
        moto: 1.5
    };

    const perMinuteRate = {
        auto: 0.2,
        car: 0.5,
        moto: 0.3
    };

    const distanceInKm = distanceTime.distance.value / 1000;
    const durationInMin = distanceTime.duration.value / 60;

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (distanceInKm * perKmRate.auto) +
            (durationInMin * perMinuteRate.auto)
        ),
        car: Math.round(
            baseFare.car +
            (distanceInKm * perKmRate.car) +
            (durationInMin * perMinuteRate.car)
        ),
        moto: Math.round(
            baseFare.moto +
            (distanceInKm * perKmRate.moto) +
            (durationInMin * perMinuteRate.moto)
        )
    };

    return fare;
}

module.exports.getFare = getFare;


// 🔐 OTP GENERATOR
function getOtp(num) {
    return crypto
        .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
        .toString();
}


// 🚗 CREATE RIDE (UPDATED)
module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType
}) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // ✅ Always pass address to fare
    const fare = await getFare(
        typeof pickup === 'string' ? pickup : pickup.address,
        typeof destination === 'string' ? destination : destination.address
    );

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;
};


// ✅ CONFIRM RIDE
module.exports.confirmRide = async ({ rideId, captain }) => {

    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId },
        {
            status: 'accepted',
            captain: captain._id
        }
    );

    const ride = await rideModel
        .findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};


// 🚦 START RIDE
module.exports.startRide = async ({ rideId, otp, captain }) => {

    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel
        .findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'ongoing' }
    );

    return ride;
};


// 🏁 END RIDE — auto-saves completed ride details to RideHistory
module.exports.endRide = async ({ rideId, captain }) => {

    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            captain: captain._id
        })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'completed' }
    );

    // 🔥 Auto-save ride completion details to DB
    const captainEarnings = Math.round(ride.fare * 0.92); // Captain gets 85% (15% platform charge)

    await rideHistoryModel.create({
        ride: ride._id,
        user: ride.user._id,
        captain: ride.captain._id,
        pickup: {
            address: ride.pickup.address,
            lat: ride.pickup.lat,
            lng: ride.pickup.lng
        },
        destination: {
            address: ride.destination.address,
            lat: ride.destination.lat,
            lng: ride.destination.lng
        },
        fare: ride.fare,
        captainEarnings: captainEarnings,
        distance: ride.distance || null,
        duration: ride.duration || null,
        completedAt: new Date()
    });

    console.log(`✅ Ride ${ride._id} completed — Captain earned ₹${captainEarnings}`);

    return ride;
};