import api from "./api";
import type { LoginIn, RegisterIn, TokenOut, UserOut } from "../models/auth";

export async function register(data: RegisterIn): Promise<UserOut> {
  const res = await api.post<UserOut>("/auth/register", data);
  return res.data;
}

export async function login(data: LoginIn): Promise<string> {
  const res = await api.post<TokenOut>("/auth/login", data);
  const token = res.data.access_token;
  localStorage.setItem("token", token);
  return token;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}
