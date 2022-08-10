const Router = require('@koa/router');
const characterService = require('../service/character');

const getAllCharacters = async (ctx) => {
	ctx.body = characterService.getAll();
};

const createCharacter = async (ctx) => {
	const newCharacter = characterService.create(ctx.request.body);
	ctx.body = newCharacter;
};

const getCharacterById = async (ctx) => {
	ctx.body = characterService.getById(ctx.params.id);
};

const updateCharacter = async (ctx) => {
	ctx.body = characterService.updateById(ctx.params.id, ctx.request.body);
};

const deleteCharacter = async (ctx) => {
	characterService.deleteById(ctx.params.id);
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

	router.get('/', getAllCharacters);
	router.post('/', createCharacter);
	router.get('/:id', getCharacterById);
	router.put('/:id', updateCharacter);
	router.delete('/:id', deleteCharacter);

	app.use(router.routes()).use(router.allowedMethods());
};
