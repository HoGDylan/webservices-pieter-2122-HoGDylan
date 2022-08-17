const Router = require('@koa/router');
const { requireAuthentication } = require('../core/auth');
const bookService = require('../service/book');

const getAllBooks = async (ctx) => {
	const { limit, offset } = ctx.query;
	ctx.body = await bookService.getAll(Number(limit), Number(offset));
};

const createBook = async (ctx) => {
	const newBook = await bookService.create(ctx.request.body);
	ctx.body = newBook;
	ctx.status = 201
};

const getBookById = async (ctx) => {
	ctx.body = await bookService.getById(ctx.params.id);
};

const updateBook = async (ctx) => {
	ctx.body = await bookService.updateById(ctx.params.id, ctx.request.body);
};

const deleteBook = async (ctx) => {
	await bookService.deleteById(ctx.params.id);
	ctx.status = 204;
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

	router.get('/', requireAuthentication, getAllBooks);
	router.post('/', requireAuthentication, createBook);
	router.get('/:id', requireAuthentication, getBookById);
	router.put('/:id', requireAuthentication, updateBook);
	router.delete('/:id', requireAuthentication, deleteBook);

	app.use(router.routes()).use(router.allowedMethods());
};
