const paginationHandler = require('./pagination.handler');
const getByIdHandler = require('./getById.handler');
const postHandler = require('./post.handler');

module.exports = (router) => {
  router.get('/device', paginationHandler);
  router.get('/device/:id', getByIdHandler);
  router.post('/device', postHandler);
};