

import React, { useEffect, useState } from 'react'

const RidePopUp = (props) => {

    const [distance, setDistance] = useState("")

    // 🔥 Haversine formula
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return (R * c).toFixed(2)
    }

    // 🔥 Calculate distance
    useEffect(() => {
        if (!props.ride) return

        navigator.geolocation.getCurrentPosition((position) => {
            const captainLat = position.coords.latitude
            const captainLng = position.coords.longitude

            const pickupLat = props.ride?.pickup?.lat
            const pickupLng = props.ride?.pickup?.lng

            if (pickupLat && pickupLng) {
                const dist = getDistance(
                    captainLat,
                    captainLng,
                    pickupLat,
                    pickupLng
                )
                setDistance(dist)
            }
        })
    }, [props.ride])

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0'
                onClick={() => props.setRidePopupPanel(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>

            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img
                        className='h-12 rounded-full object-cover w-12'
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt=""
                    />
                    <h2 className='text-lg font-medium'>
                        {props.ride?.user?.fullname?.firstname + " " + props.ride?.user?.fullname?.lastname}
                    </h2>
                </div>

                {/* 🔥 REAL DISTANCE */}
                <h5 className='text-lg font-semibold'>
                    {distance ? `${distance} KM` : "Calculating..."}
                </h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>

                    {/* PICKUP */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>
                                {props.ride?.pickup?.address}
                            </p>
                        </div>
                    </div>

                    {/* DESTINATION */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>
                                {props.ride?.destination?.address}
                            </p>
                        </div>
                    </div>

                    {/* FARE */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-5 w-full'>
                    <button
                        onClick={() => {
                            props.setConfirmRidePopupPanel(true)
                            props.confirmRide()
                        }}
                        className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'
                    >
                        Accept
                    </button>

                    <button
                        onClick={() => props.setRidePopupPanel(false)}
                        className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg'
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp