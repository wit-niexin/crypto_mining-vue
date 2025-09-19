import index from '../index'

export function addWithdrawal(params) {
    const url = '/withdrawal/addWithdrawal'
    return index.post(url, params)
}

export function delWithdrawal(params) {
    const url = '/withdrawal/delWithdrawal'
    return index.post(url, params)
}

export function updateWithdrawal(params) {
    const url = '/withdrawal/updateWithdrawal'
    return index.post(url, params)
}

export function getWithdrawalAllPage(params) {
    const url = '/withdrawal/getAllPage'
    return index.get(url, params)
}