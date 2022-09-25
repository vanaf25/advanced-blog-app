import {wrapper} from "../store/store";
import {parseCookies} from "nookies";
import {setToken} from "../store/slices/authSlice";
import {authApi} from "../store/api/authApi/authApi";
import {Context} from "../types/apiTypes";
import {getIsAuth, getUser} from "../store/selectors/authSelectors";
import {pages} from "../constants/pages";
const checkForAuthPages=(resolvedUrl:string,isAuth:boolean,withParams:boolean)=>{
   return  pages.some(page=>{
        if (page.exactMatch ? page.href===resolvedUrl : resolvedUrl.includes(page.href)){
            if ((page.isPublic || isAuth) && (page.withParams ? withParams:true) )  return true
        }

    })
}
export  const  withAuth=(fn:(store:any,ctx:Context)=>any)=>{
    return wrapper.getServerSideProps(store=>async ctx=>{
        const dispatch=store.dispatch
        const {accessToken}=parseCookies(ctx);
        const { resolvedUrl,params } = ctx;
        if (accessToken){
            dispatch(setToken(accessToken));
            dispatch(authApi.endpoints.me.initiate())
            await Promise.all(authApi.util.getRunningOperationPromises())
            const state=store.getState();
            const user=getUser(state)
            const { resolvedUrl } = ctx;
            const isAuth=getIsAuth(state);
            const checkForPages=checkForAuthPages(resolvedUrl,isAuth,!!params);
            if (!checkForPages) return {
                redirect:{
                    destination:"/registration",
                    permanent: false
                }
            }
            if (!user.isActivated && isAuth && !resolvedUrl.includes('/activateAccount')){
                return {
                    redirect:{
                        destination: '/activateAccount',
                        permanent: false
                    }
                }
            }

        }
        else {
            if (resolvedUrl){
                const checkForPages=checkForAuthPages(resolvedUrl,false,!!params);
                if (!checkForPages) return {
                    redirect:{
                        destination:"/login",
                        permanent: false
                    }
                }
            }
            }
        const result=await fn(store,ctx)
        if (result) return result
        return {
            props:{

            }
        }
    } )
}
