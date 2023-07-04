import axios from 'axios';
import { useUserStore } from '@/store';

const userStore = useUserStore();
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

export interface newcreateCompetitionData {
    name: string // 赛事名，4到100字节
    fightNum: number // 目前只能填5，表示5V5
    signTime: number, // 报名开始时间
    signFinTime: number, // 报名结束时间
    startTime: number // 开始时间戳
    finishTime: number // 用于显示的预计结束时间
    rankNum: number // 目前只能填1，表示选出冠亚军
    maxTroopNum: number // 最大报名队伍数，目前只能为8
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
    address?: string; // 钱包登录用户 - 创建者钱包地址
    // eslint-disable-next-line camelcase
    review_status?: string; // 钱包登录用户 - 0：待审核，1：审核通过，2：审核不通过
    // eslint-disable-next-line camelcase
    reject_reason?: string; // 钱包登录用户 - 审核不通过原因
}

export interface newfightinfo {
    totalTroopNum: number // 当前总共参赛队伍数
    redTroop: number // 红方队伍
    blueTroop: number // 蓝方队伍
    redScore: number // 红方得分
    blueScore: number // 蓝方得分
    winTroop: number // 获胜方队伍
    finishTime: number // 结束时间
    group: number // 0，暂时不用
}
export interface newcompetitionInfo {
    warId: number // 赛事id
    name: string // 赛事名
    maxTroopNum: number // 最大参赛队伍数
    startTime: number // 开始时间
    finishTime: number // 结束时间
    status: number // 0未开始，1报名，2战斗中，3结束
    fightNum: number // 5v5
    rankNum: number // 1
    troopList: Array<number> // 参赛的队伍id列表
    rankList: Array<number> // 队伍排名
    fightInfo: Array<newfightinfo> // 对局信息，见下定义
}

export interface comListRes {
    total: number;
    list: Array<competitionInfo>;
}
export interface newcomListRes {
    total: number;
    list: Array<newcompetitionInfo>;
}

// 创建赛事 -old
export function createCompetitionOld(data: createCompetitionData) {
    if( userStore.permissions[0] !== 'guest' ){
        return axios.post('/api/competition/create',data);
    }
    return axios.post('/api/wallet/create_competition',data);
}
// 创建赛事 -new
export function createCompetition(data: newcreateCompetitionData) {
    return axios.post('/api/war/create',data);
}

// 查看赛事列表 -old
export function queryCompetitionListOld(data: comListData) {
    // if( userStore.permissions[0] !== 'guest' ){
        return axios.post<comListRes>('/api/competition/list',data);
    // }
    // return axios.post<comListRes>('/api/wallet/competition_list',data);
}
// 查看赛事列表 -new
export function queryCompetitionList(data: comListData) {
    return axios.post<newcomListRes>('/api/war/list',data);
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
    rankNum: number; // 8,16,32,64
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
    status: number; // 0：为结束 1：已结束
    address?: string; // 钱包登录用户 - 创建者钱包地址
    // eslint-disable-next-line camelcase
    review_status?: string; // 钱包登录用户 - 0：待审核，1：审核通过，2：审核不通过
    // eslint-disable-next-line camelcase
    reject_reason?: string; // 钱包登录用户 - 审核不通过原因
}

export interface comPointListData extends comListData{
    compId?: string;
    isReview?: boolean; // 是否是审核列表
}

export interface competitionPointInfo extends createCompetitionPointData {
    id: number;
    joinNum: number; // 报名人数
    signNum: number; // 参赛人数
    detailInfo: detailData; // 钱包登录返回null
}

export interface comPointListRes {
    total: number;
    list: Array<competitionPointInfo>;
}

// 创建赛点
export function createCompetitionPoint(data: createCompetitionPointData) {
    if( userStore.permissions[0] !== 'guest' ){
        return axios.post('/api/competition_point/create',data);
    }
    return axios.post('/api/wallet/create_competition_point',data);
}
// 查看赛点列表
export function queryCompetitionPointList(data: comPointListData) {
    if( userStore.permissions[0] !== 'guest' && !data?.isReview ){
        return axios.post<comPointListRes>('/api/competition_point/list',data);
    }
    return axios.post<comPointListRes>('/api/wallet/point_list',{compId: data.compId, pageno: data.pageno,pagesize: data.pagesize});
}

