

import React from 'react'

const WaitingForDriver = (props) => {

    const ride = props.ride

    return (
        <div>
            {/* CLOSE BUTTON */}
            <h5
                className='p-1 text-center w-[93%] absolute top-0'
                onClick={() => props.setWaitingForDriver(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            {/* DRIVER INFO */}
            <div className='flex items-center justify-between'>
                <img
                    className='h-12'
                    src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                    alt="car"
                />

                <div className='text-right'>
                    <h2 className='text-lg font-medium capitalize'>
                        {ride?.captain?.fullname?.firstname || "Driver"}
                    </h2>

                    <h4 className='text-xl font-semibold -mt-1 -mb-1'>
                        {ride?.captain?.vehicle?.plate || "----"}
                    </h4>

                    <p className='text-sm text-gray-600'>
                        {ride?.captain?.vehicle?.model || "Vehicle"}
                    </p>

                    <h1 className='text-lg font-semibold'>
                        OTP: {ride?.otp || "----"}
                    </h1>
                </div>
            </div>

            {/* RIDE DETAILS */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>

                    {/* PICKUP */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm text-gray-600'>
                                {ride?.pickup?.address || "Loading pickup..."}
                            </p>
                        </div>
                    </div>

                    {/* DESTINATION */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm text-gray-600'>
                                {ride?.destination?.address || "Loading destination..."}
                            </p>
                        </div>
                    </div>

                    {/* FARE */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>
                                ₹{ride?.fare || "--"}
                            </h3>
                            <p className='text-sm text-gray-600'>Cash</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver