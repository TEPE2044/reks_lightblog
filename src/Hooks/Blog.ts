import reapi from "../Requests/reapi"

export const query_my_blog = async() => {
    const res = await reapi({
        url:'/blog/my-blog',
        method:"GET"
    })
    return res;
}