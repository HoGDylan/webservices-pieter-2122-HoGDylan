const {tables} = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.user).delete();

        await knex(tables.user).insert([
            { 
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80', 
                name: 'Brandon Sanderson',
                email: 'brandonsanderson@example.com',
                password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
                roles: JSON.stringify(['admin', 'user']),
            },
            { 
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81', 
                name: 'Dylan Rathé',
                email: 'dylanrathe@hotmail.com',
                password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
                roles: JSON.stringify(['user']),
            },
            { 
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82', 
                name: 'Pieter Van Der Helst',
                email: 'pieter@vanderhelst.com',
                password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
                roles: JSON.stringify(['user']),
            },
        ]);
    }
};