const httpStatus = require('http-status');
const { BOM } = require('../models');
const ApiError = require('../utils/ApiError');


const createBOM = async (bomBody) => {
    if (await BOM.isExist(bomBody) ){
        throw new ApiError(httpStatus.BAD_REQUEST, 'BOM Already Exist')
    }
    return BOM.create(bomBody);
}

module.exports = {
    createBOM
}