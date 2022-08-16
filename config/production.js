module.exports = {
    log: {
        level: 'info',
        disabled: false,
    },
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    },
    database:{
        client: 'mysql2',
        name: 'charactercon',
    },
    pagination: {
        limit: 100,
        offset: 0,
    },
    auth: {
        argon: {
            saltLength: 16,
            hashLength: 32,
            timeCost: 6,
            memoryCost: 2 ** 17,
        },
        jwt: {
            secret: 'eensupermoeilijksecretdatniemandmagradenwantanderskunnenzedesitehacken',
            expirationInterval: 60 * 60 * 1000,
            issuer: 'charactercon.hogent.be',
            audience: 'charactercon.hogent.be',
        }
    }
};