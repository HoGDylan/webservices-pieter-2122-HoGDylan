const {tables} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.character, (table) => {
            table.uuid('id')
                .primary();

            table.string('name', 255)
                .notNullable();

            table.string('notes', 2048);

            table.uuid('user_id')
                .notNullable();
            
            table.foreign('user_id', 'fk_character_user')
                .references(`${tables.user}.id`)
                .onDelete('CASCADE');

            table.uuid('book_id')
                .notNullable();

            table.foreign('book_id', 'fk_character_book')
                .references(`${tables.book}.id`)
                .onDelete('CASCADE');

        });
    },
    down: (knex) => {
        return knex.schema.dropIfExists(tables.character);
    }
};