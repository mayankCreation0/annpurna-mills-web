// mySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: false,
    loading: false,
    analytics: {},
    getData:{},
    mode:sessionStorage.getItem('mode') === null ? 'light' : sessionStorage.getItem('mode') , // initial state
    toast: { show: false, message: '', type: '' },
    staff:[],
    attendance:{},
};

export const MySlice = createSlice({
    name: 'my-slice',
    initialState,
    reducers: {
        handleAuth: (state, action) => {
            state.auth = action.payload;
        },
        handleLoading: (state, action) => {
            state.loading = action.payload;
        },
        handleAnalytics: (state, action) => {
            state.analytics = action.payload;
        },
        handleGetData: (state, action) => {
            state.getData = action.payload;
        },
        showToast: (state, action) => {
            state.toast = {
                show: true,
                message: action.payload.message,
                type: action.payload.type,
                theme: action.payload.theme || 'light',
            };
        },
        hideToast: (state) => {
            state.toast = { show: false, message: '', type: '' };
        },
        handleToggleTheme: (state) => {
            state.mode = state.mode !== 'light' ? 'light' : 'dark';
            sessionStorage.setItem('mode', `${state.mode !== 'light' ? 'dark' : 'light'}`);
        },
        handleStaff: (state, action) => {
            state.staff = action.payload
        },
        handleAttendance: (state, action) => {
            state.attendance = action.payload
        }
    }
});

export const { handleAuth, handleLoading, handleAnalytics,handleGetData, showToast, hideToast, handleToggleTheme,  handleAttendance, handleStaff  } = MySlice.actions;
export default MySlice.reducer;
