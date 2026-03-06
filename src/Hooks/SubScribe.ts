import regql from "../Requests/regql";

// handle follow
export const handleFollow = async (fid: number) => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        mutation MyMutation($fid: ID!) {
          follow(fid: $fid) {
            msg
            status
          }
        }
      `,
      variables: { fid },
    });

    return data.data.follow;
  } catch (error) {
    console.error("关注失败:", error);
    throw error;
  }
};

export const handleUnFollow = async (fid: number) => {
  try {
    const { data } = await regql.post("/subql", {
      query: `
        mutation MyMutation($fid: ID!) {
          unfollow(fid: $fid) {
            msg
            status
          }
        }
      `,
      variables: { fid },
    });

    return data.data.follow;
  } catch (error) {
    console.error("关注失败:", error);
    throw error;
  }
};
