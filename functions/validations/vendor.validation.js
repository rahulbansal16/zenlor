const Joi = require('joi');
const createVendor = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      // password: Joi.string().required().custom(pas),
      name: Joi.string().required(),
      role: Joi.string().required().valid('user', 'admin'),
    }),
};
const updateVendor = {
    
}

module.exports = {
    createVendor,
    updateVendor
}