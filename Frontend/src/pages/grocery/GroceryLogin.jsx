import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import autovelologo1 from '../../assets/autovelologo1.png'

const GroceryLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('groceryUser', email)
        navigate('/grocery/home')
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            <div>
                <img className='w-20 mb-10' src={autovelologo1} alt='' />

                <form onSubmit={handleSubmit}>

                    <h3 className='text-lg font-medium mb-2'>What's Your email</h3>
                    <input
                        required
                        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg'
                        type="email"
                        placeholder='email@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        required
                        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg'
                        type="password"
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className='bg-[#0c831f] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'>
                        Login
                    </button>

                </form>

                <p className='text-center'>
                    New Here? <Link to='/grocery/signup' className='text-green-700 font-medium'>Create new Account</Link>
                </p>

                {/* 🔥 NEW */}
                <p className='text-center mt-2'>
                    <Link to='/grocery/shop/login' className='text-blue-600'>
                        Login as Shopkeeper
                    </Link>
                </p>
            </div>

        </div>
    )
}

export default GroceryLogin