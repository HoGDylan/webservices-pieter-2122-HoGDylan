const {tables} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.book, (table) => {
            table.uuid('id')
                .primary();

            table.string('name', 255)
                .notNullable();

            table.unique('name', 'idx_place_name_unique');

            table.string('serie', 255);
            table.integer('serieNr');
        });
    },
    down: (knex) => {
        return knex.schema.dropIfExists(tables.book);
    }
};