import React, { useContext } from 'react'
import { Navigate, Route,Routes } from 'react-router-dom'
import LoginForm from '../Pages/LoginPage'
import HomePage from '../Pages/HomePage'
import SignupForm from '../Pages/Signup'
import { context } from '../Context/Appcontext'
import Dashboard from '../Pages/Dashboard'


const AllRoutes = () => {
  const { authstate } = useContext(context)
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginForm/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/home' element={authstate ? <HomePage /> : <Navigate to="/" />} />
        <Route path='/dashboard' element={authstate ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default AllRoutes
