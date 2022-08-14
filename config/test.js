module.exports = {
    log: {
        level: 'silly',
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
};