import axios from 'axios';

export interface ArenaListData {
    // eslint-disable-next-line camelcase
    arena_type: number; // 1-城市 0-地点 2-地标
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
    playerNum: number;
    rewards: Array<singleRewardRes>;
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

export function createArena(data: createArenaData) {
    return axios.post('/api/arena/create',data);
}

export function queryArenaList(data: ArenaListData) {
    return axios.post<ArenaListsRes>('/api/arena/list',data);
}

export function queryArenaInfo(data: number) {
    return axios.post<ArenaLists>('/api/arena/info',{arena_id:data});
}
  
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

export function queryRanks(data: ranksData) {
    return axios.post<ranksLists[]>('/api/arena/ranks',data);
}

export interface simpleInfo {
    // eslint-disable-next-line camelcase
    player_id: number,
    // eslint-disable-next-line camelcase
    arena_id: number
}

export function queryPlayerInfo(data: simpleInfo) {
    return axios.post('/api/player/simple_info',data);
}
