import axios from 'axios';

export interface comData {
  accept: number; // 1：同意 2：拒绝
  reason?: string; // 如果是拒绝 此必填 拒绝理由
}

export interface approveArenaData extends comData {
  id: number; // 擂台id
}

// 擂台审核 (非钱包登录的账号)
export function approveArena(data: approveArenaData) {
  return axios.post('/api/wallet/approve_arena', data);
}

export interface approveCompData extends comData {
  id: string; // 赛事id | 赛点id
}

// 赛事审核 (非钱包登录的账号)
export function approveComp(data: approveCompData) {
  return axios.post('/api/wallet/approve_comp', data);
}

// 赛点审核 (非钱包登录的账号)
export function approvePoint(data: approveCompData) {
  return axios.post('/api/wallet/approve_point', data);
}



