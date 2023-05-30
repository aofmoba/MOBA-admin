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
    let winArrRes: getPointFightRes[][] | any[][] = []
    data.forEach((item: any)=>{ // 通过group区分战胜组 战败组
        if( item.group === 0 || item.group === 3 ){
          winArr.push(item)  // group相同，teamNum决定轮数
        }
    })
    // 1 先初始化二维数组 再根据第一列的下标获取后面列的队伍下标并替换初始值
    const winTeamCol = arrSort(winArr) // 通过teamNum来确定多少列（轮），每列多少个队伍
    // const loseTeamCol = arrSort(loseArr)
    // 初始化战胜组
    winArrRes = Array(winTeamCol.length).fill([])
    winArrRes = winArrRes.map((item: any,i)=> (
        Array(winTeamCol[i].columnTeamNum).fill(null).map((_, index) => ({
            teamNum: winTeamCol[i].teamNum
        }))
    ))
    // loseArrRes = Array(loseTeamCol.length).fill([])
    // loseArrRes.map((item: any,i)=> ([
    //     Array(loseTeamCol[i].columnTeamNum).fill([]).map((_, index) => ({
    //         teamNum: loseTeamCol[i].teamNum
    //     }))
    // ]))
    let group3 = {}
    winArr.forEach((item: getPointFightRes,i: number) => {
        // 找到当前item所在列的下标
        const tempIndex = winArrRes.findIndex((da: Array<getPointFightRes>) => da[0].teamNum === item.teamNum )
        if( tempIndex >= 0 ){
            if( item.teamNum !== winArrRes[0][0].teamNum ){
                // 找到当前队伍 在第一列中为胜者的数组下标
                const oneIndex = winArrRes[0].findIndex((one: any) => one.winTeamId === item.redTeamId || one.winTeamId === item.blueTeamId )
                if( item.group === 3 ) group3 = item // 第三、四名的item数据不进入计算 直接替换最后一列最后一个
                if( oneIndex >= 0 && item.group !== 3 ){
                    // 根据当前处的列数 将队伍在第一轮的下标进行2的开方 获得所在列下标
                    // eslint-disable-next-line no-restricted-properties
                    winArrRes[tempIndex].splice(Math.floor(oneIndex/Math.pow(2,tempIndex)),1,item)
                }
            }else{
                winArrRes[tempIndex].splice(i,1,item)
            }
        }
    })
    if( winArrRes[winArrRes.length-1].length === 2 && winArrRes[winArrRes.length-1][0].teamNum === 2 ) winArrRes[winArrRes.length-1][1] = group3 
    return winArrRes

    // 2 直接根据teamNum将数组分为二维数组（需保证接口返回数据顺序正确）
    // winArr.forEach((item: getPointFightRes) => {
    //     const tempIndex = winArrRes.findIndex((da: Array<getPointFightRes>) => da[0].teamNum === item.teamNum )
    //     if( tempIndex >= 0 ){
    //         winArrRes[tempIndex].push(item)
    //     }else{
    //         winArrRes.push([item])
    //     }
    // })
    // return winArrRes.sort((a: Array<getPointFightRes>,b: Array<getPointFightRes>) => b[0].teamNum - a[0].teamNum)
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