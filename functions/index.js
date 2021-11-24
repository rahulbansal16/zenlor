const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");

admin.initializeApp();

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const departments = [
  "cutting",
  "sewing",
  "packing",
  "washing",
  "kajaandbuttoning"
]

const values = {
  "cutting":["fabricIssued", "output"],
  "sewing": ["loadingReceivedQuantity", "output"],
  "kajaandbuttoning": ["sewingReceivedQuantity", "output"],
  "washing": ["washingReceivedQuantity", "washingSentQuantity"],
  "packing": ["washingReceivedQuantity","packedQuantity","rejectedQuantity"]
}

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


exports.generateCSV = functions
.region("asia-northeast3")
.https.onRequest( async (request, response) => {
  let {department, lineNumber } = request.body;
  department = department || "cutting"
  lineNumber = lineNumber || '1'
  lineNumber = lineNumber.toString()

  const doc = await admin.firestore().collection("data").doc("anusha_8923").get()
  const departmentData = doc.data()[department]
  console.log(departmentData)
  const file = generateData(departmentData, department, lineNumber)
  console.log(file)
  response.attachment(`${department}:${lineNumber}.csv`)
  response.type('csv')
  response.send(file)
  // response.setHeader('Content-Type', 'application/vnd.openxmlformats');
  // response.setHeader("Content-Disposition", "attachment; filename=" + department + " : " + lineNumber);
  // response.end(file, 'binary');
  // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  // response.send(file);
})

const csvDate = (date) => {
  return moment(date, "MMM DD YY, h:mm:ss a").format("DD MMM YYYY")
}

const generateData = (departmentData ,department, line) => {

  departmentData = departmentData.filter( ({lineNumber, status})  => lineNumber === line && status === "active")
  let keys = values[department]
  let fileData = ""
  fileData += departmentData.map( row =>  {
    const {createdAt, styleCode, values} = row
    let header =  `${csvDate(createdAt)},${styleCode},`
    header += keys.map (key => values[key]||0)
    header += '\n'
    return header
  })
  fileData = ',' + fileData
  return fileData
}



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
  let obj = {}
  obj[department] = departmentData
  await admin.firestore().collection("data").doc("anusha_8923").set(obj ,{merge: true})
  return departmentData
})

exports.insertStyleCode = functions
.region("asia-northeast3")
.https
.onCall( async (data, context) => {
  const {styleCodes} = data
  return await admin.firestore().collection("data").doc("anusha_8923").set({
    styleCodes
  } ,{merge: true})
})