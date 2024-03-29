const Router = require('@koa/router');
const installCharacterRouter = require('./_characters');
const installHealthRouter = require('./_health');
const installBookRouter = require('./_books');
const installUserRouter = require('./_user');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installCharacterRouter(router);
	installBookRouter(router);
	installUserRouter(router);
	installHealthRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};
