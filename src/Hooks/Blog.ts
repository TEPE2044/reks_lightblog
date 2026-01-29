
import reapi from "../Requests/reapi"

export const query_my_blog = async() => {
    const res = await reapi({
        url:'/blog/my-blog',
        method:"GET"
    })
    return res;
}

export const upload_blog = async(title:string,content:string,tags:string[]) => {
    const res = await reapi({
        url:'/blog/my-blog/new',
        method:"POST",
        data:{
            title:title,
            content:content,
            tags:tags
        }
    })
    return res;
}