const express = require('express');
const validate = require('../../middlewares/validate');
// const vendorValidation = require('../../validations/vendor.validation')
// const vendorController = require('../../controllers/vendor.controller');
const bomValidation = require('../../validations/bom.validation')
const bomController = require('../../controllers/bom.controller')
const router = express.Router();

router
.route("/")
// .get()
.post(validate(bomValidation.createBOM), bomController.createBOM)

// router
// .route("/:vendorId")
// .get()


module.exports = router;