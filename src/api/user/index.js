import index from '../index'

export function getUserAllPage(params) {
    const url = '/user/getAllPage'
    return index.get(url, params)
}

export function updateUser(params) {
    const url = '/user/updateUser'
    return index.post(url, params)
}

export function modifyPassword(params) {
    const url = '/user/changePassword'
    return index.post(url, null, params)
}