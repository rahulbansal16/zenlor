const httpStatus = require('http-status');
const {Bom} = require('../models');
const ApiError = require('../utils/ApiError');


const createBOM = async (bomBody) => {
    if (await Bom.isExist(bomBody) ){
        throw new ApiError(httpStatus.BAD_REQUEST, 'BOM Already Exist')
    }
    return Bom.create(bomBody);
}

module.exports = {
    createBOM
}