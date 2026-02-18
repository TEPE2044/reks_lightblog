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
  cover: string;
  songURL: string;
  title:string;
  author:string
}

export interface PageWrapper{
  currentPage:number,
  perPage:number,
  pageLimit:5,
  rows:number
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

export interface PasswordGroup{
  psw:string,
  auth_psw:string
}

export interface UserProfile {
  username: string;
  gender: number;
  signature: string;
}

export interface BlogData{
  id: number;
  cover: string[];
  title: string;
  created_at: Date;
  type: number;
}


export interface MusicData{
  isOriginal:boolean
  name:string
  desc:string
  coverURL:string|undefined  
  audioURL:string|undefined  
}

export interface MusicResponse{
  audio:string
  cover:string
  created_at:Date
  desc:string,
  id:number,
  name:string,
  original:boolean,
  rid:number,
  state:number
  username:string
  avatar:string
}

