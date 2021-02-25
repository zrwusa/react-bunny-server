const {httpStatus} = require("./restful-api");

const bunnyAPIConfig = {
    success_data: "`${data}`",
    http_extra: {
        code: "`${(status}`' : ''",
        message: "httpStatus[`${(status}`.toString()].phrase || '' : ''",
        des: "httpStatus[`${(status}`.toString()].description || '' : ''",
        error_code: '',
        error_message: '',
        error_des: '',
        error_stack: '',
    },
    business_logic: {
        code: "'B' + `${(status}`",
        message: "`${(message}` || ''",
        des: "`${(message}` || ''",
        error_code: '',
        error_message: '',
        error_des: '',
        error_stack: '',
    }
}

const bunnyAPI = {
    constructSuccessBody: (ctx, status, data, message, des) => {
        return {
            success_data: data,
            http_extra: {
                code: status || '',
                message: httpStatus[status.toString()].phrase || '',
                des: httpStatus[status.toString()].description || '',
                error_code: '',
                error_message: '',
                error_des: '',
                error_stack: '',
            },
            business_logic: {
                code: 'B' + status || '',
                message: message || '',
                des: des || '',
                error_code: '',
                error_message: '',
                error_des: '',
                error_stack: '',
            }
        };
    },
    constructErrorBody: (ctx, status, errorMessage, errorDes, stack) => {
        return {
            http_extra: {
                code: '',
                message: '',
                des: '',
                error_code: status || '',
                error_message: httpStatus[status.toString()].phrase || '',
                error_des: httpStatus[status.toString()].description || '',
                error_stack: '',
            },
            business_logic: {
                code: '',
                message: '',
                des: '',
                error_code: 'B' + status || '',
                error_message: errorMessage || '',
                error_des: errorDes || '',
                error_stack: '',
            }
        }
    }
}

module.exports = {
    bunnyAPI
}
