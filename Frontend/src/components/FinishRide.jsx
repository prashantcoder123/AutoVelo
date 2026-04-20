// import React from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'


// const FinishRide = (props) => {

//     const navigate = useNavigate()

//     async function endRide() {
//         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {

//             rideId: props.ride._id


//         }, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })

//         if (response.status === 200) {
//             navigate('/captain-home')
//         }

//     }

//     return (
//         <div>
//             <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
//                 props.setFinishRidePanel(false)
//             }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
//             <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
//             <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
//                 <div className='flex items-center gap-3 '>
//                     <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
//                     <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + ' ' + props.ride?.user.fullname.lastname}</h2>
//                 </div>
//                 <h5 className='text-lg font-semibold'>2.2 KM</h5>
//             </div>
//             <div className='flex gap-2 justify-between flex-col items-center'>
//                 <div className='w-full mt-5'>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="ri-map-pin-user-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="text-lg ri-map-pin-2-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3'>
//                         <i className="ri-currency-line"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
//                             <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className='mt-10 w-full'>

//                     <button
//                         onClick={endRide}
//                         className='w-full mt-5 flex  text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>Finish Ride</button>

//                     <p className='text-red-500 mt-10 text-xs'>Click on finsh ride if you have completed the payment.</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FinishRide


import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

const FinishRide = (props) => {

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    const [paid, setPaid] = useState(false)

    // 🔥 Listen for payment event
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
            {
                rideId: props.ride._id
            },
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

            {/* Close Button */}
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
                        {props.ride?.user.fullname.firstname + ' ' + props.ride?.user.fullname.lastname}
                    </h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            {/* Ride Details */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>

                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>

                </div>

                {/* ✅ Payment Status */}
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
                        className={`w-full mt-5 flex text-lg justify-center text-white font-semibold p-3 rounded-lg 
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