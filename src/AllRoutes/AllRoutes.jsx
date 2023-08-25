import React from 'react'
import { Route,Routes } from 'react-router-dom'
import LoginForm from '../Pages/LoginPage'
import HomePage from '../Pages/HomePage'
import SignupForm from '../Pages/Signup'

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginForm/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        {/* <Route path='/home' element={<HomePage/>}/> */}
      </Routes>
    </div>
  )
}

export default AllRoutes
