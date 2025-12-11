interface PhoneData {
  phone: string;
  code: string;
  iaccept: boolean;
}

interface AccountData{
  account:string;
  password:string;
}

export type { PhoneData,AccountData };