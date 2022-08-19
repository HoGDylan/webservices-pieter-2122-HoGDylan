const { tables } = require('../../src/data');
//const { login } = require('../../src/service/user');
const { withServer, login } = require('../supertest.setup');
const Roles = require('../../src/core/roles');

const data = {
    characters: [
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
            name: 'Character 1',
            notes: 'The first of the test characters.',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84"
        },
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
            name: 'Character 2',
            notes: 'A second test character.',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84"
        },
        {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
            name: 'Character 3',
            notes: 'The final test character.',
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
            book_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84"
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
};
const dataToDelete = {
    characters: [
        '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
        '7f28c5f9-d711-4cd6-ac15-d13d71abff83'
    ],
    books: ['7f28c5f9-d711-4cd6-ac15-d13d71abff84'],
};

describe('Characters', () => {
    let request;
    let knex;
    let loginHeader;

    withServer(({ supertest: s, knex: k }) => {
        request = s;
        knex = k;
    });
    beforeAll(async () => {
        loginHeader = await login(request);
    });

    const url = '/api/characters';

    describe('GET /api/characters', () => {
        beforeAll(async () => {
            await knex(tables.book).insert(data.books);
            await knex(tables.character).insert(data.characters);
        });
        afterAll(async() => {
            await knex(tables.character)
                .whereIn('id', dataToDelete.characters)
                .delete();
            await knex(tables.book)
                .whereIn('id', dataToDelete.books)
                .delete();
        });

        it('should 200 and return all characters', async() => {
            const response = await request.get(url).set('Authorization', loginHeader);
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(100);
            expect(response.body.offset).toBe(0);
            expect(response.body.data.length).toBe(3);
        });

        it('should 200 and paginate the lsit of transactions', async() => {
            const response = await request.get(`${url}?limit=2&offset=1`).set('Authorization', loginHeader);
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(2);
            expect(response.body.offset).toBe(1);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[0]).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
                name: 'Character 2',
                notes: 'A second test character.',
                user: {
                    id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
                    name: "Test User",
                },
                book: {
                    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                    name: 'Test Book',
                }
            });
            expect(response.body.data[1]).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
                name: 'Character 3',
                notes: 'The final test character.',
                user: {
                    id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
                    name: "Test User",
                },
                book: {
                    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                    name: 'Test Book',
                }
            });
        });
    });

    describe('GET /api/characters/:id', () => {
        beforeAll(async () => {
            await knex(tables.book).insert(data.books);
            await knex(tables.character).insert(data.characters[0]);
        });
        afterAll(async() => {
            await knex(tables.character)
                .where('id', dataToDelete.characters[0])
                .delete();
            await knex(tables.book)
                .whereIn('id', dataToDelete.books)
                .delete();
        });

        it('should 200 and return the requested character', async() => {
            const characterId = data.characters[0].id;
            const response = await request.get(`${url}/${characterId}`).set('Authorization', loginHeader);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
                name: 'Character 1',
                notes: 'The first of the test characters.',
                user: {
                    id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
                    name: "Test User",
                },
                book: {
                    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                    name: 'Test Book',
                }
            });
        });
    });

    describe('POST /api/characters', () => {
        const charactersToDelete = [];

        beforeAll(async () => {
            await knex(tables.book).insert(data.books);
        });
        afterAll(async() => {
            await knex(tables.character)
                .whereIn('id', charactersToDelete)
                .delete();
            await knex(tables.book)
                .whereIn('id', dataToDelete.books)
                .delete();
        });

        it('should 201 and return the created character', async() => {
            const response = await request.post(url)
                .set('Authorization', loginHeader)
                .send({
                    name: 'Created Character',
                    notes: 'This character was just created!',
                    bookId: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                });
            
            expect(response.status).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.name).toBe('Created Character');
            expect(response.body.book).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                name: 'Test Book',
            });
            expect(response.body.user).toEqual({
                id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
                name: "Test User",
            });
            //kan korter met regex

            charactersToDelete.push(response.body.id);
        });
    });

    describe('PUT /api/characters/:id', () => {    
        beforeAll(async () => {
          await knex(tables.book).insert(data.books);
          await knex(tables.character).insert(data.characters[0]);
        });
    
        afterAll(async () => {
          await knex(tables.character)
            .where('id', dataToDelete.characters[0])
            .delete();
    
          await knex(tables.book)
            .whereIn('id', dataToDelete.books)
            .delete();
        });
    
        test('it should 200 and return the updated character', async () => {
            const characterId = data.characters[0].id;
            const response = await request.put(`${url}/${characterId}`)
                .set('Authorization', loginHeader)
                .send({
                name: 'Character 1.5',
                notes: 'The updated version of the first character.',
                bookId: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                });
        
            expect(response.status).toBe(200);
            expect(response.body.id).toBeTruthy();
            expect(response.body.name).toBe('Character 1.5');
            expect(response.body.notes).toBe('The updated version of the first character.');
            expect(response.body.book).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
                name: 'Test Book',
            });
            expect(response.body.user).toEqual({
                id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
                name: 'Test User',
            });
        });
      });

      describe('DELETE /api/characters/:id', () => {
        beforeAll(async () => {
            await knex(tables.book).insert(data.books);
            await knex(tables.character).insert(data.characters[0]);
          });
      
          afterAll(async () => {      
            await knex(tables.book)
              .whereIn('id', dataToDelete.books)
              .delete();
          });
    
        it('should 204 and return nothing', async () => {
            const characterId = data.characters[0].id;
            const response = await request.delete(`${url}/${characterId}`).set('Authorization', loginHeader);
            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });
      });
});