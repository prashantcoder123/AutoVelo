// import React from 'react'
// import { Link } from 'react-router-dom';
// import autovelologo1 from '../assets/autovelologo1.png';
// const Start = () => {
//     return (
//         <div>
//             <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1760959575439-47e7a4b897e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8)] h-screen pt-8  flex justify-between flex-col w-full '>
//                 <img className='w-20 h-15 ml-8' src={autovelologo1} alt='' />
//                 <div className='bg-white  pb-10 py-4 px-4'>
//                     <h2 className='text-2xl font-bold'>Get Started with AutoVelo</h2>
//                     <Link to='/login' className='flex items-center justify-center w-full bg-black text-white  py-3 rounded-lg mt-5'> Continue</Link>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Start;

import React from 'react'
import { useNavigate } from 'react-router-dom';
import autovelologo1 from '../assets/autovelologo1.png';

const Start = () => {
    const navigate = useNavigate();

    const handleSelect = (type) => {
        if (type === 'ride') {
            navigate('/login');
        } else if (type === 'food') {
            navigate('/food/login');
        } else if (type === 'grocery') {
            navigate('/grocery/login');
        }
    };

    return (
        <div>
            <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1760959575439-47e7a4b897e8?w=600&auto=format&fit=crop&q=60)] h-screen pt-8 flex justify-between flex-col w-full'>

                <img className='w-20 h-15 ml-8' src={autovelologo1} alt='' />

                <div className='bg-white pb-10 py-4 px-4 rounded-t-3xl'>
                    <h2 className='text-2xl font-bold'>Get Started with AutoVelo</h2>

                    <div className='flex flex-col gap-3 mt-5'>

                        <button
                            onClick={() => handleSelect('ride')}
                            className='w-full bg-black text-white py-3 rounded-lg'
                        >
                            🚖 Ride Booking
                        </button>
                        <button
                            onClick={() => handleSelect('grocery')}
                            className='w-full bg-green-500 text-white py-3 rounded-lg'
                        >
                            🛒 Grocery Delivery
                        </button>

                        <button
                            onClick={() => handleSelect('food')}
                            className='w-full bg-orange-500 text-white py-3 rounded-lg'
                        >
                            🍔 Food Delivery
                        </button>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default Start;