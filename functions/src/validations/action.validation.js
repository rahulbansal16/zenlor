const Joi = require('joi');
// Update the BOM body
// id: "WASH23-50",
// styleCode: "WSH23",
// toMakeQty: 50,
// category: 'shirts',
// type: 'casual',
// materialId: 'SFSDFLSD2323',
// description: 'Soft Fabric',
// unit: 12,
// rate: 232,
// consumption: 1.23,
// reqQty: 40,
// remQty: 10,
// supplier: "ABC Company",
// poQty: 20
const createBOM = {
    body: Joi.object().keys({
      styleCode: Joi.string().required(),
      toMakeQty: Joi.string(),
      company: Joi.string().required(),
      category: Joi.string().required(),
      type: Joi.string().required(),
      materialId: Joi.string().required(),
      description: Joi.string(),
      unit: Joi.string(),
      rate: Joi.number(),
      consumption: Joi.number(),
      reqQty: Joi.number(),
      remQty: Joi.number(),
      supplier: Joi.string(),
      poQty: Joi.number(),
    }),
};
const updateVendor = {
    
}

const updateAction = () => {

}

module.exports = {
    updateAction,
    updateVendor
}