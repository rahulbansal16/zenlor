const Joi = require('joi');
const createVendor = {
    body: Joi.object().keys({
      name: Joi.string().required(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pin: Joi.number(),
      gst: Joi.string().required(),
      panCard: Joi.string(),
      contactPerson: Joi.string(),
      email: Joi.string().required().email(),
      mobileNumber: Joi.string().required()
    }),
};
const updateVendor = {
    
}

module.exports = {
    createVendor,
    updateVendor
}