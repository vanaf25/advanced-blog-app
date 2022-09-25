import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {LoginQueryArg, LoginResultType, RegistrationQueryArg,SimpleUserType} from "../../../types/authTypes";
import { login, setUserData } from '../../slices/authSlice';
import createHeaders, {prepareHeaders} from "../createHeaders";
import {HYDRATE} from "next-redux-wrapper";
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl:`http://localhost:5000/auth/`,
        prepareHeaders(headers, store){
            return prepareHeaders(headers,store)
        },
        headers:{}
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        login: builder.mutation<LoginResultType, LoginQueryArg>({
            query: (body) => ({
                url:"login",
                body,
                method:"POST",
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    const response=await queryFulfilled
                    if(response.data){
                        console.log(response.data)
                        dispatch(login(response.data))
                    }
                }
                catch (e) {

                }

            }
        }),
        me:builder.query<SimpleUserType,void>({
            query:()=>"me",
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                    try {
                    const response=await queryFulfilled
                        if (response.data){
                        dispatch(setUserData(response.data))
                    }
                }
                catch (e) {

                }

            }
        }),
        registration:builder.mutation<LoginResultType, RegistrationQueryArg>({
            query:(body)=>({
                url:"registration",
                body,
                method:"POST"
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    const response=await queryFulfilled
                    if(response.data){
                        dispatch(login(response.data))
                    }
                }
                catch (e) {

                }

            }
        })
    }),
})
export const {useLoginMutation,useMeQuery,useRegistrationMutation} = authApi
