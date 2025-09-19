import index from './index'

export function login(params) {
    const url = '/user/login';
    return index.get(url, params);
}