export interface comPointCheckinListRes {
    checkins: Array<string>;
    noncheckins: Array<string>;
}

// 获取赛点签到列表
export function queryComPointCheckinList(id: string) {
    return axios.post<comPointCheckinListRes>('/api/competition_point/checkin_list',{point_id: id});
}

export interface resetPointDrawSlotsData {
    // eslint-disable-next-line camelcase
    point_id: string;
    // eslint-disable-next-line camelcase
    max_rank: number; // 1-8
}

// 重新抽签
export function resetPointDrawSlots(data: resetPointDrawSlotsData) {
    return axios.post('/api/competition_point/draw_slots',data);
}


export interface getPointFightRes {
    roundNum: number;       // 第几轮选择赛，1表示第一轮海选
    blueTeamId: string;     // 蓝方赛事队伍Id
    blueTeamName: string;   // 蓝方队伍名
    blueScore: number;      // 蓝方得分数，如果有的话
    redTeamId: string;      // 红方赛事队伍id
    redTeamName: string;    // 红方队伍名
    redScore: number;       // 红方得分数，如果有的话
    startTime: number;      // 战斗开始时间戳
    finishTime: number;     // 战斗结束时间戳
    teamNum: number;        // 赛点剩余队伍数
    winTeamId: string;      // 胜方队伍Id
    group: number;          // 所在组，默认为0，输的次数越多，值越大
}

// 获取抽签对战信息
export function getPointFightData(id: string) {
    return axios.post<Array<getPointFightRes>>('/api/competition_point/get_fight_data',{point_id: id});
}

// 队伍单个成就
export interface achivementsObject {
    name: string;
    timestamp: number;
    icon: string;
}

// 队伍战绩 统计定义
export interface teamResult {
    fightCount: number; // 参战次数
    championCount: number; // 夺冠次数
    continusWinCount: number; // 连赢次数
    killCount: number; // 击杀
}

export interface queryPointTeamInfoRes {
    teamId: string;
    leader: number;
    createTime: number;
    isClub: number;
    name: string;
    logo: string;
    signature: string; // 队伍签名
    leaderIcon: string; 
    fightCount: number; // 出战次数
    winCount: number; // 战胜次数
    achivements: Array<achivementsObject>; // 成就
    members: Array<object>; // 队伍成员
    applyList: Array<object>; // 申请者列表
    stats: object;
}

// 查看赛事队伍详情 -old
export function queryPointTeamInfoOld(id: string) {
    return axios.post<queryPointTeamInfoRes>('/api/competition_team/info',{team_id: id});
}

export interface newqueryPointTeamInfoRes{
    troopId: number // 队伍id
    name: string // 队伍名
    leader: number // 队长id
    createTime: number // 创建时间
    members: Array<object> // 成员列表，如 [{"playerId":123,"joinTime":123}]
}

// 查看赛事队伍详情 -new
export function queryPointTeamInfo(id: number) {
    return axios.post<newqueryPointTeamInfoRes>('/api/war/troop/info',{troopId: id});
}


/**
 * mainPos--队伍成员主玩位置
 * AGAINST: 0 对抗路
 * MIDDLE： 1 中路
 * GROW：   2 发育
 * MONSTER：3 打野
 * WALKER： 4 游走
 */ 

// 查看赛事队伍详情
export function queryPlayerInfo(id: string) {
    return axios.post('/api/player/comp_info ',{player_id: id});
}

// 替队伍签到
export function queryPointTeamCheckin(teamId: string,pointId: string) {
    return axios.post('/api/competition_team/checkin',{team_id: teamId,point_id: pointId});
}

// 完成签到下一步
export function finishCheckStep(id: string) {
    return axios.post('/api/competition_point/finish_checkin',{point_id: id});
}

// 查看赛点队伍排名
export function queryCompTeamRank(id: string) {
    return axios.post('/api/competition_poing/get_fight_rank',{point_id: id});
}