const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const bomService = require('../services');

const createBOM = catchAsync( async (req, res) => {
    const bom = await bomService.createBOM(req.body);
    res.status(httpStatus.CREATED).send(bom)
})

module.exports = {
   createBOM  
}