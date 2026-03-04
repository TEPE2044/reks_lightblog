import regql from "../Requests/regql";

export const searchUser = async (page: number, pageSize: number, who: string) => {
  const res = await regql.post("/seaql", {
    query: `
        query MyQuery($page: Int!, $pageSize: Int!, $who: String!) {
            user(p: {page: $page, pageSize: $pageSize}, who: $who)
        }
    `,
    variables: {
      page,
      pageSize,
      who,
    },
  });

  return res.data.data.user;
};

export const searchMusic = async (
  page: number,
  pageSize: number,
  content: string,
) => {
  const res = await regql.post("/seaql", {
    query: `
        query MyQuery($page: Int!, $pageSize: Int!, $content: String!) {
            music(content: $content, p: {page: $page, pageSize: $pageSize})
        }
    `,
    variables: {
      page,
      pageSize,
      content,
    },
  });

  return res.data.data.music;
};

export const searchBlog = async (
  page: number,
  pageSize: number,
  content: string,
) => {
  const res = await regql.post("/seaql", {
    query: `
       query MyQuery {
            blog(content: "${content}", p: {page: ${page}, pageSize: ${pageSize}})
        }       
    `,
  });

  return res.data.data.blog;
};

export const searchBlogTag = async (
  page: number,
  pageSize: number,
  tags: string[],
) => {
  const res = await regql.post("/seaql", {
    query: `
       query MyQuery($tags: [String!]!, $page: Int!, $pageSize: Int!) {
            blogTag(p: {page: $page, pageSize: $pageSize}, tags: $tags)
        }          
    `,
    variables: {
      tags,     
      page,
      pageSize
    }
  });
  return res.data.data.blogTag;
};

