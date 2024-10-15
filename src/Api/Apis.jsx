import axios from 'axios';
import Cookies from 'js-cookie';
import { handleAnalytics, handleAuth, handleGetData, handleLoading, showToast } from '../Store/Reducers/Reducer';


const API_BASE_URL = process.env.REACT_APP_AMS_PROD_URL;

// Utility function to get headers with authorization token
const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Error handling utility
const handleApiError = (error, dispatch, navigate) => {
    if (error.response && error.response.status === 400) {
        dispatch(showToast({ message: 'Token expired, Login again', type: 'error' }));
        dispatch(handleAuth(false));
        navigate('/login');
    } else {
        dispatch(showToast({ message: 'An error occurred', type: 'error' }));
    }
    console.error('API Error:', error);
};


export const fetchRates = async() =>{
    try {
        const response = await axios.get(`${API_BASE_URL}api/metal-rates`);
        return response
    } catch (error) {
        console.log("Error while fetching rates" + error.message)
    }
}
// New function to get current location
const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

// Modified to include location update
export const updateDeviceLocation = async (dispatch, navigate) => {
    try {
        const location = await getCurrentLocation();
        const headers = getAuthHeaders();
        await axios.post(`${API_BASE_URL}user/device/update-location`, location, { headers });
    } catch (error) {
        console.error('Location update failed:', error);
        // Don't show toast for location failure, handle silently
    }
};
export const getActiveDevices = async (dispatch, navigate) => {
    try {
        dispatch(handleLoading(true));
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_BASE_URL}user/device/active-devices`, { headers });
        return response.data;
    } catch (error) {
        handleApiError(error, dispatch, navigate);
    } finally {
        dispatch(handleLoading(false));
    }
};

// Modified refreshData to include location update
export const refreshData = async (dispatch, navigate) => {
    try {
        const headers = getAuthHeaders();

        // Update location first
        await updateDeviceLocation(dispatch, navigate);

        // Call all APIs simultaneously
        const [listResponse, analyticsResponse, activeDevicesResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}user/get`, { headers }),
            axios.get(`${API_BASE_URL}user/get/analytics`, { headers }),
            axios.get(`${API_BASE_URL}user/device/active-devices`, { headers })
        ]);

        // Update state with the responses
        dispatch(handleGetData(listResponse.data));
        dispatch(handleAnalytics(analyticsResponse.data));

        return {
            userData: listResponse.data,
            analytics: analyticsResponse.data,
            activeDevices: activeDevicesResponse.data
        };
    } catch (error) {
        handleApiError(error, dispatch, navigate);
    }
};

export const loginApi = async ({ username, password }, dispatch, navigate) => {
    try {
        dispatch(handleLoading(true));

        const response = await axios.post(`${API_BASE_URL}login`, { username, password });

        if (response.status === 200) {
            const { token, userData } = response.data;

            // Set the token cookie with an expiration of 7 days
            Cookies.set('token', token, { expires: 7, path: '/' });

            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(userData));

            // Dispatch actions for successful login
            dispatch(handleAuth(true));
            dispatch(showToast({ message: `Welcome back, ${userData.name}!`, type: 'success' }));

            // Navigate to home page on successful login
            navigate('/');
            // Refresh data
            await refreshData(dispatch, navigate);
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        Cookies.remove('token', { path: '/' });
        dispatch(showToast({ message: 'Login failed', type: 'error' }));
    } finally {
        dispatch(handleLoading(false));
    }
};

