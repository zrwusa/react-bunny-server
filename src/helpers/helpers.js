export const judgePrice = (nowPrice, alertSetting) => {
    const {price} = alertSetting;
    let alertMsg = '', comparingResult = false;
    switch (alertSetting.comparator) {
        case 'eq':
            comparingResult = nowPrice === price;
            alertMsg = ` = ${price}`
            break
        case 'ge':
            comparingResult = nowPrice >= price
            alertMsg = ` >= ${price}`
            break
        case 'gt':
            comparingResult = nowPrice > price
            alertMsg = ` > ${price}`
            break
        case 'le':
            comparingResult = nowPrice <= price
            alertMsg = ` <= ${price}`
            break
        case 'lt':
            comparingResult = nowPrice < price
            alertMsg = ` < ${price}`
            break
        case 'ne':
            comparingResult = nowPrice !== price
            alertMsg = ` != ${price}`
            break
        default:
            comparingResult = false
            alertMsg = `default comparing`
            break
    }
    return {comparingResult, alertMsg}
}

