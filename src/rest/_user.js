const Router = require('@koa/router');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Roles = require('../core/roles');
const userService = require('../service/user');

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const response = await userService.login(email, password);
  ctx.body = response;
};

const register = async (ctx) => {
  const response = await userService.register(ctx.request.body);
  ctx.body = response;
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login', login);
  router.post('/register', register);

  const requireAdmin = makeRequireRole(Roles.ADMIN);
  
  router.get('/', requireAuthentication, requireAdmin, getAllUsers);
  router.get('/:id', requireAuthentication, getUserById);
  router.put('/:id', requireAuthentication, updateUserById);
  router.delete('/:id', requireAuthentication, deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};