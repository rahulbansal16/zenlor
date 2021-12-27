const { generateUId } = require("../utils/common");
const admin = require("./db");

const create = async (vendor) => {
  if (doesVendorExist(vendor)) {
    // Vendor Exist in the Database
    // throw
  }
  let newVendor = {
    ...vendor,
    id: generateUId(10),
  };
  await admin
    .firestore()
    .collection("data")
    .doc("vendors")
    .set(
      { vendors: admin.firestore.FieldValue.arrayUnion(newVendor) },
      {
        merge: true,
      }
    );
  return newVendor;
};

const doesVendorExist = async (vendor) => {
  const { phoneNumber } = vendor;
  const doc = await admin.firestore().collection("data").doc("vendors").get();
  const vendors = doc.data()["vendors"] || [];
  return vendors.some((vendor) => vendor.phoneNumber === phoneNumber);
};

module.exports = {
    create,
    doesVendorExist
}