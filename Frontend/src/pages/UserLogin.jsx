import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import autovelologo from '../assets/autovelologo.jpeg';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios'

const UserLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({})

    const { user, setUser } = useContext(UserDataContext)
    const navigate = useNavigate()


    const SubmitHandler = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)


        if (response.status === 200) {
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
        }
        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-25 h-20 mb-10' src={autovelologo} alt='' />
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
                    <p className='text-center'>New Here ? <Link to='/signup' className='text-blue-600'> Create new Account</Link> </p>
                </form>
            </div>
            <div>
                <Link to='/captain-login' className='bg-[#10b461]  flex item-center justify-center mb-5 text-white font-semibold mb-7 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Sign in as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin