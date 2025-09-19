import index from '../index'

export function getBenefitAllPage(params) {
    const url = '/user_benefit/getAllPage'
    return index.get(url, params)
}

export function getBenefitAllPageWithLegalName(params) {
    const url = '/user_benefit/getAllPageWithLegalName'
    return index.get(url, params)
}
