const config = require('config');
//const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
const characterRepository = require('../repository/character');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('character-service');
	this.logger.debug(message, meta);
};

const getAll = async (
    limit = DEFAULT_PAGINATION_LIMIT, 
    offset = DEFAULT_PAGINATION_OFFSET
) => {
	debugLog('Fetching all characters', { limit, offset });
	const data = await characterRepository.findAll({ limit, offset });
	const count = await characterRepository.findCount();
	return { 
		data,
        count,
        limit,
        offset, 
	};
};

const getById = async (id) => {
    debugLog(`Fetching character with id ${id}`);
    return Promise.resolve(characterRepository.findById(id));
};

const create = async ({ name, notes, bookId, userId }) => {
    debugLog('Creating new character', { name, notes, bookId, userId });

	return characterRepository.create({
		name,
		notes,
		bookId,
		userId,
	});
};

const updateById = async (id, { name, notes, bookId, userId }) => {
    debugLog('Updating character', { name, notes, bookId, userId });

	return characterRepository.updateById(id, {
		name,
		notes,
		bookId,
		userId,
	});
};

const deleteById = async (id) => {
    debugLog(`Deleting character with id ${id}`);
    await characterRepository.deleteById(id);
};

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}