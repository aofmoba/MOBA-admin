import axios from 'axios';

export interface iconType{
    itemId: number,
    itemCount: number,
}
export interface singleComRewardRes{
    startRank: number;
    finishRank: number;
    name: string;
    itemList: Array<iconType>;
}

export interface createCompetitionData {
    type: number; // 0: 主题赛 1: 俱乐部
    name: string;
    banner: string;
    rule: string;
    rulePic: string;
    rewards: Array<singleComRewardRes>;
}

export interface comListData {
    pageno: number; // 从1开始
    pagesize: number; // 10, 20, 30，最多100
}

export interface detailInfoObject {
    banner: string;
    rewards: Array<singleComRewardRes>;
    rule: string;
    rulePicUrl: string;
}
export interface competitionInfo {
    id: string; 
    type: number;
    name: number;
    startTime: number;
    finishTime: number;
    pointNum: number; // 赛点数量
    signNum: number; // 报名队伍数
    detailInfo: Array<detailInfoObject>;
}

export interface comListRes {
    total: number;
    list: Array<competitionInfo>;
}

export function createCompetition(data: createCompetitionData) {
    return axios.post('/api/competition/create',data);
}

export function queryCompetitionList(data: comListData) {
    return axios.post<comListRes>('/api/competition/list',data);
}

export interface stepsData {
    name: string,
    startTime: number
}
export interface detailData {
    banner: string,
    logo: string,
    steps: Array<stepsData>
}

export interface createCompetitionPointData {
    compId: string; 
    name: string; 
    fightNum: number;  // 对战人数1,3,5：1v1,3v3, 5v5
    fightMode: number; // 0:淘汰赛 1:积分赛
    fightRound: number; // 1,3,5: BO1, BO3, BO5
    signTime: number; 
    signFinTime: number; 
    checkInTime: number;
    checkInFinTime: number;
    fightTime: number;
    fightFinTime: number;
    teamNumLimit: number; // 报名队伍数 默认不限制传0
    teamMemberLimit: number; // 队伍人数 
    detail: detailData;
}

export interface comPointListData extends comListData{
    compId: string;
}

export interface competitionPointInfo extends createCompetitionPointData {
    id: number;
    joinNum: number; // 报名人数
    signNum: number; // 参赛人数
    detailInfo: detailData;
}

export interface comPointListRes {
    total: number;
    list: Array<competitionPointInfo>;
}


export function createCompetitionPoint(data: createCompetitionPointData) {
    return axios.post('/api/competition_point/create',data);
}

export function queryCompetitionPointList(data: comPointListData) {
    return axios.post<comPointListRes>('/api/competition_point/list',data);
}
