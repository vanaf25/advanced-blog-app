import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "../components/Layout/Layout";
import {wrapper} from "../store/store";
import NextNProgress from "nextjs-progressbar";
import {parseCookies} from "nookies";
import {setToken} from '../store/slices/authSlice';
import {authApi, useMeQuery} from "../store/api/authApi/authApi";
import {getIsAuth} from "../store/selectors/authSelectors";
function MyApp({ Component, pageProps }: AppProps ) {
    return(
        <Layout>
            <NextNProgress/>
            <Component {...pageProps} />
        </Layout>
    )
}
/*MyApp.getInitialProps=wrapper.getInitialAppProps(store=>async ({ctx,Component})=>{
    try {
            const state=store.getState();
            const {accessToken}=parseCookies(ctx)
            const isAuth=getIsAuth(state);
            if (!isAuth && accessToken){
                const dispatch=store.dispatch
                dispatch(setToken(accessToken));
                dispatch(authApi.endpoints.me.initiate())
                await Promise.all(authApi.util.getRunningOperationPromises())
            }
    }
    catch (e) {
        console.log(e);
    }
    return { pageProps:{
            ...(Component.getInitialProps ? await Component.getInitialProps({...ctx,store}):{}),
        }}
})*/
export default wrapper.withRedux(MyApp)
