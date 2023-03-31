import axios from 'axios';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  accessToken: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', JSON.stringify(data));
}

export function refreshToken() {
  return axios.post<LoginRes>('/api/user/refresh_token');
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}
