import {GetServerSidePropsContext, NextPageContext} from "next";
import Cookies, {parseCookies} from 'nookies'
import {RootState} from "../store";
import {BaseQueryApi} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
class EventObserver {
    observers:Array<any>
    constructor () {
        this.observers = []
    }

    subscribe (fn:any):any {
        this.observers.push(fn)
    }

    unsubscribe (fn:any) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn)
    }

    broadcast (data:any) {
        this.observers.forEach(subscriber => subscriber(data))
    }
}
let token:string | null;
export const observer=new EventObserver()
const createHeaders=(ctx?:NextPageContext | GetServerSidePropsContext)=>{
    if (!token){
        const cookies=ctx ? Cookies.get(ctx):parseCookies()
        token=cookies.accessToken
    }
    return {
        Authorization:`Bearer ${token}`
    }
}
export const prepareHeaders=(headers:Headers,
                             { getState }:Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">)=>{
    const token=(getState() as RootState).auth?.token || parseCookies()?.accessToken
    if (token) {
        headers.set('Authorization', `Bearer ${token || null}`)
    }
    return headers
}
export default createHeaders
