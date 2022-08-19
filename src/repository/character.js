const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
const { getKnex, tables } = require('../data');
const useTryAsync = require("no-try").useTryAsync;

const SELECT_COLUMNS = [
    `${tables.character}.id`, `${tables.character}.name`, 'notes',
    `${tables.book}.id AS book_id`, `${tables.book}.name AS book_name`,
    `${tables.user}.id AS user_id`, `${tables.user}.name AS user_name`

];

const formatCharacter = ({ book_id, book_name, user_id, user_name, ...character}) => {
    return {
        ...character,
        book: {
            id: book_id,
            name: book_name
        },
        user: {
            id: user_id,
            name: user_name,
        }
    }
};

const findAll = async ({
    limit,
    offset,
  }) => {
    const characters = await getKnex()(tables.character)
      .select(SELECT_COLUMNS)
      .join(tables.book, `${tables.character}.book_id`, '=', `${tables.book}.id`)
      .join(tables.user, `${tables.character}.user_id`, '=', `${tables.user}.id`)
      .limit(limit)
      .offset(offset)
      .orderBy(`${tables.character}.user_id`, 'ASC');
  
    return characters.map(formatCharacter);
  };

  const findCount = async () => {
    const [count] = await getKnex()(tables.character)
      .count();
  
    return count['count(*)'];
  };

const findById = async (id) => {
    const character = await getKnex()(`${tables.character}`)
        .join(`${tables.book}`, `${tables.book}.id`, '=', `${tables.character}.book_id`)
        .join(`${tables.user}`, `${tables.user}.id`, '=', `${tables.character}.user_id`)
        .where(`${tables.character}.id`, id)
        .first(SELECT_COLUMNS);
    return character && formatCharacter(character);
};

const create = async ({
    name, notes, bookId, userId
}) => {
    const id = uuid.v4();
    const [error] = await useTryAsync(() => 
      getKnex()(tables.character)
        .insert({
          id,
          name,
          notes,
          book_id: bookId,
          user_id: userId
      }),
      error => {
        const logger = getChildLogger('character-repo');
        logger.error('Error in create: when creating character', {error});
      }
    );
    const [error2, newCharacter] = await useTryAsync(
      () => findById(id),
      error => {
        const logger = getChildLogger('character-repo');
        logger.error('Error in create: to find created character', {error});
      });
    if(error) throw error;
    if(error2) throw error2;

    return newCharacter;
};

const updateById = async (id, {
    name, notes, bookId, userId
  }) => {
    const [error] = await useTryAsync(() => 
      getKnex()(tables.character)
        .update({
          id,
          name,
          notes,
          book_id: bookId,
          user_id: userId
      }).where('id', id),
      error => {
        const logger = getChildLogger('character-repo');
        logger.error('Error in update: when updating character', {error});
      }
    );
    const [error2, updatedCharacter] = await useTryAsync(
      () => findById(id),
      error => {
        const logger = getChildLogger('character-repo');
        logger.error('Error in update: when finding updated character', {error});
      });
    if(error) throw error;
    if(error2) throw error2;

    return updatedCharacter;
  };

  const deleteById = async (id) => {
    const [error, rowsAffected] = await useTryAsync(() => 
      getKnex()(tables.character)
        .delete()
        .where(`${tables.character}.id`, id),
      error => {
        const logger = getChildLogger('character-repo');
        logger.error('Error in deleteById', {error});
      });
      if(error) throw error;
      return rowsAffected > 0;
  };

module.exports = {
    findAll,
    findCount,
    findById,
    create,
    updateById,
    deleteById,
};