const { shutdownData, getKnex, tables } = require("../src/data");

module.exports = async () => {
    await getKnex()(tables.character).delete();
    await getKnex()(tables.user).delete();
    await getKnex()(tables.book).delete();

    await shutdownData();
};