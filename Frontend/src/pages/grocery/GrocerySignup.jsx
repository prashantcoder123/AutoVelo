import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import autovelologo1 from '../../assets/autovelologo1.png'

const GrocerySignup = () => {

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
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

                    <h3 className='text-lg font-medium mb-2'>What's your name</h3>
                    <div className='flex gap-4 mb-6'>
                        <input
                            className='bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg'
                            type="text"
                            placeholder='First name'
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        <input
                            className='bg-[#eeeeee] rounded px-4 py-2 w-1/2 text-lg'
                            type="text"
                            placeholder='Last name'
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </div>

                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>
                    <input
                        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg'
                        type="email"
                        placeholder='email@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg'
                        type="password"
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className='bg-black text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'>
                        Create account
                    </button>

                </form>

                <p className='text-center'>
                    Already have a account? <Link to='/grocery/login' className='text-blue-600'>Login here</Link>
                </p>
            </div>

        </div>
    )
}

export default GrocerySignup