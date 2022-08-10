const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
let { BOOKS } = require('../data/mock-data');
const booksRepository = require('../repository/book')

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('book-service');
	this.logger.debug(message, meta);
};

const getAll = async (limit = 100, offset = 0) => {
	debugLog('Fetching all books');
	const data = await booksRepository.findAll({ limit, offset });
	return { 
		data: data, 
		count: data.length 
	};
};

const getById = (id) => {
	debugLog(`Fetching book with id ${id}`);
	return BOOKS.filter((book) => book.id === id)[0];
};

const create = ({ name, serie, serienr }) => {
	const newBook = { id: uuid.v4(), name, serie, serienr };
	debugLog('Creating new book', newBook);
	BOOKS = [...BOOKS, newBook];
	return newBook;
};

const updateById = (id, { name, serie, serienr }) => {
	debugLog(`Updating book with id ${id}`, { name, serie, serienr });
	const index = BOOKS.findIndex((book) => book.id === id);

	if (index < 0) return null;

	const book = BOOKS[index];
	book.serie = serie;
    book.serieNr = serienr;
	book.name = name;

	return book;
};

const deleteById = (id) => {
	debugLog(`Deleting book with id ${id}`);
	BOOKS = BOOKS.filter((book) => book.id !== id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
