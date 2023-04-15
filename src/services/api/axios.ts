import axios from 'axios';
import { parseCookies } from 'nookies';

export function getAPIClient(ctx?: any) {
  const { 'checkout.nextauth.token': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
  });

  api.interceptors.request.use((config) => {
    return config;
  });

  api.defaults.headers['Content-Type'] = `application/json`;

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}
