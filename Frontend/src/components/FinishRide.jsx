


import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const FinishRide = (props) => {

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    const [paid, setPaid] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('') // 'upi' or 'cash'
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

    // 🔥 Payment socket (UPI payment from user)
    useEffect(() => {
        socket.on("payment-received", (data) => {
            console.log("Payment received:", data)
            setPaid(true)
            setPaymentMethod('upi')
        })

        return () => {
            socket.off("payment-received")
        }
    }, [socket])

    // 💵 Collect Cash — captain manually confirms cash collection
    const handleCollectCash = () => {
        const confirmCash = window.confirm(
            `Have you collected ₹${props.ride?.fare} cash from the rider?`
        )
        if (confirmCash) {
            setPaid(true)
            setPaymentMethod('cash')
        }
    }

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
                            <p className='text-sm text-gray-600'>
                                {paymentMethod === 'cash' ? 'Cash Collected' :
                                 paymentMethod === 'upi' ? 'UPI Payment' : 'Payment Pending'}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Payment Status */}
                {paid && (
                    <div className='w-full mt-2 p-3 rounded-lg text-center'
                        style={{
                            background: paymentMethod === 'cash'
                                ? 'rgba(255, 152, 0, 0.1)'
                                : 'rgba(76, 175, 80, 0.1)',
                            border: paymentMethod === 'cash'
                                ? '1px solid rgba(255, 152, 0, 0.3)'
                                : '1px solid rgba(76, 175, 80, 0.3)'
                        }}
                    >
                        <p style={{
                            margin: 0,
                            fontWeight: 600,
                            color: paymentMethod === 'cash' ? '#ff9800' : '#4caf50'
                        }}>
                            {paymentMethod === 'cash'
                                ? `💵 Cash ₹${props.ride?.fare} Collected`
                                : `✅ UPI Payment ₹${props.ride?.fare} Received`
                            }
                        </p>
                    </div>
                )}

                {/* Payment Options (shown when not yet paid) */}
                {!paid && (
                    <div className='w-full mt-4'>
                        <p className='text-center text-sm text-gray-500 mb-3'>
                            Select how payment was received:
                        </p>

                        <div className='flex gap-3'>
                            {/* Waiting for UPI */}
                            <div className='flex-1 p-3 rounded-lg text-center border-2 border-blue-200'
                                style={{ background: 'rgba(33, 150, 243, 0.05)' }}
                            >
                                <div className='text-2xl mb-1'>📱</div>
                                <p className='text-xs text-gray-500'>Waiting for</p>
                                <p className='text-sm font-semibold text-blue-600'>UPI Payment</p>
                                <div className='mt-2'>
                                    <div style={{
                                        width: 20,
                                        height: 20,
                                        border: '2px solid rgba(33,150,243,0.3)',
                                        borderTopColor: '#2196f3',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                        margin: '0 auto'
                                    }} />
                                </div>
                            </div>

                            {/* Collect Cash Button */}
                            <button
                                onClick={handleCollectCash}
                                className='flex-1 p-3 rounded-lg text-center border-2 border-green-300 cursor-pointer'
                                style={{
                                    background: 'rgba(76, 175, 80, 0.05)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(76, 175, 80, 0.15)'
                                    e.currentTarget.style.borderColor = '#4caf50'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(76, 175, 80, 0.05)'
                                    e.currentTarget.style.borderColor = 'rgb(134, 239, 172)'
                                }}
                            >
                                <div className='text-2xl mb-1'>💵</div>
                                <p className='text-xs text-gray-500'>Tap to</p>
                                <p className='text-sm font-semibold text-green-600'>Collect Cash</p>
                                <p className='text-xs font-bold text-green-700 mt-1'>₹{props.ride?.fare}</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Finish Ride Button */}
                <div className='mt-6 w-full'>

                    <button
                        onClick={endRide}
                        disabled={!paid}
                        className={`w-full mt-3 text-lg text-white font-semibold p-3 rounded-lg 
                        ${paid ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        style={{
                            transition: 'all 0.2s',
                            boxShadow: paid ? '0 4px 15px rgba(76, 175, 80, 0.3)' : 'none'
                        }}
                    >
                        {paid ? "✅ Finish Ride" : "⏳ Waiting for Payment..."}
                    </button>

                    <p className='text-red-500 mt-3 text-xs text-center'>
                        Complete ride only after payment
                    </p>

                </div>
            </div>

            {/* Spin animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default FinishRide