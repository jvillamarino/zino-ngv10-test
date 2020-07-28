export interface User{
  ID?: number;
  DNI: string;
  NAME: string;
  SURNAME: string;
  SECOND_SURNAME: string;
  EMAIL: string;
  FULL_NAME?: string;
}

export interface Credit{
  ID?: number;
  DNI: string;
  VALUE: number;
  STATUS?: number;
  PAYMENT_DATE?: string;
  IS_PAID?: boolean;
}
