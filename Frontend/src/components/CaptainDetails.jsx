import React from 'react'

const CaptainDetails = () => {
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full obj-cover' src="https://imgs.search.brave.com/ZEMvWGNpv5LLOHF304uxZnf26LXqAAWNUkwKrDzErBo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDI5MjYzOC9waG90/by9mZW1hbGUtc29s/by1sYWR5LXNob3Bw/ZXItYXQtYS1yYW5k/b20tbG9jYWwtbmln/aHQtbWFya2V0LWlu/LWJhbmdrb2stdGhh/aWxhbmQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPUFvb0JJ/b0ZFSDVqb0J5aks4/QUhWTFJvZEtPcHFn/WWdBamt2Ynpuc1Ax/X1E9" alt="" />
                    <h4 className='text-lg font-medium'>Harsh Patel</h4>
                </div>
                <div>
                    <h4 className='text-lg font-semibold'>₹295.20</h4>
                    <p className='text-sm  text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className='text-3xl mb-2 font-thin ri-timer-2-line'></i>
                    <h5 className='text-lg font-medium'>
                        10.2
                    </h5>
                    <p className='text-sm text-gray-600'>
                        Hours Online
                    </p>

                </div>
                <div className='text-center'>
                    <i className='text-3xl mb-2 font-thin ri-speed-up-line'></i>
                    <h5 className='text-lg font-medium'>
                        10.2
                    </h5>
                    <p className='text-sm text-gray-600'>
                        Hours Online
                    </p>
                </div>
                <div className='text-center'>
                    <i className='text-3xl mb-2 font-thin ri-booklet-line'></i>
                    <h5 className='text-lg font-medium'>
                        10.2
                    </h5>
                    <p className='text-sm text-gray-600'>
                        Hours Online
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails