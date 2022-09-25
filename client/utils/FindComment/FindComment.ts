import {CommentsType, ExtendCommentType} from "../../types/postTypes";
const findComment=(comments:CommentsType,id:number,type:"items" | "comment",isParentId?:boolean)=>{
    const items=comments.items
    if (comments.total){
    let comment:any=items.find(item=>item.id===id)
        if (comment) return type==="items" ? isParentId ? comment.answers:comments:comment
        items.forEach(item=>{
            const foundedComment=findComment(item.answers,id,type,isParentId)
            if (foundedComment) comment=foundedComment
        })
         return  comment
    }
}
export default findComment
