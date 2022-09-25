import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {deletePost} from "../thunks/postsThunks";
export enum AlertSeverity{
    Error="error",
    Success="success",
    Info="info",
    Warning="warning"
}
type AlertData={
    alertText:string,
    severity: AlertSeverity,
    isOpen?:boolean
}
const initialState = {
   alertData:{
       isOpen:false,
       alertText:"",
       severity:AlertSeverity.Success
   } as AlertData
}
const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers:{
        setErrorText:(state,action:PayloadAction<AlertData>)=>{
          state.alertData=action.payload
            if (state.alertData.isOpen===undefined) state.alertData.isOpen=true
        },
        cleanAlertData:(state,)=>{
            state.alertData={
                isOpen:false,
                alertText:"",
                severity:AlertSeverity.Success
            }
        }
    },
    extraReducers:builder =>{
        builder.addCase(deletePost.rejected,(state,action)=>{
            state.alertData={
                isOpen:true,
                alertText:action.error.message as string,
                severity:AlertSeverity.Error
            }
        })
    }
})
export const {setErrorText,cleanAlertData} = errorSlice.actions
export default errorSlice.reducer
