import React from 'react'

const LocationSearchPanel = (props) => {
    console.log(props);


    // smaple array for location 
    const location = [
        " 24B ,Near Kapoor's cafe , Sheryiansh Coding School,Bhopal",
        " 22B ,Near Malhotra's cafe , Sheryiansh Coding School,Bhopal",
        " 20B ,Near singhania's cafe , Sheryiansh Coding School,Bhopal",
        " 24B ,Near sharma's cafe , Sheryiansh Coding School,Bhopal",
    ]
    return (
        <div>
            {/* this is a sample data */}
            {
                location.map(function (elem, idx) {
                    return (
                        <div key={idx} onClick={() => {
                            props.setVehiclePanel(true)
                            props.setPanelOpen(false)
                        }} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                            <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
                                <i className="ri-map-pin-fill"></i>
                            </h2>
                            <h4 className='font-medium'>{elem}</h4>
                        </div>
                    )
                })
            }



        </div>
    )
}

export default LocationSearchPanel