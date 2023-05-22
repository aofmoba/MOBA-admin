import type { getPointFightRes } from '@/api/competition';

export interface columnNumType {
    teamNum: number;
    columnTeamNum: number;
}


const arrSort = (arr: getPointFightRes[]) => {
    const columnNum: Array<columnNumType> = []
    arr.forEach((item: any) => {
        const temp = columnNum.findIndex((da: any) => da.teamNum === item.teamNum)
        if( temp >= 0 ){
            columnNum[temp].columnTeamNum += 1
        }else{
            columnNum.push({
                teamNum: item.teamNum, // 当前列的teamNum（同列相同）
                columnTeamNum: 1  // 当前列共有多少队伍
            })
        }
    })
    return columnNum.sort((a: columnNumType,b: columnNumType)=> b.teamNum - a.teamNum)
}

const getWinBinaryArr = (data: any): getPointFightRes[][] => {
    const winArr: getPointFightRes[] | any[] = []
    const winArrRes: getPointFightRes[][] | any[][] = []
    data.forEach((item: any)=>{ // 通过group区分战胜组 战败组
        if( item.group === 0 || item.group === 3 ){
          winArr.push(item)  // group相同，teamNum决定轮数
        }
    })
    // const winTeamCol = arrSort(winArr) // 通过teamNum来确定多少列（轮），每列多少个队伍
    // const loseTeamCol = arrSort(loseArr)

    // 初始化战胜组 战败组的数据
    // winArrRes = Array(winTeamCol.length).fill(null)
    // winArrRes.map((item: any,i)=> ([
    //     Array(winTeamCol[i].columnTeamNum).fill([]).map((_, index) => ({
    //         teamNum: winTeamCol[i].teamNum
    //     }))
    // ]))
    // loseArrRes = Array(loseTeamCol.length).fill([])
    // loseArrRes.map((item: any,i)=> ([
    //     Array(loseTeamCol[i].columnTeamNum).fill([]).map((_, index) => ({
    //         teamNum: loseTeamCol[i].teamNum
    //     }))
    // ]))

    // 根据teamNum将数组分为二维数组
    winArr.forEach((item: getPointFightRes) => {
        const tempIndex = winArrRes.findIndex((da: Array<getPointFightRes>) => da[0].teamNum === item.teamNum )
        if( tempIndex >= 0 ){
            winArrRes[tempIndex].push(item)
        }else{
            winArrRes.push([item])
        }
    })
    return winArrRes.sort((a: Array<getPointFightRes>,b: Array<getPointFightRes>) => b[0].teamNum - a[0].teamNum)
}
const getLoseBinaryArr = (data: any): getPointFightRes[][] => {
    const loseArr: getPointFightRes[] | any[] = []
    const loseArrRes: getPointFightRes[][] | any[][] = []
    data.forEach((item: any)=>{ // 通过group区分战胜组 战败组
        if( item.group !== 0 && item.group !== 3 ){
          loseArr.push(item)  // group不同，teamNum决定轮数
        }
    })
    loseArr.forEach((item: getPointFightRes) => {
        const tempIndex = loseArrRes.findIndex((da: Array<getPointFightRes>) => da[0].teamNum === item.teamNum )
        if( tempIndex >= 0 ){
            loseArrRes[tempIndex].push(item)
        }else{
            loseArrRes.push([item])
        }
    })
    return loseArrRes.sort((a: Array<getPointFightRes>,b: Array<getPointFightRes>) => b[0].teamNum - a[0].teamNum)
}

export { getWinBinaryArr, getLoseBinaryArr }