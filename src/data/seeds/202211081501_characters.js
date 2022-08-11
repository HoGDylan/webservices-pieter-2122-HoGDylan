const {tables} = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.character).delete();

        await knex(tables.character).insert([
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86', name: 'Kelsier', notes: 'Blond dude with scars who dies and comes back as a Cognitive Shadow on Scadrial.', user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81', book_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83' },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87', name: 'Taravangian', notes: 'King who switches between being really smart but having no empathy and being stupid but kind. He takes up de Shard of Odium after killing Rayse.', user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81', book_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84' },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88', name: 'Vasher', notes: 'Returned from Nalthis who somehow ends up on Roshar.', user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82', book_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85' },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89', name: 'Vivenna', notes: 'Awakener from Nalthis who comes to Roshar in search of Nightblood and Vasher. Sister of Siri.', user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82', book_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85' },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff8a', name: 'Hoid', notes: 'Character who shows up in every book on every world. His motives are not clear.', user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80', book_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85' },
        ]);
    }
};