const { tables } = require('../../src/data');
//const { login } = require('../../src/service/user');
const { withServer, login } = require('../supertest.setup');

const data = {
  books: [{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
      name: 'The First Test Book',
      serie: 'Test Serie',
      serieNr: 1,
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      name: 'Test Book of the Second',
      serie: 'Test Serie',
      serieNr: 2,
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      name: 'Book of Testing',
      //serie: null,
      //serieNr: null,
    }
  ]
};

const dataToDelete = {
  books: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
  ]
};

describe('Books', () => {
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

  const url = '/api/books';

  describe('GET /api/books', () => {

    beforeAll(async () => {
      await knex(tables.book).insert(data.books);
    });

    afterAll(async () => {
      await knex(tables.book)
        .whereIn('id', dataToDelete.books)
        .delete();
    });

    it('should 200 and return all books', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /api/books/:id', () => {

    beforeAll(async () => {
      await knex(tables.book).insert(data.books[0]);
    });

    afterAll(async () => {
      await knex(tables.book)
        .where('id', data.books[0].id)
        .delete();
    });

    it('should 200 and return the requested book', async () => {
      const response = await request.get(`${url}/${data.books[0].id}`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.books[0]);
    });
  });

  describe('POST /api/books', () => {

    const booksToDelete = [];

    afterAll(async () => {
      await knex(tables.book)
        .whereIn('id', booksToDelete)
        .delete();
    });

    it('should 201 and return the created stand-alone book', async () => {
      const response = await request.post(url)
        .set('Authorization', loginHeader)
        .send({
          name: 'Book of Creation',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Book of Creation');
      expect(response.body.serie).toBeNull();
      expect(response.body.serieNr).toBeNull();
    });

    it('should 201 and return the created book from a series', async () => {
      const response = await request.post(url)
        .set('Authorization', loginHeader)
        .send({
          name: 'The Second Test',
          serie: 'The Tests of Creation',
          serieNr: 2,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('The Second Test');
      expect(response.body.serie).toBe('The Tests of Creation');
      expect(response.body.serieNr).toBe(2);
    });
  });

  describe('PUT /api/books/:id', () => {

    beforeAll(async () => {
      await knex(tables.book).insert(data.books);
    });

    afterAll(async () => {
      await knex(tables.book)
        .whereIn('id', dataToDelete.books)
        .delete();
    });

    it('should 200 and return the updated book', async () => {
      const bookId = data.books[0].id;
      const response = await request.put(`${url}/${bookId}`)
        .set('Authorization', loginHeader)
        .send({
          name: 'The Updated Test',
          serie: 'The Tests of Change',
          serieNr: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
          id: bookId,
          name: 'The Updated Test',
          serie: 'The Tests of Change',
          serieNr: 3,
      });
    });
  });

  describe('DELETE /api/books/:id', () => {

    beforeAll(async () => {
      await knex(tables.book).insert(data.books[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/${data.books[0].id}`).set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});