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

export interface FollowStats {
  followingCount: number;
  followerCount: number;
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

export const queryFollowerList = async () => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        query MyQuery {
          followerList {
            rid
            username
            avatar
            signature
          }
        }
      `,
    });

    return (data.data.followerList || []) as FollowingUser[];
  } catch (error) {
    console.error("获取粉丝列表失败:", error);
    throw error;
  }
};

export const queryFollowStats = async () => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        query MyQuery {
          followStats {
            followingCount
            followerCount
          }
        }
      `,
    });

    return data.data.followStats as FollowStats;
  } catch (error) {
    console.error("获取关注统计失败:", error);
    throw error;
  }
};

export const queryFollowStatsByRid = async (rid: number) => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        query MyQuery($rid: Int!) {
          followStatsByRid(rid: $rid) {
            followingCount
            followerCount
          }
        }
      `,
      variables: { rid },
    });

    return data.data.followStatsByRid as FollowStats;
  } catch (error) {
    console.error("获取用户关注统计失败:", error);
    throw error;
  }
};
