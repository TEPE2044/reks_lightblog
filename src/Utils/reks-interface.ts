export interface PhoneData {
  phone: string;
  code: string;
  iaccept: boolean;
}

export interface AccountData {
  account: string;
  password: string;
}

export interface QueueItem {
  // id
  cover: string;
  songURL: string;
  title: string;
  author: string;
}

export interface PageWrapper {
  currentPage: number;
  perPage: number;
  rows: number;
}

export interface ToastVariant {
  variant:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | "light"
    | "dark";
}

export interface ApiProduct {
  productCode: string;
  productName: string;
  category: string;
  discontinued?: boolean;
}

export interface PasswordGroup {
  psw: string;
  auth_psw: string;
}

export interface UserProfile {
  username: string;
  gender: number;
  signature: string;
}

export interface BlogData {
  id: number;
  cover: string[];
  title: string;
  created_at: Date;
  type: number;
  music?: BlogMusicMeta | null;
}

export interface HotBlogItem extends BlogData {
  like_count: number;
}

export interface BlogMusicMeta {
  id: number;
  name: string;
  cover: string;
  audio: string;
  username: string;
  avatar: string;
}

export interface MusicTwice {
  isOriginal: boolean;
  name: string;
  desc: string;
  type: number;
  coverURL: string | undefined;
  audioURL: string | undefined;
}

export interface MusicData {
  isOriginal: boolean;
  name: string;
  desc: string;
  type: number;
}

export interface MusicResponse {
  audio: string;
  cover: string;
  created_at: Date;
  desc: string;
  id: number;
  name: string;
  original: boolean;
  type: number;
  related: number;
  rid: number;
  state: number;
  username: string;
  avatar: string;
}

export interface FavoriteBlogItem extends BlogData {
  target_type: "blog";
  favorited_at: Date;
  author_rid: number;
  username: string;
  avatar: string;
}

export interface FavoriteMusicItem extends MusicResponse {
  target_type: "music";
  favorited_at: Date;
  author_rid: number;
}

export interface FavoriteListResponse<T> {
  msg: string;
  favorites: T[];
}

export interface Detail {
  title: string;
  author: string;
  cover: string;
  // desc
}

export interface EventSnapshot {
  eventType: string;
  payload: string;
}

export interface BlogRes {
  author:AuthorRes
  cover:string
  created_at:Date
  id:number
  title:string
  type:number
}

export interface AuthorRes {
  id:number
  username:string
  avatar:string
}

export interface SearchUserRes {
  reks_id: number
  username: string
  avatar: string
  signature?: string
}

