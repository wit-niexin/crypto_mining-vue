import index from '../index'

export function getUserWallet(params) {
    const url = '/wallet/getUserWallet'
    return index.get(url, params)
}
