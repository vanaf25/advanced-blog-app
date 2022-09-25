const indexOf=(array:any[],id:number)=>{
    let index:number=-1;
    array.forEach((item,i)=>{
         if (item.id===id && index<0) index=i
    })
    return index
}
export default indexOf
const b=<T>():{ obk: number }=>({obk:3})
