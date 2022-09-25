export enum InputsType{
    TEXT="text",
    PASSWORD="password",
    CHECKBOX="checkbox",
    RADIO="radio",
    EMAIL="email",
    NUMBER="number",
    FILE="file"
}
export type FieldType<T>={
    id:number,
    name:keyof T,
    rules?:any,
    typeOfField:InputsType,
    defaultValue?:string | boolean,
    subItems?:any[]
}
