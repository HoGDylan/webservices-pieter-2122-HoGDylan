const {tables} = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.book).delete();

        await knex(tables.book).insert([
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83', name: 'The Final Empire', serie: 'Mistborn', serieNr: 1 },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84', name: 'The Way of Kings', serie: 'Stormlight Archives', serieNr: 1 },
            { id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85', name: 'Warbreaker', serie: null, serieNr: null },
        ]);
    }
};