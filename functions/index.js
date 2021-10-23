const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment")

admin.initializeApp();

// Generate the Task on demand, Later on we will preindex the task for a particular date.
// company/anusha_8923/style_codes/style_code_id/tasks/task_id
// Fetch all such task initially and post that we can populate the db or store in the database

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