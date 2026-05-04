import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import Payment from './pages/Payment'
import GroceryLogin from './pages/grocery/GroceryLogin'
import GrocerySignup from './pages/grocery/GrocerySignup'
import GroceryHome from './pages/grocery/GroceryHome'
import GroceryShopLogin from './pages/grocery/GroceryShopLogin'
import GroceryShopSignup from './pages/grocery/GroceryShopSignup'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />
        <Route path='/captains/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
        <Route path="/grocery/login" element={<GroceryLogin />} />
        <Route path="/grocery/signup" element={<GrocerySignup />} />
        <Route path="/grocery/home" element={<GroceryHome />} />
        <Route path="/grocery/shop/login" element={<GroceryShopLogin />} />
        <Route path="/grocery/shop/signup" element={<GroceryShopSignup />} />

      </Routes>
    </div>
  )
}
export default App;