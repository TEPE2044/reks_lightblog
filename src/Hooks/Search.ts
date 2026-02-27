import regql from "../Requests/regql";

export const searchUser = async (who: string) => {
  const res = await regql.post("", {
    query: `
        query MyQuery {
            user(p: {page: 1, pageSize: 10}, who: ${who})
        }       
    `,
  });

  return res.data.data;
};

export const searchBlog = async (
  page: number,
  pageSize: number,
  content: string,
) => {
  const res = await regql.post("", {
    query: `
       query MyQuery {
            blog(content: ${content}, p: {page: ${page}, pageSize: ${pageSize}})
        }       
    `,
  });

  return res.data.data;
};

export const searchBlogTag = async (
  page: number,
  pageSize: number,
  tags: string[],
) => {
  const res = await regql.post("", {
    query: `
       query MyQuery {
            blogTag(p: {page: ${page}, pageSize: ${pageSize}}, tags: ${tags})
        }          
    `,
  });

  return res.data.data;
};
