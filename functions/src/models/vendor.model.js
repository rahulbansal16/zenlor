const { generateUId } = require("../utils/common");
const admin = require("./db");

const create = async (vendor) => {
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
  const { gst } = vendor;
  const doc = await admin.firestore().collection("data").doc("vendors").get();
  const vendors = doc.data()["vendors"] || [];
  return vendors.some((vendor) => vendor.gst === gst);
};

module.exports = {
    create,
    doesVendorExist
}