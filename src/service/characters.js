const uuid = require('uuid');
const { getLogger } = require('../core/logging');
let { CHARACTERS, BOOKS } = require('../data/mock-data');

const getAll = async () => {
    return Promise.resolve({
        data: CHARACTERS,
        count: CHARACTERS.length,
    });
};

const getById = async (id) => {
    return Promise.resolve(CHARACTERS.filter((c) => c.id == id)[0]);
};

const create = async ({ name, aliases, bookId, user }) => {
    return new Promise((resolve) => {
        let existingBook;
    if(bookId) {
        existingBook = BOOKS.filter((b) => b.id == bookId)[0];
        if(!existingBook) {
            getLogger().error(`There is no book with id ${bookId}`);
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
        aliases,
        book: existingBook,
        user,
    };
    CHARACTERS = [...CHARACTERS, newCharacter];
    resolve(newCharacter);
    });
};

const updateById = async (id, { name, aliases, bookId, user }) => {
    return new Promise((resolve) => {
        let existingBook;
    if(bookId) {
        existingBook = PLACES.filter((b) => b.id == bookId)[0];
        if(!existingBook) {
            getLogger().error(`There is no book with id ${bookId}`);
        }
    }

    if(typeof user == 'string') {
        user = {
            id: uuid.v4(),
            name: user,
        };
    }

    const updatedCharacter = {
        id,
        name,
        aliases,
        book: existingBook,
        user,
    };
    CHARACTERS = CHARACTERS.map((char) => {
        return char.id == id ? updatedCharacter : char;
    });
    resolve(getById(id));
    });
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