export default {
    dev: {
        protocol: 'BOTH', // HTTP,HTTPS,BOTH
        domain: 'localhost',
        http: {
            port: 8080,
        },
        https: {
            port: 8443,
        },
    },
    prod: {
        protocol: 'BOTH', // HTTP,HTTPS,BOTH
        domain: 'localhost',
        http: {
            port: 80,
        },
        https: {
            port: 443,
        },
    }
}
