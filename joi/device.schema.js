const Joi = require('joi');

// device schema
const deviceSchema = Joi.object().keys({
  device_id: Joi.number(),
  device_type: Joi.string().required(),
  name: Joi.string().required(),
  action: Joi.string(),
  is_active: Joi.boolean().required(),
});

module.exports = { deviceSchema };