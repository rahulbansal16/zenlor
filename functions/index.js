const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const moment = require("moment");

admin.initializeApp();

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateUId(prefix, length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result = prefix + result.trim();
  return result.trim().toLowerCase();
}

// const getCurrentTime = () => {
//   return moment().locale("en-in").format("MMM DD YY, h:mm:ss a")
// }

exports.addData = functions
  .region("asia-northeast3")
  .https.onCall( async (body, context) => {
    const { department, json, createdAt, modifiedAt} = body
    console.log("The body is", body)
    const id = generateUId("", 15)
    const entry  = {...json, createdAt, modifiedAt, id, status: 'active'}
    const doc = await admin.firestore().collection("data").doc("anusha_8923").get()
    console.log("The doc is", doc.data())
    const departmentData = [entry, ...(doc.data()[department])]
    let obj = {}
    obj[department] = departmentData
    await admin.firestore().collection("data").doc("anusha_8923").set(obj ,{merge: true})
    return departmentData
})


exports.updateData = functions
.region("asia-northeast3")
.https
.onCall( async (data, context) => {
  const { department,id, json, modifiedAt, status} = data
  const entry  = {...json, modifiedAt, status: status || "active"}
  const doc = await admin.firestore().collection("data").doc("anusha_8923").get()
  let departmentData = doc.data()[department]
  departmentData = departmentData.map( item => {
    if (item.id !== id){
      return item
    }
    return {
      ...item,
      ...entry
    }
  })
  await admin.firestore().collection("data").doc("anusha_8923").set({
    cutting: departmentData
  } ,{merge: true})

  return departmentData
})
