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

export type { PhoneData, AccountData, QueueItem, ToastVariant };
