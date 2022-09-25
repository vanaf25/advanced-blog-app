import {AxiosInstance} from "axios";

export const tagsApi=(instance:AxiosInstance)=>({
  async getTags(query:{tagName:string}){
        const{data}= await instance.get('/tags',{params:query})
      return data
    }
})
