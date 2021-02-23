//     data: T | object,
//     created_at?: string,
//     error?: string,
//     business_logic_code?: string,
//     business_logic_error?: string
const bunnyAPI = () => (req, res, next) => {
    const bunnyRes = {
        data: {},
        created_at: process.hrtime(),
        error: '',
        business_logic_code: '',
        business_logic_error: ''
    }
    console.log('---bunnyAPI')
    res.status(500).json(bunnyRes);
}

module.exports = {
    bunnyAPI
}
