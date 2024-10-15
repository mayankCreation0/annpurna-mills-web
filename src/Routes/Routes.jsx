import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Layout from '../Layout/Layout';
import Loading from '../Components/Loading';

// Lazy load the components
const LoginPage = lazy(() => import('../Pages/login'));
const Home = lazy(() => import('../Pages/Dashboard'));
const FormPage = lazy(() => import('../Pages/FormPage'));
const CustomerList = lazy(() => import('../Pages/CustomerList'));
const ViewPage = lazy(() => import('../Pages/ViewPage'));
const EditPage = lazy(() => import('../Pages/EditPage'));
const StaffAttendance = lazy(() => import('../Pages/StaffAttendance'));
const TransactionHistory = lazy(() => import('../Pages/TransactionHistory'));
const ProfilePage = lazy(() => import('../Pages/ProfilePage'));

// Loading component for Suspense fallback

const AllRoutes = ({ mode, toggleColorMode }) => {
    // Common props for all private routes
    const commonProps = { mode, toggleColorMode };

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/' element={<PrivateRoutes><Layout /></PrivateRoutes>}>
                    <Route index element={<Home {...commonProps} />} />
                    <Route path='staff' element={<StaffAttendance {...commonProps} />} />
                    <Route path='customerLists' element={<CustomerList {...commonProps} />} />
                    <Route path='form' element={<FormPage {...commonProps} />} />
                    <Route path='history' element={<TransactionHistory {...commonProps} />} />
                    <Route path='view/:id' element={<ViewPage {...commonProps} />} />
                    <Route path='edit/:id' element={<EditPage {...commonProps} />} />
                    <Route path='profile' element={<ProfilePage {...commonProps} />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AllRoutes;