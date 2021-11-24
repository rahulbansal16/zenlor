const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");

admin.initializeApp();

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const departments = [
  {name: "cutting", lineNumber: "1"},
  {name:"sewing", lineNumber:"1"},
  {name:"sewing", lineNumber:"2"},
  {name:"sewing", lineNumber:"3"},
  {name:"packing", lineNumber:"1"},
  {name:"washing", lineNumber:"1"},
  {name:"kajjaandbuttoning", lineNumber:"1"},
]

const values = {
  "cutting":["fabricIssued", "output"],
  "sewing": ["loadingReceivedQuantity", "output"],
  "kajjaandbuttoning": ["sewingReceivedQuantity", "output"],
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
    // let obj ={
    //   [department]: departmentData
    // }
    let obj = {}
    obj[department] = departmentData
    await admin.firestore().collection("data").doc("anusha_8923").set(obj ,{merge: true})
    return departmentData
})


exports.generateCSV = functions
.region("asia-northeast3")
.https.onRequest( async (request, response) => {
  let {department, lineNumber } = request.body;
  department = department || "all"
  lineNumber = lineNumber || '1'
  lineNumber = lineNumber.toString()

  const doc = await admin.firestore().collection("data").doc("anusha_8923").get()
  const data = doc.data()
  // console.log(departmentData)
  let file = ""
  if (department !== "all"){
    file = generateData(data[department], department, lineNumber)
  } else {
    file += departments.map( ({name, lineNumber}) =>  generateData(data[name], name, lineNumber) )
  }
  // console.log(file)
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

const sum = (values1, values2) => {
  let result = {}
  for (let key in values1){
    result[key] = values1[key]
  }
  for (let key in values2){
    if (result[key]){
      result[key] += values2[key]
    } else {
      result[key] = values2[key]
    }
  }
  return result
}

const mergeStyleCode = (data) => {
  let hash = {}
  for(let d of data){
    const {createdAt, styleCode, values} = d
    let key = styleCode + csvDate(createdAt)
    if (!hash[key]){
      hash[key] = {
        values,
        createdAt,
        styleCode
      }
    } else {
      hash[key] = {
        styleCode,
        values:  sum(values, hash[key].values),
        createdAt
      }
    }
  }
  let result = []
  console.log(hash)
  for (let v in hash){
    result.push(hash[v])
  }
  return result
}

const generateData = (departmentData ,department, line) => {
  let filteredDepartmentData = departmentData.filter( ({lineNumber, status})  => lineNumber === line && status === "active")
  filteredDepartmentData = mergeStyleCode(filteredDepartmentData)
  let keys = values[department]
  let fileData = ""
  fileData += filteredDepartmentData.map( row =>  {
    const {createdAt, styleCode, values} = row
    let header =  `${csvDate(createdAt)},${styleCode},`
    header += keys.map (key => values[key]||0)
    header += '\n'
    return header
  })
   fileData = ',' + fileData
   fileData = `\n${department} and lineNumber ${line}\n` + fileData
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