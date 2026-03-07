import regql from "../Requests/regql";

export interface FollowResult {
  msg: string;
  status: number;
}

export interface FollowingUser {
  rid: number;
  username: string;
  avatar: string | null;
  signature: string | null;
}

// handle follow
export const handleFollow = async (fid: number) => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        mutation MyMutation($fid: Int!) {
          follow(fid: $fid) {
            msg
            status
          }
        }
      `,
      variables: { fid },
    });

    return data.data.follow as FollowResult;
  } catch (error) {
    console.error("关注失败:", error);
    throw error;
  }
};

export const handleUnFollow = async (fid: number) => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        mutation MyMutation($fid: Int!) {
          unfollow(fid: $fid) {
            msg
            status
          }
        }
      `,
      variables: { fid },
    });

    return data.data.unfollow as FollowResult;
  } catch (error) {
    console.error("关注失败:", error);
    throw error;
  }
};

export const queryFollowingList = async () => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        query MyQuery {
          followingList {
            rid
            username
            avatar
            signature
          }
        }
      `,
    });

    return (data.data.followingList || []) as FollowingUser[];
  } catch (error) {
    console.error("获取关注列表失败:", error);
    throw error;
  }
};
