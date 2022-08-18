const config = require('config');
//const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
const booksRepository = require('../repository/book')

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('book-service');
	this.logger.debug(message, meta);
};

const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT, 
	offset = DEFAULT_PAGINATION_OFFSET
) => {
	debugLog('Fetching all books');
	const data = await booksRepository.findAll({ limit, offset });
	const count = await booksRepository.findCount();
	return { 
		data, 
		count, 
    limit,
    offset,
	};
};

const getById = (id) => {
	debugLog(`Fetching book with id ${id}`);
	return booksRepository.findById(id);
};

const create = ({ name, serie, serieNr }) => {
	const newBook = { name, serie, serieNr };
	debugLog('Creating new book', newBook);
	return booksRepository.create(newBook);
};

const updateById = (id, { name, serie, serieNr }) => {
	const updatedBook = { name, serie, serieNr}
	debugLog(`Updating book with id ${id}`, { name, serie, serieNr });
	return booksRepository.updateById(id, updatedBook);
};

const deleteById = async (id) => {
	debugLog(`Deleting book with id ${id}`);
	await booksRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
