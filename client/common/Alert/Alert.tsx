import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {Alert, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {getAlertData} from "../../store/selectors/errorSelectors";
import {cleanAlertData} from '../../store/slices/errorSlice';
import {Stack} from "@mui/system";
export default function SimpleSnackbar() {
    const alertData=useAppSelector(getAlertData);
    const dispatch=useAppDispatch()
    const handleClose=()=>{
        dispatch(cleanAlertData())
        }
    return (
            <Snackbar
                anchorOrigin={{ vertical:"top", horizontal:"right" }}
                open={alertData.isOpen}
                autoHideDuration={1000}
                onClose={handleClose}
            >
                    <Alert severity={alertData.severity} >
                        <Stack direction={"row"} alignItems={"center"} spacing={0.5} >
                            <Typography>
                                {alertData.alertText}
                            </Typography>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleClose}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Alert>
            </Snackbar>
    );
}
