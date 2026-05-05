import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'
import autovelologo from '../assets/autovelologo.jpeg';

const Captainlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    //const [captainData, setCaptainData] = useState('')

    const { captain, setCaptain } = React.useContext(CaptainDataContext)
    const navigate = useNavigate()


    const SubmitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const captain = {
            email: email,
            password
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

            if (response.status === 200) {
                const data = response.data

                setCaptain(data.captain)
                localStorage.setItem('token', data.token)
                navigate('/captain-home')

            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials')
        }
        
        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src={autovelologo} alt='' />
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                <form onSubmit={(e) => { SubmitHandler(e) }}>
                    <h3 className='text-lg font-medium mb-2'>What's Your email</h3>

                    <input value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base ' required type="email" placeholder='email@example.com' />
                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base ' required type='password' placeholder='password' />
                    <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Login</button>
                    <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a captain</Link> </p>
                </form>
            </div>
            <div>
                <Link to='/login' className='bg-[#d5622d]  flex item-center justify-center mb-5 text-white font-semibold mb-7 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Sign in as User</Link>
            </div>
        </div>
    )
}

export default Captainlogin;