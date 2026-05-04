


import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const FinishRide = (props) => {

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    const [paid, setPaid] = useState(false)
    const [distance, setDistance] = useState("")

    // 🔥 Distance calculation
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

    // 🔥 Payment socket
    useEffect(() => {
        socket.on("payment-received", (data) => {
            console.log("Payment received:", data)
            alert(`💰 Payment Received ₹${data.fare}`)
            setPaid(true)
        })

        return () => {
            socket.off("payment-received")
        }
    }, [socket])

    // 🚗 End Ride
    async function endRide() {
        if (!paid) {
            alert("❌ Please confirm payment first")
            return
        }

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
            { rideId: props.ride._id },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        if (response.status === 200) {
            navigate('/captain-home')
        }
    }

    return (
        <div>

            {/* Close */}
            <h5
                className='p-1 text-center w-[93%] absolute top-0'
                onClick={() => props.setFinishRidePanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>

            {/* User Info */}
            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img
                        className='h-12 rounded-full object-cover w-12'
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt=""
                    />
                    <h2 className='text-lg font-medium'>
                        {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
                    </h2>
                </div>

                {/* 🔥 REAL DISTANCE */}
                <h5 className='text-lg font-semibold'>
                    {distance ? `${distance} KM` : "Calculating..."}
                </h5>
            </div>

            {/* Ride Details */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>

                    {/* PICKUP */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm text-gray-600'>
                                {props.ride?.pickup?.address || "Loading..."}
                            </p>
                        </div>
                    </div>

                    {/* DESTINATION */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm text-gray-600'>
                                {props.ride?.destination?.address || "Loading..."}
                            </p>
                        </div>
                    </div>

                    {/* FARE */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>
                                ₹{props.ride?.fare}
                            </h3>
                            <p className='text-sm text-gray-600'>Cash</p>
                        </div>
                    </div>

                </div>

                {/* Payment Status */}
                {paid && (
                    <p className='text-green-600 font-semibold mt-3'>
                        Payment Received ✅
                    </p>
                )}

                {/* Button */}
                <div className='mt-10 w-full'>

                    <button
                        onClick={endRide}
                        disabled={!paid}
                        className={`w-full mt-5 text-lg text-white font-semibold p-3 rounded-lg 
                        ${paid ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {paid ? "Finish Ride" : "Waiting for Payment..."}
                    </button>

                    <p className='text-red-500 mt-5 text-xs text-center'>
                        Complete ride only after payment
                    </p>

                </div>
            </div>
        </div>
    )
}

export default FinishRide