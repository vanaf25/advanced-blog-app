import {RootState} from "../store";
export const getIsAuth=(state:RootState)=>state.auth.isAuth
export const getUser=(state:RootState)=>state.auth.user
