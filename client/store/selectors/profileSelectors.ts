import {RootState} from "../store";
export const getUsersSelector=(state:RootState)=>state.profile.users
export const getProfileSelector=(state:RootState)=>state.profile.profile
export const getTotalCount=(state:RootState)=>state.profile.totalUserCount
