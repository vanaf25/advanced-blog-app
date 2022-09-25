import {GetServerSidePropsContext, GetStaticPropsContext, NextPageContext} from "next";
import Cookies, {parseCookies} from "nookies";
import axios from "axios";
import {authApi} from "./authApi";
import {profileApi} from "./profileApi";
import {postsApi} from "./postsApi";
import {commentsApi} from "./commentsApi";
import {Context} from "../types/apiTypes";
import {tagsApi} from "./tagsApi";
export const Api=(ctx?:Context)=>{
    // @ts-ignore
    const cookies=ctx ? Cookies.get(ctx):parseCookies()
    const  token=cookies.accessToken
    const instance=axios.create({
        baseURL:"http://localhost:5000",
        headers:{
            Authorization:`Bearer ${token || null}`
        }
    })
    return {
        auth:authApi(instance),
        profile:profileApi(instance),
        posts:postsApi(instance),
        comments:commentsApi(instance),
        tags:tagsApi(instance)
    }
}
