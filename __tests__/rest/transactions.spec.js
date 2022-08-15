const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { getKnex } = require('../../src/data');

const data = {
    characters: [
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
            name: 'Character 1',
            notes: 'The first of the test characters.',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff81",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83"
        },
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
            name: 'Character 2',
            notes: 'A second test character',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff81",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83"
        },
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
            name: 'Character 3',
            notes: 'The final test character',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff81",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83"
        },
    ],
    books: [
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
            name: 'Test Book',
            serie: 'Test Serie',
            serieNr: 1,
        },
    ],
    users: [
        {
            id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
            name: "Test User",
        }
    ]
};
const dataToDelete = {
    characters: [
        '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
        '7f28c5f9-d711-4cd6-ac15-d13d71abff83'
    ],
    books: ['7f28c5f9-d711-4cd6-ac15-d13d71abff84'],
    users: ['7f28c5f9-d711-4cd6-ac15-d13d71abff80'],
};

describe('Transaction', () => {
    let server;
    let request;
    let knex;

    beforeAll(async() => {
        server = await createServer();
        knex = getKnex();
        request = supertest(server.getApp().callback());
    });
    afterAll(async() => {
        await server.stop();
    });

    const url = '/api/characters';

    describe('GET /api/characters', () => {
        beforeAll(async () => {
            await knex(tables.character).insert(data.characters);
            await knex(tables.book).insert(data.books);
            await knex(tables.user).insert(data.users);
        });

        it('should 200 and return all characters', async() => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(100);
            expect(response.body.offset).toBe(0);
        });
    });
});