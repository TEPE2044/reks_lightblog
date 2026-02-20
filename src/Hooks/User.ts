import reapi from "../Requests/reapi";
import type { UserProfile } from "../Utils/reks-interface";

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