import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    isOpen:true
}
const sideBarSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleSideBar(state){
            state.isOpen=!state.isOpen
        },
        closeSideBar(state){
            state.isOpen=false
        }
    }
})

export const {toggleSideBar,closeSideBar} = sideBarSlice.actions
export default sideBarSlice.reducer
