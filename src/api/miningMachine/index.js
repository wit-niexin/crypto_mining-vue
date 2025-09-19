import index from '../index'

// 添加矿机
export function addMiningRig(params) {
    const url = '/mining_rig/addMiningRig'
    return index.post(url, params)
}

// 获得分页矿机列表
export function getMiningRigAllPage(params) {
    const url = '/mining_rig/getAllPage'
    return index.get(url, params)
}
