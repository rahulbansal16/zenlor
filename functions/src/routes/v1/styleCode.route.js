const express = require('express');
const validate = require('../../middlewares/validate');
const vendorValidation = require('../../validations/vendor.validation')
const vendorController = require('../../controllers/vendor.controller');
const router = express.Router();

router
.route("/")
// .get() This will be visible via the normal fetching via the firestore
.post(validate(vendorValidation.createVendor), vendorController.createVendor)


router 
.route("/all")
.post()

router
.route("/:styleCodeId")
.put()



module.exports = router;