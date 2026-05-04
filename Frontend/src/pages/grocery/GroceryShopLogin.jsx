import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const GroceryShopLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('groceryShop', email)
        navigate('/grocery/shop/dashboard')
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            <div>
                <h2 className='text-2xl font-bold mb-8'>Shopkeeper Login</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className='bg-gray-200 mb-4 p-2 w-full'
                        placeholder='Shop Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className='bg-gray-200 mb-4 p-2 w-full'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className='bg-[#0c831f] text-white w-full py-2 rounded'>
                        Login as Shopkeeper
                    </button>

                </form>

                <p className='mt-3 text-center'>
                    New shop? <Link to='/grocery/shop/signup' className='text-green-700'>Register here</Link>
                </p>

                <p className='mt-2 text-center'>
                    <Link to='/grocery/login'>Back to User Login</Link>
                </p>
            </div>

        </div>
    )
}

export default GroceryShopLogin