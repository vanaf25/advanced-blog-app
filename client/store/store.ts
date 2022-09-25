import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "./api/authApi/authApi";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import authReducer from './slices/authSlice'
import {profileApi} from "./api/profileApi";
import {createWrapper} from "next-redux-wrapper";
import sideBarSlice from './slices/sideBarSlice';
import profileSlice from './slices/profileSlice';
import postsSlice from './slices/postsSlice'
import {postsApi} from "./api/postsApi";
import commentSlice from "./slices/commentSlice";
import errorSlice from './slices/errorSlice';
export const makeStore = () =>configureStore({
        reducer:{
            [authApi.reducerPath]: authApi.reducer,
            [profileApi.reducerPath]:profileApi.reducer,
            [postsApi.reducerPath]:postsApi.reducer,
            posts:postsSlice,
            auth:authReducer,
            sideBar:sideBarSlice,
            profile:profileSlice,
            comments:commentSlice,
            error:errorSlice
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat([authApi.middleware,profileApi.middleware]),
    });
 export const store=makeStore();
type Store = ReturnType<typeof makeStore>;
export type RootState = ReturnType<Store['getState']>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const wrapper=createWrapper<Store>(makeStore)
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types
