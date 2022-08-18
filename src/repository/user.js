const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');
const useTryAsync = require("no-try").useTryAsync;

/**
 * Get all `limit` users, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of transactions to return.
 * @param {number} pagination.offset - Nr of transactions to skip.
 */
const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.user)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('name', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.user)
    .count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {string} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.user)
    .where('id', id)
    .first();
};

const findByEmail = (email) => {
  return getKnex()(tables.user)
    .where('email', email)
    .first();
};

/**
 * Create a new user with the given `name`.
 *
 * @param {object} user - User to create.
 * @param {string} user.name - Name of the user.
 */
const create = async ({
  name,
  email,
  passwordHash,
  roles,
}) => {
  const id = uuid.v4();
    const [error] = await useTryAsync(() => 
      getKnex()(tables.user)
        .insert({
          id,
          name,
          email,
          password_hash: passwordHash,
          roles: JSON.stringify(roles),
      }),
      error => {
        const logger = getChildLogger('user-repo');
        logger.error('Error in create: when creating user', {error});
      }
    );
    const [error2, newUser] = await useTryAsync(
      () => findById(id),
      error => {
        const logger = getChildLogger('user-repo');
        logger.error('Error in create: to find created user', {error});
      });
    if(error) throw error;
    if(error2) throw error2;

    return newUser;
};

/**
 * Update a user with the given `id`.
 *
 * @param {string} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} user.name - Name of the user.
 */
const updateById = async (id, {
  name,
}) => {
  const [error] = await useTryAsync(() => 
    getKnex()(tables.user)
      .update({
        id,
        name,
        email,
        password_hash: passwordHash,
        roles: JSON.stringify(roles),
    }),
    error => {
      const logger = getChildLogger('user-repo');
      logger.error('Error in update: when updating user', {error});
    }
  );
  const [error2, newUser] = await useTryAsync(
    () => findById(id),
    error => {
      const logger = getChildLogger('user-repo');
      logger.error('Error in update: to find updating user', {error});
    });
  if(error) throw error;
  if(error2) throw error2;

  return newUser;
};

/**
 * Update a user with the given `id`.
 *
 * @param {string} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  const [error, rowsAffected] = await useTryAsync(() => 
  getKnex()(tables.user)
    .delete()
    .where(`${tables.user}.id`, id),
  error => {
    const logger = getChildLogger('user-repo');
    logger.error('Error in deleteById', {error});
  });
  if(error) throw error;
  return rowsAffected > 0;
};

module.exports = {
  findAll,
  findCount,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
};