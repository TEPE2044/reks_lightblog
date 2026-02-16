
import reapi from "../Requests/reapi"

export const query_my_blog = async() => {
    const res = await reapi({
        url:'/blog/my-blog',
        method:"GET"
    })
    return res.data;
}

export const query_blog_by_id = async(id:number) => {
    const res = await reapi({
        url:`/blog/${id}`,
        method:"GET"
    })
    return res.data;
}

export const upload_blog = async(title:string,content:string,cover:string[],tags:string[]) => {
    const res = await reapi({
        url:'/blog/my-blog/new',
        method:"POST",
        data:{
            title:title,
            content:content,
            cover:cover,
            tags:tags
        }
    })
    return res;
}