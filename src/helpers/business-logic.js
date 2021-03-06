export const BLStatuses = {
    INAPPROPRIATE_ACCESS_TOKEN: {
        code: 'BL_BUNNY_001',
        message: 'Inappropriate access token is revoked'
    },
    ACCESS_TOKEN_EXPIRED: {
        code: 'BL_BUNNY_002',
        message: 'Access token expired'
    },
    ACCESS_TOKEN_MALFORMED: {
        code: 'BL_BUNNY_003',
        message: 'Access token malformed',
    },
    ACCESS_TOKEN_NOT_BEFORE: {
        code: 'BL_BUNNY_004',
        message: 'Access token not before'
    },
    ACCESS_TOKEN_VERIFY_UNKNOWN: {
        code: 'BL_BUNNY_005',
        message: 'Access token verify unknown error'
    },
    INAPPROPRIATE_REFRESH_TOKEN: {
        code: 'BL_BUNNY_006',
        message: 'Inappropriate refresh token is revoked'
    },
    REFRESH_TOKEN_EXPIRED: {
        code: 'BL_BUNNY_007',
        message: 'Refresh token expired'
    },
    REFRESH_TOKEN_MALFORMED: {
        code: 'BL_BUNNY_008',
        message: 'Refresh token malformed'
    },
    REFRESH_TOKEN_NOT_BEFORE: {
        code: 'BL_BUNNY_009',
        message: 'Refresh token not before'
    },
    REFRESH_TOKEN_VERIFY_UNKNOWN: {
        code: 'BL_BUNNY_010',
        message: 'Refresh token verify unknown error'
    },
    AUTH_FORMAT_ERROR_ACCESS_TOKEN: {
        code: 'BL_BUNNY_011',
        message: 'Authorization format error,may access token expired'
    },
    ACCESS_TOKEN_NOT_PROVIDED: {
        code: 'BL_BUNNY_012',
        message: 'Access token not provided'
    },
    UNKNOWN_AUTH_ERROR: {
        code: 'BL_BUNNY_013',
        message: 'Unknown auth error'
    },
    REFRESH_TOKEN_NOT_PROVIDED: {
        code: 'BL_BUNNY_014',
        message: 'Refresh token not provided'
    },
    NO_CUR_PRICE: {
        code: 'BL_BUNNY_015',
        message: 'No cur price'
    },
    CAN_NOT_UPDATE_REFRESH_TOKEN: {
        code: 'BL_BUNNY_016',
        message: 'Can not update refresh_token'
    },
    INCORRECT_EMAIL_OR_PASSWORD: {
        code: 'BL_BUNNY_017',
        message: 'Incorrect email or password'
    },
    USER_EXISTS: {
        code: 'BL_BUNNY_018',
        message: 'User info already exists'
    },
    NULL_USER: {
        code: 'BL_BUNNY_019',
        message: 'User is null'
    },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
    // XXX: {
    //     code: 'BL_BUNNY_0xx',
    //     message: 'Xxx'
    // },
}

export const blInfo = (businessLogicMsg, businessLogicCode) => {
    return {
        success: false,
        data: null,
        message: businessLogicMsg,
        code: businessLogicCode || '',
    }
}

export const blSuccess = (data) => {
    return {
        success: true,
        data: data,
        message: '',
        code: '',
    }
}

