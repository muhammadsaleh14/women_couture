import axios, { type InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "wc_access_token";

function apiBase(): string {
  const raw = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "") + "/api/v1";
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Shared Axios client: JSON API base URL + Bearer token from localStorage on each request.
 */
export const api = axios.create({
  baseURL: apiBase(),
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
