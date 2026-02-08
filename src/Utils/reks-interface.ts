interface PhoneData {
  phone: string;
  code: string;
  iaccept: boolean;
}

interface AccountData {
  account: string;
  password: string;
}

interface QueueItem {
  cover: string;
  songURL: string;
}

interface PageWrapper{
  currentPage:number,
  perPage:number,
  pageLimit:5,
  rows:number
}

interface ToastVariant {
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

interface ApiProduct {
  productCode: string;
  productName: string;
  category: string;
  discontinued?: boolean;
}

interface PasswordGroup{
  psw:string,
  auth_psw:string
}

export type { PhoneData, AccountData, QueueItem, ToastVariant,PageWrapper,ApiProduct,PasswordGroup };
