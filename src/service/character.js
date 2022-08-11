const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
let { CHARACTERS } = require('../data/mock-data');
const bookService = require('./book');
const characterRepository = require('../repository/character');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('character-service');
	this.logger.debug(message, meta);
};

const getAll = async () => {
    return Promise.resolve({
        data: CHARACTERS,
        count: CHARACTERS.length,
    });
};

const getById = async (id) => {
    return Promise.resolve(characterRepository.findById(id));
};

const create = async ({ name, notes, bookId, userId }) => {
    return new Promise((resolve) => {
    if(bookId) {
        const existingBook = bookService.getById(bookId);
        if(!existingBook) {
            throw ServiceError.notFound(`There is no book with id ${id}.`, { id });
        }
    }

    if(typeof user == 'string') {
        user = {
            id: uuid.v4(),
            name: user,
        };
    }

    const newCharacter = {
        id: uuid.v4(),
        name,
        notes,
        book: bookService.getById(bookId),
        userId,
    };
    debugLog('Creating new character', newCharacter);
    CHARACTERS = [...CHARACTERS, newCharacter];
    resolve(newCharacter);
    });
};

const updateById = async (id, { name, notes, bookId, userId }) => {
    debugLog(`Updating character with id ${id}`, {
		name,
		notes,
		bookId,
		userId,
	});

    if (bookId) {
		const existingBook = bookService.getById(bookId);

		if (!existingBook) {
			throw ServiceError.notFound(`There is no book with id ${id}.`, { id });
		}
	}
	const index = CHARACTERS.findIndex((character) => character.id === id);

	if (index < 0) return null;

	const character = CHARACTERS[index];
	character.name = name;
	character.notes = notes;
	character.book = bookService.getById(bookId);
	if (userId) {
		character.user = userId;
	}

	return character;
};

const deleteById = async (id) => {
    return new Promise((resolve) => {
        CHARACTERS = CHARACTERS.filter((c) => c.id != id);
        resolve();
    });
};

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}