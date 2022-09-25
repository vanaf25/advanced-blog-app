import React, {useState} from 'react';
import {useAppDispatch, useAppSelector, wrapper} from "../../store/store";
import {getTotalCount, getUsersSelector} from "../../store/selectors/profileSelectors";
import {
    Avatar,
    Button,
    CircularProgress,
    Divider, Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack
} from "@mui/material";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import Image from 'next/image'
import Link from 'next/link'
import InfiniteScroll from "react-infinite-scroller";
import {PAGE_SIZE} from "./constants/constants";
import {NextPage} from "next";
import Users from "./Users";
import {getUsers} from "../../store/thunks/profileThunks";
import {withAuth} from "../../utils/withAuth";
const style = {
    width: '100%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    margin:'0 auto'
};
const Rating:NextPage =React.memo( () => {
    const users=useAppSelector(getUsersSelector)
    const [currentPage,setCurrentPage]=useState(1)
    const totalCount=useAppSelector(getTotalCount);
    const pagesCount=Math.ceil(totalCount/PAGE_SIZE)
    const dispatch=useAppDispatch();
    const [isLoading,setIsLoading]=useState(false)
    const loadUsersHandle=async ()=>{
        if (pagesCount>currentPage && !isLoading){
            setIsLoading(true)
            await dispatch(getUsers({
                page:currentPage+1
            }))
            setCurrentPage(prevState => ++prevState)
            setIsLoading(false);
        }
    }
    return (
        <>
            {users &&  <List sx={style} component="nav" aria-label="mailbox folders">
                <Users users={users}/>
                <Stack justifyContent={"center"}>
                    {isLoading ? <CircularProgress />:
                        pagesCount>currentPage &&   <Button onClick={loadUsersHandle}>
                            Load more
                        </Button>}
                </Stack>
            </List>}
        </>
    );
});
export const getServerSideProps=withAuth(async (store)=>{
    const dispatch=store.dispatch
    await dispatch(getUsers({}))
})
export default Rating;
