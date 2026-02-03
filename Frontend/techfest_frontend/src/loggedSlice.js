import { createSlice } from "@reduxjs/toolkit"

//slice - part of store
export const loggedSlice = createSlice ({
    name: "logged",
    initialState: {
        loggedIn : false,
        role: ""
    },
    reducers: {
        login:(state, action) => { return { loggedIn: true, role: action.payload} },
        logout: (state) => { return {loggedIn: false, role:""}  } 
    }
})

export const {login} = loggedSlice.actions
export const {logout} = loggedSlice.actions 
export default loggedSlice.reducer