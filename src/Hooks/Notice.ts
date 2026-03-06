import regql from "../Requests/regql";

export const postNotice = async () => {
  const res = await regql.post("", {
    query: `
        mutation MyMutation($nt: NoticeInput!) {
            addNotice(nt: $nt) {
                msg
                status
            }
        }
    `,
    variables: {
      nt: {
        title: "日常维护",
        content: "本网站将于2026年2月27日例行维护事宜",
      },
    },
  });

  return res.data.data;
};
