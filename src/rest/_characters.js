const Router = require('@koa/router');
const characterService = require('../service/character');
const { requireAuthentication } = require('../core/auth');

const getAllCharacters = async (ctx) => {
	const limit = ctx.query.limit && Number(ctx.query.limit);
	const offset = ctx.query.offset && Number(ctx.query.offset);
	ctx.body = await characterService.getAll(limit, offset);
};

const createCharacter = async (ctx) => {
	const newCharacter = await characterService.create(ctx.request.body);
	ctx.body = newCharacter;
	ctx.status = 201;
};

const getCharacterById = async (ctx) => {
	ctx.body = await characterService.getById(ctx.params.id);
};

const updateCharacter = async (ctx) => {
	ctx.body = await characterService.updateById(ctx.params.id, ctx.request.body);
};

const deleteCharacter = async (ctx) => {
	await characterService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/characters',
	});

	router.get('/', requireAuthentication, getAllCharacters);
	router.post('/', requireAuthentication, createCharacter);
	router.get('/:id', requireAuthentication, getCharacterById);
	router.put('/:id', requireAuthentication, updateCharacter);
	router.delete('/:id', requireAuthentication, deleteCharacter);

	app.use(router.routes()).use(router.allowedMethods());
};
