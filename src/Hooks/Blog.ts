import reapi from "../Requests/reapi";
import type { BlogData, HotBlogItem } from "../Utils/reks-interface";

export interface BlogCursorResponse {
  items: BlogData[];
  next_cursor: number | null;
  has_more: boolean;
}

export interface HotBlogResponse {
  msg: string;
  blogs: HotBlogItem[];
}

export interface SaveBlogResponse {
  msg: boolean;
  blog_id: number;
  state: number;
}

export const query_my_blog = async () => {
  const res = await reapi({
    url: "/blog/my-blog",
    method: "GET",
    params: {
      state_: 1,
    },
  });
  return res.data;
};

export const query_hot_blog = async (_limit:number) => {
  const res = await reapi({
    url: "/blog/hot",
    method: "GET",
    params: {
      m_limit: _limit,
    },
  });
  return res.data as HotBlogResponse;
};

export const query_hot_blog_cursor = async (
  cursor: number | null,
  limit = 9,
) => {
  const res = await reapi({
    url: "/blog/hot/cursor",
    method: "POST",
    data: {
      cursor,
      limit,
    },
  });
  return res.data as BlogCursorResponse;
};

export const query_my_draft = async (
  cursor: number | null,
  limit = 9
) => {
  const res = await reapi({
    url: "/blog/my-draft/cursor",
    method: "POST",
    data: {
      cursor,
      limit
    },
  });
  return res.data as BlogCursorResponse;
};

export const query_blog_by_id = async (id: number) => {
  const res = await reapi({
    url: `/blog/${id}`,
    method: "GET",
  });
  return res.data;
};

export const query_draft_by_id = async (id: number) => {
  const res = await reapi({
    url: `/blog/draft/${id}`,
    method: "GET",
  });
  return res.data;
};

export const query_blog_by_user_id = async (rid: number) => {
  const res = await reapi({
    url: `/blog/user/${rid}`,
    method: "GET",
  });
  return res.data;
};

export const query_blog_by_user_id_cursor = async (
  rid: number,
  cursor: number | null,
  limit = 9
) => {
  const res = await reapi({
    url: `/blog/user/${rid}/cursor`,
    method: "POST",
    data: {
      cursor,
      limit,
    },
  });
  return res.data as BlogCursorResponse;
};

export const query_my_blog_cursor = async (
  cursor: number | null,
  limit = 9
) => {
  const res = await reapi({
    url: "/blog/my-blog/cursor",
    method: "POST",
    data: {
      cursor,
      limit,
    },
  });
  return res.data as BlogCursorResponse;
};
export const upload_mblog = async (
  title: string,
  content: string,
  cover: string[],
  tags: string[],
  mid: number
) => {
  const res = await reapi({
    url: "blog/my-blog/new-mblog",
    method: "POST",
    data: {
      title: title,
      content: content,
      cover: cover,
      tags: tags,
      music_id: mid,
    },
  });
  return res.data;
};

// blog_id是0表示新建博客，非0表示编辑博客
export const save_blog = async (
  data: {
    title: string;
    content: string;
    cover: string[];
    tags: string[];
  },
  options?: {
    blog_id?: number;
    state?: number;
  }
) => {
  const res = await reapi({
    url: "/blog/my-blog/save",
    method: "POST",
    params: {
      blog_id: options?.blog_id,
      state: options?.state ?? 0,
      type_: 1,
    },
    data,
  });
  return res.data as SaveBlogResponse;
};

export const upload_blog = async (
  title: string,
  content: string,
  cover: string[],
  tags: string[]
) => {
  return await save_blog({ title, content, cover, tags }, { state: 1 });
};

export const update_blog = async (
  id: number,
  title: string,
  content: string,
  cover: string[],
  tags: string[]
) => {
  return await save_blog(
    { title, content, cover, tags },
    { blog_id: id, state: 1 }
  );
};

export const update_draft = async (
  id: number,
  title: string,
  content: string,
  cover: string[],
  tags: string[]
) => {
  return await save_blog(
    { title, content, cover, tags },
    { blog_id: id, state: 0 }
  );
};

export const delete_blog = async (blog_id: Number) => {
  const res = await reapi({
    url:`/blog/delete`,
    method:'DELETE',
    params:{
      blog_id
    }
  })
  return res;
}


export const get_hot_tags = async() => {
  const res = await reapi({
    url:`/blog/tags/hot`,
    method:`GET`
  })
  return res.data.tags
}
