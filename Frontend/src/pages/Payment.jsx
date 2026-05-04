

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'
const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { ride } = location.state || {}

    const upiId = "736705572828@ybl"
    const name = "AutoVelo"
    const amount = ride?.fare || 0

    // Prevent invalid QR
    const upiLink = amount
        ? `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`
        : ""

    // const handleConfirmPayment = () => {
    //     alert("Payment Confirmed ✅")
    //     navigate('/home')
    // }
    const handleConfirmPayment = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/payment-done`,
                {
                    rideId: ride._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            alert("Payment Confirmed ✅")
            navigate('/home')

        } catch (err) {
            console.log(err)
            alert("Payment failed")
        }
    }

    return (
        <div className='h-screen flex flex-col justify-center items-center p-5 bg-gray-100'>
            <h1 className='text-2xl font-bold mb-5'>Scan & Pay</h1>

            <div className='bg-white shadow-lg rounded-lg p-5 w-full max-w-sm text-center'>

                <p className='mb-2'>
                    <strong>Driver:</strong>{" "}
                    {ride?.captain?.fullname?.firstname || "N/A"}{" "}
                    {ride?.captain?.fullname?.lastname || ""}
                </p>

                <p className='mb-2'>
                    <strong>Vehicle:</strong>{" "}
                    {ride?.captain?.vehicle?.plate || "N/A"}
                </p>

                <p className='mb-4'>
                    <strong>Fare:</strong> ₹{amount}
                </p>

                {/* QR CODE */}
                {amount > 0 ? (
                    <div className='flex justify-center my-4'>
                        <QRCodeCanvas value={upiLink} size={180} />
                    </div>
                ) : (
                    <p className='text-red-500'>Invalid fare amount</p>
                )}

                <p className='text-sm text-gray-600'>
                    Scan using Google Pay / PhonePe / Paytm
                </p>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirmPayment}
                    className='w-full mt-5 bg-blue-600 text-white p-2 rounded-lg font-semibold'
                >
                    I Have Paid
                </button>

            </div>
        </div>
    )
}

export default Payment

// import React from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const Payment = () => {
//     const location = useLocation()
//     const navigate = useNavigate()
//     const { ride } = location.state || {}

//     const amount = ride?.fare || 0

//     const handlePayment = async () => {
//         try {
//             // 1️⃣ Create order from backend
//             const { data: order } = await axios.post(
//                 `${import.meta.env.VITE_BASE_URL}/payment/create-order`,
//                 { amount },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             )

//             // 2️⃣ Razorpay options
//             const options = {
//                 key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//                 amount: order.amount,
//                 currency: "INR",
//                 name: "AutoVelo",
//                 description: "Ride Payment",
//                 order_id: order.id,

//                 handler: async function (response) {
//                     try {
//                         // 3️⃣ Verify payment on backend
//                         await axios.post(
//                             `${import.meta.env.VITE_BASE_URL}/payment/verify`,
//                             {
//                                 ...response,
//                                 rideId: ride._id
//                             }
//                         )

//                         alert("Payment Successful ✅")
//                         navigate('/home')

//                     } catch (err) {
//                         console.log(err)
//                         alert("Verification Failed ❌")
//                     }
//                 },

//                 prefill: {
//                     name: "User",
//                     email: "user@email.com"
//                 },

//                 theme: {
//                     color: "#3399cc"
//                 }
//             }

//             // 4️⃣ Open Razorpay popup
//             const rzp = new window.Razorpay(options)
//             rzp.open()

//         } catch (err) {
//             console.log(err)
//             alert("Payment Failed ❌")
//         }
//     }

//     return (
//         <div className='h-screen flex flex-col justify-center items-center p-5 bg-gray-100'>
//             <h1 className='text-2xl font-bold mb-5'>Pay for Ride</h1>

//             <div className='bg-white shadow-lg rounded-lg p-5 w-full max-w-sm text-center'>

//                 <p className='mb-2'>
//                     <strong>Driver:</strong>{" "}
//                     {ride?.captain?.fullname?.firstname || "N/A"}{" "}
//                     {ride?.captain?.fullname?.lastname || ""}
//                 </p>

//                 <p className='mb-2'>
//                     <strong>Vehicle:</strong>{" "}
//                     {ride?.captain?.vehicle?.plate || "N/A"}
//                 </p>

//                 <p className='mb-4'>
//                     <strong>Fare:</strong> ₹{amount}
//                 </p>

//                 {/* Razorpay Button */}
//                 <button
//                     onClick={handlePayment}
//                     className='w-full mt-5 bg-green-600 text-white p-2 rounded-lg font-semibold'
//                 >
//                     Pay with Razorpay
//                 </button>

//             </div>
//         </div>
//     )
// }

// export default Payment