/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { handleAuth, showToast } from '../Store/Reducers/Reducer';

const PrivateRoutes = ({ children }) => {
  const dispatch = useDispatch();



  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    dispatch(handleAuth(false));
    // dispatch(showToast({ message: 'Session expired. Please login again.', type: 'error' }));
  };
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      handleLogout();
    }
  }, [handleLogout]);
  const token = Cookies.get('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoutes;
