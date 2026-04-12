import React from 'react'
import { Link } from 'react-router-dom';
import autovelologo from '../assets/autovelologo.jpeg';
const Start = () => {
    return (
        <div>
            <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1760959575439-47e7a4b897e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8)] h-screen pt-8  flex justify-between flex-col w-full '>
                <img className='w-20 h-15 ml-8' src={autovelologo} alt='' />
                <div className='bg-white  pb-10 py-4 px-4'>
                    <h2 className='text-2xl font-bold'>Get Started with AutoVelo</h2>
                    <Link to='/login' className='flex items-center justify-center w-full bg-black text-white  py-3 rounded-lg mt-5'> Continue</Link>
                </div>
            </div>
        </div>
    )
}
export default Start;