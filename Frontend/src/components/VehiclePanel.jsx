import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 '
                onClick={() => { props.setVehiclePanel(false) }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
            }} className='flex border-2 active:border-black  mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-15' src="https://imgs.search.brave.com/kbBvcsA3fT1WRvJcKxgtkkw9I940cnAx6D3mpMoxvm4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/OTQ3LzIxNi9zbWFs/bC93aGl0ZS1jaXR5/LWNhci1pc29sYXRl/ZC1vbi10cmFuc3Bh/cmVudC1iYWNrZ3Jv/dW5kLTNkLXJlbmRl/cmluZy1pbGx1c3Ry/YXRpb24tZnJlZS1w/bmcucG5n" alt="" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'> UberGo <spam><i className="ri-user-3-line">4</i></spam></h4>
                    <h5 className='font-medium text-sm'> 2 Mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides </p>
                </div>
                <h2 className='text-lg font-semibold'>₹193.20</h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-15' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n" alt="" />
                <div className='-ml-1 w-1/2'>
                    <h4 className='font-medium text-base'> Moto <spam><i className="ri-user-3-line">1</i></spam></h4>
                    <h5 className='font-medium text-sm'> 3 Mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, motorcycle rides </p>
                </div>
                <h2 className='text-lg font-semibold'>₹65</h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3  items-center justify-between'>
                <img className='h-15' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA==" alt="" />
                <div className='-ml-2 w-1/2'>
                    <h4 className='font-medium text-base'> Auto <spam><i className="ri-user-3-line">3</i></spam></h4>
                    <h5 className='font-medium text-sm'> 3 Mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, auto rides </p>
                </div>
                <h2 className='text-lg font-semibold'>₹120</h2>
            </div>
        </div>
    )
}

export default VehiclePanel