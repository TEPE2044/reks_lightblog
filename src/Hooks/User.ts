import reapi from "../Requests/reapi";
import type { UserProfile } from "../Utils/reks-interface";

export interface GuestProfileResponse {
    reks_id: number;
    username: string;
    avatar: string | null;
    gender: number;
    type: number;
    sign: string | null;
}

export const query_profile_by_user_id = async (rid: number) => {
    const res = await reapi({
        url: `/user/profile/${rid}`,
        method: "GET",
    });
    return res.data?.data as GuestProfileResponse;
};

export const update_profile = async (data: UserProfile, avatarURL: string | null) => {
    const res = await reapi({
        url: '/user/profile',
        method: 'POST',
        data: {
            ...data,
            avatarURL: avatarURL || null, 
        }
    })
    return res;
}