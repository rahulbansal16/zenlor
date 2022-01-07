const express = require('express');
const validate = require('../../middlewares/validate');
// const vendorValidation = require('../../validations/vendor.validation')
// const vendorController = require('../../controllers/vendor.controller');
const actionValidation = require('../../validations/action.validation')
const actionController = require('../../controllers/action.controller')
const router = express.Router();


// We will trying to update the put for a particular id
// Based on the Schema we will return the schema
router
.route("/:type/:id")
.put(validate((type) => actionValidation.updateAction), actionController.updateAction)

module.exports = router;