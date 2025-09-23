export interface RegisterIn {
  email: string;
  name: string;
  password: string;
}

export interface LoginIn {
  email: string;
  password: string;
}

export interface UserOut {
  id: number;
  email: string;
  name: string;
}

export interface TokenOut {
  access_token: string;
  token_type: string;
}
