import index from '../index'

export function getUserDashboard(params) {
    const url = '/dashboard/getUserDashboard'
    return index.get(url, params)
}

export function getUserDashboardChart(params) {
    const url = '/dashboard/getUserDashboardChart'
    return index.get(url, params)
}

export function getAdminAllData(params) {
    const url = '/dashboard/getAdminAllData'
    return index.get(url, params)
}