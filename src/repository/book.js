const uuid = require('uuid');
const { getKnex, tables } = require('../data');
const { getChildLogger } = require('../core/logging');
const useTryAsync = require("no-try").useTryAsync;

const findAll = ({
    limit,
    offset
}) => {
    return getKnex()(tables.book)
        .select()
        .limit(limit)
        .offset(offset)
        .orderBy('name', 'ASC');
};

const findByName = (name) => {
    return getKnex()(tables.book)
      .where('name', name)
      .first();
};

const findById = (id) => {
    return getKnex()(tables.book)
        .where('id', id)
        .first();
};

const findCount = async () => {
    const [count] = await getKnex()(tables.book)
      .count();
    return count['count(*)'];
};

const create = async ({
    name,
    serie,
    serieNr,
  }) => {
    const id = uuid.v4();
    const [error] = await useTryAsync(() => 
      getKnex()(tables.book)
        .insert({
          id,
          name,
          serie,
          serieNr
      }),
      error => {
        const logger = getChildLogger('book-repo');
        logger.error('Error in create: when creating book', {error});
      }
    );
    const [error2, newBook] = await useTryAsync(
      () => findById(id),
      error => {
        const logger = getChildLogger('book-repo');
        logger.error('Error in create: when finding created book', {error});
      });
    if(error) throw error;
    if(error2) throw error2;

    return newBook;
};

const updateById = async (id, {
    name,
    serie,
    serieNr,
  }) => {
    const [error] = await useTryAsync(() => 
      getKnex()(tables.book)
        .update({
          id,
          name,
          serie,
          serieNr
      }),
      error => {
        const logger = getChildLogger('book-repo');
        logger.error('Error in update: when updating book', {error});
      }
    );
    const [error2, updatedBook] = await useTryAsync(
      () => findById(id),
      error => {
        const logger = getChildLogger('book-repo');
        logger.error('Error in update: when finding updated book', {error});
      });
    if(error) throw error;
    if(error2) throw error2;

    return updatedBook;
};

const deleteById = async (id) => {
  const [error, rowsAffected] = await useTryAsync(() => 
  getKnex()(tables.book)
    .delete()
    .where(`${tables.book}.id`, id),
  error => {
    const logger = getChildLogger('book-repo');
    logger.error('Error in deleteById', {error});
  });
  if(error) throw error;
  return rowsAffected > 0;
};

module.exports = {
    findAll,
    findById,
    findCount,
    findByName,
    create,
    updateById,
    deleteById,
}