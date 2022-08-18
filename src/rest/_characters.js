const Joi = require('joi');
const Router = require('@koa/router');
const characterService = require('../service/character');
const { requireAuthentication } = require('../core/auth');
const validate = require('./_validation');

const getAllCharacters = async (ctx) => {
	const limit = ctx.query.limit && Number(ctx.query.limit);
	const offset = ctx.query.offset && Number(ctx.query.offset);
	ctx.body = await characterService.getAll(limit, offset);
};
getAllCharacters.validationScheme = {
	query: Joi.object({
		limit: Joi.number().positive().integer().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional()
	}).and('limit', 'offset'),
};

const createCharacter = async (ctx) => {
	const newCharacter = await characterService.create({
		...ctx.request.body,
		userId: ctx.state.session.userId,
	});
	ctx.body = newCharacter;
	ctx.status = 201;
};
createCharacter.validationScheme = {
	body: {
		name: Joi.string().max(255),
		notes: Joi.string(),
		bookId: Joi.string().uuid(),
	},
}

const getCharacterById = async (ctx) => {
	ctx.body = await characterService.getById(ctx.params.id);
};
getCharacterById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateCharacter = async (ctx) => {
	ctx.body = await characterService.updateById(ctx.params.id, ctx.request.body);
};
updateCharacter.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
		name: Joi.string().max(255),
		notes: Joi.string(),
		bookId: Joi.string().uuid(),
	},
};

const deleteCharacter = async (ctx) => {
	await characterService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteCharacter.validationScheme = {
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
		prefix: '/characters',
	});

	router.get('/', requireAuthentication, validate(getAllCharacters.validationScheme), getAllCharacters);
	router.post('/', requireAuthentication, validate(createCharacter.validationScheme), createCharacter);
	router.get('/:id', requireAuthentication, validate(getCharacterById.validationScheme), getCharacterById);
	router.put('/:id', requireAuthentication, validate(updateCharacter.validationScheme), updateCharacter);
	router.delete('/:id', requireAuthentication, validate(deleteCharacter.validationScheme), deleteCharacter);

	app.use(router.routes()).use(router.allowedMethods());
};
