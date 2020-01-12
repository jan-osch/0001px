const mongodb = require('./mongo-db').initialize;

const main = async () => {
  await mongodb;
};

module.exports = main();
