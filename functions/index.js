const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const standardTasks = [
  "CONFIRM ORDER WITH BUYER",
  "ORDER FABRIC & YARDAGE",
  "ORDER TRIMS & OTHER MATERIALS",
  "INWARD TRIMS & OTHER MATERIALS",
  "INWARD YARDAGE",
  "START PP SAMPLE MAKING",
  "SEND FOR FPT TESTING",
  "FINISH PP SAMPLE MAKING",
  "SEND PP SAMPLE FOR BUYER APPROVAL",
  "SEND FOR GPT TESTING",
  "RECEIVE BUYER FPT APPROVAL",
  "RECEIVE BUYER PP SAMPLE APPROVAL",
  "RECEIVE BUYER GPT APPROVAL",
  "INWARD FABRIC",
  "FINISH FABRIC QC",
  "CALCULATE FABRIC SHRINKAGE",
  "SETUP PP MEETING WITH BUYER",
  "CONDUCT PP MEETING",
  "START PRODUCTION - PATTERN MAKING",
  "START CUTTING",
  "FINISH CUTTING",
  "START SEWING",
  "FINISH SEWING",
  "START KAJA & BUTTONING",
  "FINISH KAJA & BUTTONING",
  "SEND FOR WASHING",
  "RECEIVE FROM WASHING",
  "START FINISHING & PACKAGING",
  "FINISH PACKAGING",
  "SETUP FINAL INSPECTION WITH BUYER",
  "FINISH FINAL INSPECTION",
  "REQUEST DISPATCH APPROVAL FROM BUYER",
  "RECEIVE DISPATCH APPROVAL FROM BUYER",
  "DISPATCH STOCK",
];

const dependent = {
  1: [0],
  2: [1],
  3: [1],
  4: [3],
  5: [2],

  6: [4, 5],
  7: [5],
  8: [6],
  9: [8],
  10: [8],

  11: [7],
  12: [9],
  13: [10],
  14: [2],
  15: [14],

  16: [14],
  17: [16, 12, 13, 11, 15],
  18: [17],
  19: [18],
  20: [19],

  21: [20],
  22: [20],
  23: [21, 22],
  24: [22],
  25: [23, 24],

  26: [24],
  27: [25, 26],
  28: [25, 26],
  29: [27, 28],
  30: [28],

  31: [30],
  32: [31],
  33: [32],
  34: [33],
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateUId(prefix, length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result = prefix + result.trim();
  return result.trim();
}

const generateTaskId = (taskName) => {
  taskName = taskName.trim();
  let index = standardTasks.indexOf(taskName);
  let words = taskName.split(" ");
  words = words.filter((word) => word !== " ");
  const getAlphaCharacters = (word) => {
    word = word.toLowerCase();
    let characters = "";
    for (let i of word) {
      if ("a" <= i && i <= "z") {
        characters += i;
      }
    }
    return characters;
  };
  let filtered = words
    .map(getAlphaCharacters)
    .filter((word) => word.length >= 1);
  return index.toString() + "-" + filtered.join("-");
};

// [{ name, dueDate, taskId }]
exports.updateTaks = functions
  .region("asia-northeast3")
  .https.onRequest( async (req, res) => {
    const companyId = "anusha_8923";
    const { styleCodeId, tasks } = req.body;
    console.log(styleCodeId, tasks)
    var batch = await admin.firestore().batch();
    for(let task of tasks){
      const {taskId} = task
      const docRef = admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).collection("tasks").doc(taskId)
      batch.update(docRef, {
        taskId,
        ...task
      }, {merge:true});
    }
    const result = await batch.commit();
    res.send(result);
  })

exports.createTask = functions
  .region("asia-northeast3")
  .https.onRequest(async (req, res) => {
    const companyId = "anusha_8923";
    console.log("The request is", req.body);
    const { styleCodeId, tasks } = req.body;
    var batch = await admin.firestore().batch();
    for (let task of tasks) {
      const createdAt = new Date().getTime();
      const { name, dueDate, status } = task;
      const docRef = admin
        .firestore()
        .collection("company")
        .doc(companyId)
        .collection("style_codes")
        .doc(styleCodeId)
        .collection("tasks")
        .doc(generateTaskId(name));
      batch.set(docRef, {
        styleCodeId,
		id: generateTaskId(name),
        status: status || "incomplete",
        name,
        dueDate,
        createdAt,
      });
    }
    const result = await batch.commit();
    res.send(result);
  });

exports.completedTasks = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    const { companyId } = data;
    const styleCodes = await getStyleCodes(companyId);
    return await getTasks(styleCodes, "complete");
  });

exports.fetchTasks = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    const { companyId, dueDate, shouldRemoveDependentTask} = data;
    let totalTask = [];
    const styleCodes = await getStyleCodes(companyId);
    for (let styleCodeSnapshot of styleCodes.docs) {
      const { buyerName, fabricUrl, styleCode } = styleCodeSnapshot.data();
      const tasksSnapshots = await styleCodeSnapshot.ref
        .collection("tasks")
        .get();
      let tasks = tasksSnapshots.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          styleCodeId: styleCodeSnapshot.id,
          buyerName,
          fabricUrl,
          styleCode,
        };
      });
      if (shouldRemoveDependentTask)
        tasks = removeDependentTask(tasks);
      tasks = tasks.filter((task) => task.status === "incomplete");
      totalTask = totalTask.concat(tasks);
    }
    totalTask = totalTask.filter((task) => task.dueDate <= dueDate);
    totalTask = totalTask.sort((a, b) => a.dueDate - b.dueDate);
    return totalTask;
  });

const getStyleCodes = (companyId) => {
  return admin
    .firestore()
    .collection("company")
    .doc(companyId)
    .collection("style_codes")
    .where("status", "==", "active")
    .get();
};

const getTasks = async (styleCodes, status) => {
  let tasks = [];
  for (let styleCodeSnapshot of styleCodes.docs) {
    const { buyerName, fabricUrl, styleCode } = styleCodeSnapshot.data();
    const tasksSnapshots = await styleCodeSnapshot.ref
      .collection("tasks")
      .where("status", `==`, status || "incomplete")
      .get();
    let styleCodeTask = tasksSnapshots.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        styleCodeId: styleCodeSnapshot.id,
        buyerName,
        fabricUrl,
        styleCode,
      };
    });
    tasks = tasks.concat(styleCodeTask);
  }
  return tasks;
};

const removeDependentTask = (tasks) => {
  let taskStatus = {};
  taskStatus[0] = "complete";

  tasks.forEach((task) => {
    const taskId = getTaskId(task);
    // console.log("The task Status update is", taskId, task.status)
    taskStatus[taskId] = task.status;
  });
  // console.log("The taskStatus is", taskStatus)
  return tasks.filter((task) => {
    const taskId = getTaskId(task);
    // console.log("The taskId is ", taskId, task.name)
    return dependent[taskId].every(
      (item) =>
        taskStatus[item] === "complete" || taskStatus[item] === undefined
    );
  });
};

const getTaskId = ({ name }) => {
  name = name.trim();
  return standardTasks.indexOf(name) + 1;
};
