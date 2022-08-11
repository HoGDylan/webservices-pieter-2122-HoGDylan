const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
const { getKnex, tables } = require('../data');

const SELECT_COLUMS = [
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

const findById = async (id) => {
    const character = await getKnex()(`${tables.character}`)
        .join(`${tables.book}`, `${tables.book}.id`, '=', `${tables.character}.book_id`)
        .join(`${tables.user}`, `${tables.user}.id`, '=', `${tables.character}.user_id`)
        .where(`${tables.character}.id`, id)
        .first(SELECT_COLUMS);
    return character && formatCharacter(character);
};

const create = async ({
    name, notes, bookId, userId
}) => {
    try{
        const id = uuid.v4();
        await getKnex()(tables.character)
            .insert({
                id,
                name,
                notes,
                book_id: bookId,
                user_id: userId
            });
        return await findById(id);
    } catch (error){
        const logger = getChildLogger('character-repo');
        logger.error('Error in create', {error});
        throw error;
    }
};

module.exports = {
    findById,
    create,
};