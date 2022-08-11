const uuid = require('uuid');
const { getKnex, tables } = require('../data');
const { getChildLogger } = require('../core/logging');

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
    try {
      const id = uuid.v4();
      await getKnex()(tables.book)
        .insert({
          id,
          name,
          serie,
          serieNr,
        });
  
      return await findById(id);
    } catch (error) {
      const logger = getChildLogger('books-repo');
      logger.error('Error in create', {
        error,
      });
      throw error;
    }
};

const updateById = async ({
    name,
    serie,
    serieNr,
  }) => {
    try {
      const id = uuid.v4();
      await getKnex()(tables.book)
        .update({
          id,
          name,
          serie,
          serieNr,
        });
  
      return await findById(id);
    } catch (error) {
      const logger = getChildLogger('books-repo');
      logger.error('Error in updateById', {
        error,
      });
      throw error;
    }
};

const deleteById = async (id) => {
    try {
      const rowsAffected = await getKnex()(tables.book)
        .delete()
        .where('id', id);
  
      return rowsAffected > 0;
    } catch (error) {
      const logger = getChildLogger('books-repo');
      logger.error('Error in deleteById', {
        error,
      });
      throw error;
    }
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