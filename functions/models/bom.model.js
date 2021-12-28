const { generateUId } = require("../utils/common");
const admin = require("./db");
const DEFAULT_COMPANY = "shakti_tex"

const create = async (bom) => {
  let newItem = {
    ...bom,
    id: bom.styleCode + bom.category + bom.type,
  };
  await admin
    .firestore()
    .collection("data")
    .doc(bom?.company || DEFAULT_COMPANY)
    .set(
      { billOfMaterials: admin.firestore.FieldValue.arrayUnion(newItem) },
      {
        merge: true,
      }
    );
  return newItem;
};

const isExist = async (bom) => {
  const { styleCode, materialId } = bom;
  const doc = await admin.firestore().collection("data").doc(bom?.company || DEFAULT_COMPANY).get();
  const boms = doc.data()["billOfMaterials"] || [];
  return boms.some((bom) => bom.styleCode === styleCode && bom.materialId === materialId);
};

module.exports = {
    create,
    isExist
}