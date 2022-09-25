import React from 'react';
import {Paper, Stack, Typography} from "@mui/material";
import Image from "next/image";
import notFoundImage from "../../assets/notFound.gif";
import {makeStyles} from "@mui/styles";
import classnames from 'classnames';
import styles from './NotFound.module.scss'
interface NotFoundProps {
    message:string,
    centered?:boolean
}
const NotFound:React.FC<NotFoundProps> = ({message,centered}) => {
    return (
        <Paper className={classnames({
            [styles.container]:true,
            [styles.centered]:centered
        })}>
            <Stack  sx={{height:"100%"}} justifyContent={"center"} alignItems={"center"} >
                <Image layout={"intrinsic"} src={notFoundImage}
                       width={400}
                       height={300}
                       style={{marginBottom:"10px !important"}}
                       alt={"404 Not Found"} />
                <Typography>{message}</Typography>
            </Stack>
        </Paper>
    );
};

export default NotFound;
