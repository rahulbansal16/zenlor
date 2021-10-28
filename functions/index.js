const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment")

admin.initializeApp();

// Generate the Task on demand, Later on we will preindex the task for a particular date.
// company/anusha_8923/style_codes/style_code_id/tasks/task_id
// Fetch all such task initially and post that we can populate the db or store in the database

// We will allow user to create Task on a particular stylecode
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateUId(prefix,length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result = prefix + result.trim()
    return result.trim();
}


exports.createTask = functions.region('asia-northeast3').https.onRequest(async (req, res) => {
  const companyId = "anusha_8923"
  console.log("The request is", req.body);
  const {styleCodeId, tasks} = req.body
  var batch = await admin.firestore().batch()
  for ( let task of tasks){
    const createdAt =  new Date().getTime()
    const {name, dueDate, status} = task
    const docRef = admin
    .firestore()
    .collection("company")
    .doc(companyId)
    .collection("style_codes")
    .doc(styleCodeId)
    .collection("tasks")
    .doc("task" + createdAt + generateUId("",3))
    batch.set(docRef, {
      styleCodeId,
      status: status || "incomplete",
      name,
      dueDate,
      createdAt
    })
  }
  const result = await batch.commit()
  res.send(result)
})
// in case of ForEach there is an issue while handing the internal promises
exports.fetchTasks = functions.region('asia-northeast3').https.onCall(async (data, context) => {
  const { companyId, status } = data;
  const tomorrow = moment().subtract(0, "days").endOf("day").valueOf()
  console.log("The tomorrow date is", tomorrow)
  let totalTask = [];
  const styleCodesSnapshot = await admin
    .firestore()
    .collection("company")
    .doc(companyId)
    .collection("style_codes")
    .where("status", "==", "active")
    .get();
  for (let styleCodeSnapshot of styleCodesSnapshot.docs) {
    const { buyerName, fabricUrl, styleCode } = styleCodeSnapshot.data();
    const tasksSnapshots = await styleCodeSnapshot.ref
      .collection("tasks")
      .where("status", `==`, status || "incomplete")
      .get();
    for (let tasksSnapshot of tasksSnapshots.docs) {
      totalTask.push({
        ...tasksSnapshot.data(),
        id: tasksSnapshot.id,
        styleCodeId: styleCodeSnapshot.id,
        buyerName,
        fabricUrl,
        styleCode,
      });
    }
  }
  totalTask = totalTask.filter( task => task.dueDate <= tomorrow)
  totalTask = totalTask.sort( (a, b) => a.dueDate - b.dueDate)
  return totalTask;
});