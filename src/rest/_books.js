const Joi = require('joi');
const Router = require('@koa/router');
const { requireAuthentication } = require('../core/auth');
const bookService = require('../service/book');
const validate = require('./_validation');

const getAllBooks = async (ctx) => {
	const { limit, offset } = ctx.query;
	ctx.body = await bookService.getAll(Number(limit), Number(offset));
};
getAllBooks.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createBook = async (ctx) => {
	const newBook = await bookService.create(ctx.request.body);
	ctx.body = newBook;
	ctx.status = 201
};
createBook.validationScheme = {
  body: Joi.object({
    name: Joi.string().max(255),
		serie: Joi.string().max(255).optional(),
    serieNr: Joi.number().min(1).integer().optional(),
  }).and('serie', 'serieNr'),
};

const getBookById = async (ctx) => {
	ctx.body = await bookService.getById(ctx.params.id);
};
getBookById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateBook = async (ctx) => {
	ctx.body = await bookService.updateById(ctx.params.id, ctx.request.body);
};
updateBook.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: Joi.object({
    name: Joi.string().max(255),
		serie: Joi.string().max(255).optional(),
    serieNr: Joi.number().min(1).integer().optional(),
  }).and('serie', 'serieNr'),
};

const deleteBook = async (ctx) => {
	await bookService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteBook.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/books',
	});

	router.get('/', requireAuthentication, validate(getAllBooks.validationScheme), getAllBooks);
	router.post('/', requireAuthentication, validate(createBook.validationScheme), createBook);
	router.get('/:id', requireAuthentication, validate(getBookById.validationScheme), getBookById);
	router.put('/:id', requireAuthentication, validate(updateBook.validationScheme), updateBook);
	router.delete('/:id', requireAuthentication, validate(deleteBook.validationScheme), deleteBook);

	app.use(router.routes()).use(router.allowedMethods());
};
