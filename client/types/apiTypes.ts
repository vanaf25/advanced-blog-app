import {GetServerSidePropsContext, NextPageContext} from "next";

export type UpdateSuccessType={
    generatedMaps: Array<any>
    raw:Array<any>,
    affected: number
}
export type ItemsType<T>={
    items:T,
    total:number
}
export type DataType<T>={data:T}
export type Context=NextPageContext | GetServerSidePropsContext
