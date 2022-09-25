export class SearchDto {
    take?:number
    page?:number
    orderBy?:"popular" | "new"
    parentId?:number
    type:"post" | "user"
}
