const { getKnex, tables } = require('../data');

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

module.exports = {
    findAll,
}