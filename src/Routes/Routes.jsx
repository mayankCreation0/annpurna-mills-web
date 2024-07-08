import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Layout from '../Layout/Layout';
import LoginPage from '../Pages/login';
import StaffAttendance from '../Pages/StaffAttendance';
import Home from '../Pages/Dashboard';
import CustomerList from '../Pages/CustomerList';
import FormPage from '../Pages/FormPage';
import ViewPage from '../Pages/ViewPage';
import EditPage from '../Pages/EditPage';
import TransactionHistory from '../Pages/TransactionHistory';
import SignupPage from '../Pages/Signup';

// Lazy load the components
/* const LoginPage = lazy(() => import('../Pages/login'));
const Home = lazy(() => import('../Pages/Dashboard'));
const FormPage = lazy(() => import('../Pages/FormPage'));
const CustomerList = lazy(() => import('../Pages/CustomerList'));
const ViewPage = lazy(() => import('../Pages/ViewPage'));
const EditPage = lazy(() => import('../Pages/EditPage'));
const StaffAttendance = lazy(() => import('../Pages/StaffAttendance')); */

const AllRoutes = ({ mode, toggleColorMode }) => {
    return (
   
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} /> 
                
                <Route path='/' element={<PrivateRoutes><Layout /></PrivateRoutes>} >
                    <Route path='/staff' element={<PrivateRoutes><StaffAttendance mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/' element={<PrivateRoutes><Home mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/customerLists' element={<PrivateRoutes><CustomerList mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/form' element={<PrivateRoutes><FormPage mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/history' element={<PrivateRoutes><TransactionHistory mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/view/:id' element={<PrivateRoutes><ViewPage mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                    <Route path='/edit/:id' element={<PrivateRoutes><EditPage mode={mode} toggleColorMode={toggleColorMode} /></PrivateRoutes>} />
                </Route>
            </Routes>
       
    );
};

export default AllRoutes;
