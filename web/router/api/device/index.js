const paginationHandler = require('./pagination.handler');
const getByIdHandler = require('./getById.handler');
const postHandler = require('./post.handler');
const performDeviceActionHandler = require('./performDeviceAction.handler');
const deleteHandler = require('./delete.handler')

module.exports = (router) => {
  router.get('/device', paginationHandler);
  router.get('/device/:serial_number', getByIdHandler);
  router.post('/device', postHandler);
  router.put('/device/:serial_number', performDeviceActionHandler);
  router.delete('/device/:serial_number', deleteHandler);
};