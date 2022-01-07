const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vendorService} = require('../services');

const createVendor = catchAsync( async (req, res) => {
    const vendor = await vendorService.createVendor(req.body);
    res.status(httpStatus.CREATED).send(vendor)
})

module.exports = {
    createVendor
}