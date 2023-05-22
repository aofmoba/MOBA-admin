import axios from 'axios';
import { useUserStore } from '@/store';

const userStore = useUserStore();
export interface ArenaListData {
    // eslint-disable-next-line camelcase
    arena_type?: number; // 1-城市 0-地点 2-地标 钱包登录用户可不传
    pageno: number; // 从1开始
    pagesize: number; // 10, 20, 30，最多100
}
export interface iconType{
    id: number,
    count: number,
}
export interface singleReward{
    startRank: number;
    endRank: number;
    name: string;
    props: Array<iconType>;
}

export interface singleRewardRes{
    startRank: number;
    endRank: number;
    name: string;
    propList: Array<iconType>;
}
export interface ArenaLists {
    arenaId: number;
    arenaType: number;
    longitude: number;
    latitude: number;
    name: string;
    startTime: number;
    finTime: number;
    rules: string;
    arenaName: string;
    playerNum: number; // 审核列表不返回
    rewards: Array<singleRewardRes>;
    address?: string; // 钱包登录用户 - 创建者钱包地址
    // eslint-disable-next-line camelcase
    review_status?: string; // 钱包登录用户 - 0：待审核，1：审核通过，2：审核不通过
    // eslint-disable-next-line camelcase
    reject_reason?: string; // 钱包登录用户 - 审核不通过原因
}

export interface ArenaListsRes {
    list: Array<ArenaLists>;
    total: number;
}

export interface createArenaData {
    arenaType: number;
    startTime: number;
    finishTime: number;
    latitude: number;
    longitude: number;
    rule: string;
    arenaName: string;
    rewards: Array<singleReward>;
    cityName: string;
    arenaId?: number;
}

// 创建擂台
export function createArena(data: createArenaData) {
    if( userStore.permissions[0] !== 'guest' ){
        return axios.post('/api/arena/create',data);
    }
    return axios.post('/api/wallet/create_arena_point',data);
}
// 查看擂台列表
export function queryArenaList(data: ArenaListData) {
    if( userStore.permissions[0] !== 'guest' && data?.arena_type !== undefined ){
        return axios.post<ArenaListsRes>('/api/arena/list',data);
    }
    return axios.post<ArenaListsRes>('/api/wallet/arena_list',data);
}

// 查看指定擂台信息
export function queryArenaInfo(data: number) {
    return axios.post<ArenaLists>('/api/arena/info',{arena_id:data});
}
  
// 删除擂台
export function deleteArena(data: number) {
    return axios.post('/api/arena/delete',{arena_id: data});
}


export interface ranksData {
    // eslint-disable-next-line camelcase
    arena_id: number;
    // eslint-disable-next-line camelcase
    rank_type: number; // 0:积分 1:挑战次数 2:占领次数
}
export interface ranksLists {
    rank: number;
    score: number
    playerId: number;
    head?: string;
    assist?: number;
    dead?: number;
    kill?: number;
    name?: string;
    level?: string;
}

// 查看擂台排行榜信息
export function queryRanks(data: ranksData) {
    return axios.post<ranksLists[]>('/api/arena/ranks',data);
}

export interface simpleInfo {
    // eslint-disable-next-line camelcase
    player_id: number,
    // eslint-disable-next-line camelcase
    arena_id: number
}

// 查看擂台排行榜玩家游戏数据
export function queryPlayerInfo(data: simpleInfo) {
    return axios.post('/api/player/simple_info',data);
}
