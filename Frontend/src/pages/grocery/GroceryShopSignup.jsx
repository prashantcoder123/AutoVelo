import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const GroceryShopSignup = () => {

    const [shopName, setShopName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        localStorage.setItem('groceryShop', email)

        navigate('/grocery/shop/dashboard')
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-center'>

            <h2 className='text-2xl font-bold mb-6 text-center'>Shopkeeper Signup</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className='bg-gray-200 mb-4 p-3 w-full rounded'
                    placeholder='Shop Name'
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                />

                <input
                    className='bg-gray-200 mb-4 p-3 w-full rounded'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className='bg-gray-200 mb-4 p-3 w-full rounded'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className='bg-[#0c831f] text-white w-full py-3 rounded font-semibold'>
                    Register Shop
                </button>

            </form>

            {/* 🔥 ADD THIS */}
            <p className='text-center mt-4'>
                Already have a shop?{" "}
                <Link
                    to="/grocery/shop/login"
                    className="text-green-700 font-medium"
                >
                    Login here
                </Link>
            </p>

        </div>
    )
}

export default GroceryShopSignup