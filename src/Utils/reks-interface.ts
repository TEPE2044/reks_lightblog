interface PhoneData {
  phone: string;
  code: string;
  iaccept: boolean;
}

interface AccountData{
  account:string;
  password:string;
}

interface QueueItem {
  cover: string;
  songURL: string;
}

export type { PhoneData,AccountData,QueueItem };