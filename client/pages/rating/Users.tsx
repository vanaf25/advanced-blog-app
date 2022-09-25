import React from 'react';
import {ExtendUserType} from "../../types/users";
import {Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Stack} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import stringAvatar from "../../utils/stringToColor/stringToColor";
import InfiniteScroll from "react-infinite-scroller";

const Users:React.FC<{users:ExtendUserType[]}> = ({users}) => {
    return (
        <>
            {users.map((user,index)=><div key={index}>
                <ListItem>
                    <Link href={`/profile/${user.id}`}>
                        <a>
                            <ListItemAvatar>
                                <Stack sx={{mr:1}}  direction={"row"} alignItems={"center"}>
                                    <ListItemText sx={{mr:2}} primary={index+1} />
                                    {user.logo ?  <Image
                                            width={50}
                                            height={50}
                                            layout={"intrinsic"}
                                            alt={"logo"}
                                            src={user.logo}
                                        />
                                        : <Avatar  {...stringAvatar(user.fullName)} /> }
                                </Stack>
                            </ListItemAvatar>
                        </a>
                    </Link>
                    <ListItemText primary={ user.fullName} />
                    <ListItemText style={{color:`${user.rating>0 ? "green":user.rating<0 ? "red":"#333" }`}} primary={user.rating} />
                </ListItem>
                {users.length!==index+1 && <Divider/>}
            </div>)}
        </>
    );
};

export default Users;
