export const BLStatuses = {
    INAPPROPRIATE_ACCESS_TOKEN:'Inappropriate access token is revoked',
    AUTH_EXPIRED:'Authorization expired',
    AUTH_FORMAT_ERROR_ACCESS_TOKEN:'Authorization format error,may access token expired',
    ACCESS_TOKEN_NOT_PROVIDED:'Access token not provided',
    INAPPROPRIATE_REFRESH_TOKEN:'Inappropriate refresh token is revoked',
    AUTH_FORMAT_ERROR_REFRESH_TOKEN:'Authorization format error,may refresh token expired',
    REFRESH_TOKEN_NOT_PROVIDED:'Refresh token not provided',
    NO_CUR_PRICE:'No cur price',
    CAN_NOT_UPDATE_REFRESH_TOKEN:'Can not update refresh_token',
    INCORRECT_EMAIL_OR_PASSWORD:'Incorrect email or password',
    USER_EXISTS:'User info already exists',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
    // XXX:'Xxx',
}

export const blInfo = (businessLogicMsg) => {
    return {
        success: false,
        data: null,
        message: businessLogicMsg
    }
}

export const blSuccess = (data) => {
    return {
        success: true,
        data: data,
        message: ''
    }
}