export const signupApi = async ({ name,username, password }, dispatch, navigate) => {
    try {
        dispatch(handleLoading(true));
        
        const response = await axios.post(`${API_BASE_URL}signup`, { name,username, password });
        
        if (response.status === 200) {            // Dispatch actions for successful login
            dispatch(handleAuth(true));
            dispatch(showToast({ message: 'Signup successful', type: 'success' }));
        } else if(response.status === 401) {
            // Handle unexpected response status
            throw new Error('Username or password is incorrect');
        }
    } catch (error) {
        // If login fails, remove any existing token cookie        
        // Dispatch actions for login failure
        dispatch(showToast({ message: 'Signup failed', type: 'error' }));
    } finally {
        // Ensure loading state is reset in both success and error cases
        dispatch(handleLoading(false));
    }
    
    // Navigate to home page on successful login
    navigate('/login');
};
export const postFormData = async (formData, dispatch, navigate) => {
    try {
        dispatch(handleLoading(true));
        const token = Cookies.get('token');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'  // Add this line
        };

        // Log the FormData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        await axios.post(`${API_BASE_URL}user/add`, formData, { headers });
        dispatch(handleLoading(false));
        dispatch(showToast({ message: 'Form data submitted successfully', type: 'success' }));
        navigate('/customerLists');

        // Refresh data
        await refreshData(dispatch, navigate);
    } catch (error) {
        console.error('Error submitting form:', error);  // Add this line for debugging
        if (error.response && error.response.status === 400) {
            dispatch(showToast({ message: 'Token expired, Login again', type: 'error' }));
            dispatch(handleAuth(false));
            navigate('/login');
        } else {
            dispatch(showToast({ message: 'Failed to submit form data', type: 'error' }));
        }
        dispatch(handleLoading(false));
    }
}
// Modified getList to include location update
export const getList = async (dispatch, navigate) => {
    try {
        dispatch(handleLoading(true));

        // Update location first
        await updateDeviceLocation(dispatch, navigate);

        const headers = getAuthHeaders();
        const response = await axios.get(`${API_BASE_URL}user/get`, { headers });
        dispatch(handleGetData(response.data));
        return response;
    } catch (error) {
        handleApiError(error, dispatch, navigate);
    } finally {
        dispatch(handleLoading(false));
    }
};
export const getAnalytics = async (dispatch, navigate) => {
    const token = Cookies.get('token');
    try {
        dispatch(handleLoading(true));
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}user/get/analytics`, { headers });
        dispatch(handleAnalytics(response.data));
        dispatch(handleLoading(false));
        return response;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            dispatch(showToast({ message: 'Token expired, Login again', type: 'error' }));
            dispatch(handleAuth(false));
            navigate('/login');
        }
        dispatch(handleLoading(false));
    }
};

export const getDetailsById = async (id, dispatch, navigate) => {
    dispatch(handleLoading(true));
    const token = Cookies.get('token');
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}user/get/${id}`, { headers });
        console.log("fetchby id", response)
        dispatch(handleLoading(false));
        return response;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            dispatch(showToast({ message: 'Token expired, Login again', type: 'error' }));
            dispatch(handleAuth(false));
            navigate('/login');
        }
        dispatch(handleLoading(false));
    }
}

export const deleteData = async (id, dispatch, navigate) => {
    dispatch(handleLoading(true));
    const token = Cookies.get('token');
    try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE_URL}user/delete/${id}`, { headers });
        dispatch(showToast({ message: 'Customer deleted successfully', type: 'success', theme: "colored" }));
        dispatch(handleLoading(false));

        // Refresh data
        await refreshData(dispatch, navigate);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            dispatch(showToast({ message: 'Token expired, Login again', type: 'error' }));
            dispatch(handleAuth(false));
            navigate('/login');
        } else {
            dispatch(showToast({ message: 'Failed to delete customer data', type: 'error' }));
        }
        dispatch(handleLoading(false));
    }
}

export const updateData = async (data, dispatch, navigate, id) => {
    try {
        dispatch(handleLoading(true));
        const token = Cookies.get('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        let requestBody;

        if (data instanceof FormData) {
            headers['Content-Type'] = 'multipart/form-data';
            requestBody = data;
        } else {
            headers['Content-Type'] = 'application/json';
            requestBody = {
                customerData: {
                    Name: data.Name,
                    Gender: data.Gender,
                    Address: data.Address,
                    PhoneNumber: data.PhoneNumber
                },
                loanData: data.Loans.map(loan => ({
                    ...loan,
                    _id: loan._id,
                    PaidLoan: loan.PaidLoan || [] // Ensure PaidLoan is always an array
                }))
            };
        }

        const response = await axios.patch(`${API_BASE_URL}user/update/${id}`, requestBody, { headers });
        dispatch(handleLoading(false));
        dispatch(showToast({ message: 'Customer data updated successfully', type: 'success' }));

        // Return the updated customer data
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        dispatch(handleLoading(false));
        dispatch(showToast({ message: 'Failed to update customer data', type: 'error' }));
        throw error;
    }
};

export const emailCsv = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_AMS_PROD_URL}user/archive-and-send-email`);
        dispatch(showToast({ message: 'Email sent successfully', type: 'success' }));
        return response;
    } catch (error) {
        dispatch(showToast({ message: 'Failed to send email', type: 'error' }));
        throw error; // rethrow the error to handle it in the caller function
    }
};