export class CommentDto {
    id:number;
    fullName:string;
    logo:string;
    constructor(id:number,fullName:string,logo:string) {
        this.id=id
        this.fullName=fullName
        this.logo=logo
    }
}
