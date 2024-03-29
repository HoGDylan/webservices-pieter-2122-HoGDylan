const { getChildLogger } = require('../core/logging');
const { generateJWT, verifyJWT } = require('../core/jwt');
const { hashPassword, verifyPassword } = require('../core/password');
const ServiceError = require('../core/serviceError');
const Roles = require('../core/roles');
const userRepository = require('../repository/user');
const useTry = require("no-try").useTry;
const useTryAsync = require("no-try").useTryAsync;

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const makeExposedUser = ({ password_hash, ...user }) => user;

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user),
  };
};

const login = async(email, password) => {
  const user = await userRepository.findByEmail(email);
  if(!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);
  if(!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  return makeLoginData(user);
};

/**
 * Register a new user
 *
 * @param {object} user - The user's data.
 * @param {string} user.name - The user's name.
 */
const register = async ({
  name,
  email,
  password,
}) => {
  debugLog('Creating a new user', { name });
  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    roles: [Roles.USER],
  });
  return await makeLoginData(user);
};


/**
 * Get all `limit` users, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of users to fetch.
 * @param {number} [offset] - Nr of users to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all users', { limit, offset });
  const data = await userRepository.findAll({ limit, offset });
  const count = await userRepository.findCount();
  return {
    data,
    count: count,
    limit,
    offset,
  };
};

/**
 * Get the user with the given id.
 *
 * @param {string} id - Id of the user to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 */
const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  return makeExposedUser(user);
};


/**
 * Update an existing user.
 *
 * @param {string} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} [user.name] - Name of the user.
 * @param {number} [user.email] - Email of the user.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 * - VALIDATION_FAILED: A user with the same email exists.
 */
const updateById = (id, { name }) => {
  debugLog(`Updating user with id ${id}`, { name });
  return userRepository.updateById(id, { name });
};


/**
 * Delete an existing user.
 *
 * @param {string} id - Id of the user to delete.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given id could be found.
 */
const deleteById = async (id) => {
  debugLog(`Deleting user with id ${id}`);
  await userRepository.deleteById(id);
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  /*try {
    const {
      roles, userId,
    } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('user-service');
    logger.error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }*/
  const [error, { roles, userId }] = await useTryAsync(
    () => verifyJWT(authToken),
    error => {
      const logger = getChildLogger('user-service');
      logger.error(error.message, { error });
    }
  );
  if(error) throw ServiceError.unauthorized(error.message);

  return {
    userId,
    roles,
    authToken,
  };
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAndParseSession,
  checkRole,
};