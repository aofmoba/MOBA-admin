import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { getToken } from '@/utils/auth';

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
  return axios.post('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info',{accessToken: getToken()});
}

export function getWalletRandom(data: string) {
  return axios.post<UserState>('/api/wallet/get_random',{address: data});
}

export interface walletLoginData {
  address: string;
  signature: string;
}

export function walletLogin(data: walletLoginData) {
  return axios.post<LoginRes>('/api/wallet/login' ,data);
}