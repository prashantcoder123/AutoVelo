

import React, { useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {

    const location = useLocation()
    const { ride } = location.state || {}

    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    // ✅ FIX: socket inside useEffect
    useEffect(() => {
        socket.on("ride-ended", () => {
            navigate('/home')
        })

        return () => {
            socket.off("ride-ended")
        }
    }, [socket, navigate])

    // ❌ If ride not loaded yet
    if (!ride) {
        return <div className="p-5 text-center">Loading ride...</div>
    }

    return (
        <div className='h-screen'>

            {/* MAP */}
            <div className='h-1/2'>
                <LiveTracking />
            </div>

            {/* DETAILS */}
            <div className='h-1/2 p-4'>

                {/* DRIVER INFO */}
                <div className='flex items-center justify-between'>
                    <img
                        className='h-12'
                        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                        alt="car"
                    />

                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>
                            {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
                        </h2>

                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>
                            {ride?.captain?.vehicle?.plate}
                        </h4>

                        <p className='text-sm text-gray-600'>
                            {ride?.captain?.vehicle?.model || "Vehicle"}
                        </p>
                    </div>
                </div>

                {/* RIDE INFO */}
                <div className='flex gap-2 flex-col items-center'>
                    <div className='w-full mt-5'>

                        {/* DESTINATION */}
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm text-gray-600'>
                                    {ride?.destination?.address || "Loading..."}
                                </p>
                            </div>
                        </div>

                        {/* FARE */}
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>
                                    ₹{ride?.fare}
                                </h3>
                                <p className='text-sm text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOME BUTTON */}
                <Link
                    to='/home'
                    className='fixed right-2 top-20 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow'
                >
                    <i className="text-lg font-medium ri-home-5-line"></i>
                </Link>

                {/* PAYMENT OPTIONS */}
                <div className='flex gap-3 mt-5'>
                    <button
                        onClick={() => navigate('/payment', { state: { ride } })}
                        className='flex-1 bg-green-600 text-white font-semibold p-3 rounded-lg flex flex-col items-center gap-1'
                        style={{ boxShadow: '0 4px 12px rgba(76,175,80,0.3)' }}
                    >
                        <span className='text-lg'>📱</span>
                        <span>Pay via UPI</span>
                        <span className='text-xs opacity-80'>GPay / PhonePe / Paytm</span>
                    </button>

                    <div
                        onClick={() => alert(`Please hand ₹${ride?.fare} in cash to your driver.`)}
                        className='flex-1 bg-amber-500 text-white font-semibold p-3 rounded-lg flex flex-col items-center gap-1 cursor-pointer'
                        style={{ boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
                    >
                        <span className='text-lg'>💵</span>
                        <span>Pay Cash</span>
                        <span className='text-xs opacity-80'>₹{ride?.fare} to driver</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Riding