const express = require('express');
const validate = require('../../middlewares/validate');
const vendorValidation = require('../../validations/vendor.validation')
const vendorController = require('../../controllers/vendor.controller');
const router = express.Router();

router
.route("/")
// .get()
.post(validate(vendorValidation.createVendor), vendorController.createVendor)

router
.route("/:vendorId")
.get()


module.exports = router;