import { configureStore } from '@reduxjs/toolkit'
import MyReducer from './Reducers/Reducer'
 
export const store = configureStore({
    reducer : MyReducer,
})