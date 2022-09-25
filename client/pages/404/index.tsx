import React from 'react';
import {NextPage} from "next";
import NotFound from "../../common/NotFound/NotFound";

const NotFoundPage:NextPage = () => {
    return (
       <NotFound centered message={"Sorry, but this page was not found"}  />
    );
};
/*export const getStaticProps:GetStaticProps=wrapper.getStaticProps(store=>async (ctx)=>{
    // @ts-ignore
    const {accessToken}=parseCookies(ctx);
    const dispatch=store.dispatch
    if (accessToken){
        dispatch(setToken(accessToken));
        dispatch(authApi.endpoints.me.initiate())
        await Promise.all(authApi.util.getRunningOperationPromises())
    }
    return {
        props:{

        }
    }
})*/
export default NotFoundPage;
