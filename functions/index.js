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
      const {id} = task
      const docRef = admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).collection("tasks").doc(id)
      batch.update(docRef, {
        id,
        ...task,
				dueDates: admin.firestore.FieldValue.arrayUnion(task['dueDate'])
      }, {merge:true});
    }
    const result = await batch.commit();
    res.send(result);
  })

exports.updateTasksOnCall = functions
.region("asia-northeast3")
.https
.onCall( async (data, context) => {
  const companyId = "anusha_8923"
  const {styleCodeId, tasks} = data
  const doc = await admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).get()
  const oldTasks = doc.data()["tasks"];
  const result = await admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).update({
    tasks: mergeOldAndNewTasks(oldTasks, tasks)
  }, {
    merge:true
  })
  return result
})

exports.updateTasks1 = functions
  .region("asia-northeast3")
  .https.onRequest( async (req, res) => {
    const companyId = "anusha_8923";
    const { styleCodeId, tasks } = req.body;
    console.log(styleCodeId, tasks)
    const doc = await admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).get()
    const oldTasks = doc.data()["tasks"];
    const result = await admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).update({
      tasks: mergeOldAndNewTasks(oldTasks, tasks)
    }, {
      merge:true
    })
    res.send(result);
  })

const mergeOldAndNewTasks = (oldTasks, newTasks) => {

  const hash = {}
  for (let task of newTasks){
    hash[task.id] = task
  }

  let result = []
  for (let oldTask of oldTasks){
    const {id} = oldTask
    const task = hash[id]
    if (task === undefined){
      result.push(oldTask)
      continue
    }
    if (task["dueDate"]){
      oldTask["dueDates"] = [ ...(oldTask["dueDates"] || []) ,task["dueDate"] ]
    }
    oldTask = {...oldTask, ...task}
    result.push(oldTask)
  }
  return result

}

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
				dueDates:[dueDate],
        status: status || "incomplete",
        name,
        dueDate,
        createdAt,
      });
    }
    const result = await batch.commit();
    res.send(result);
  });


exports.createTask1 = functions
.region("asia-northeast3")
.https.onRequest(async (req, res) => {
  const companyId = "anusha_8923";
  console.log("The request is", req.body);
  const { styleCodeId, tasks } = req.body;
  const tasksEntry = []
  for (let task of tasks) {
    const createdAt = new Date().getTime();
    const { name, dueDate, status } = task;
    tasksEntry.push({
      styleCodeId,
      id: generateTaskId(name),
      dueDates:[dueDate],
      status: status || "incomplete",
      name,
      dueDate,
      createdAt,
    })
  }
  const result = await admin.firestore().collection("company").doc(companyId).collection("style_codes").doc(styleCodeId).update({
    tasks: admin.firestore.FieldValue.arrayUnion(...tasksEntry)
  }, {
    merge:true
  })
  res.send(result);
});

exports.completedTasks = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    const { companyId } = data;
    const styleCodes = await getStyleCodes(companyId);
    let tasks = await getTasks(styleCodes, "complete");
    tasks = tasks.sort((a, b) => a.dueDate - b.dueDate);
		return tasks.slice(5)
  });


exports.migrateTaskDocToArray = functions.region("asia-northeast3")
.https
.onCall( async (data, context) => {
  // sc:1635756759467sFYW5JoBW5Z4gQt
  const styleCodes = await getStyleCodes("anusha_8923");
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
    console.log("The tasks are", tasks)
    const result = await admin.firestore().collection("company").doc("anusha_8923").collection("style_codes").doc(styleCodeSnapshot.id).update({
        tasks
    }, {
      merge:true
    })
    console.log("The result is", result)
  }
})

exports.fetchTasks = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    const { companyId, dueDate, shouldRemoveDependentTask} = data;
    let totalTask = [];
    const styleCodes = await getStyleCodes(companyId);
    for (let styleCodeSnapshot of styleCodes.docs) {
      const { buyerName, fabricUrl, styleCode, tasks } = styleCodeSnapshot.data();
      let styleCodeTasks = tasks.filter( task => task.status === "incomplete")
      styleCodeTasks = styleCodeTasks.map((doc) => {
        return {
          ...doc,
          id: doc.id,
          styleCodeId: styleCodeSnapshot.id,
          buyerName,
          fabricUrl,
          styleCode,
        };
      });
      if (shouldRemoveDependentTask)
      styleCodeTasks = removeDependentTask(styleCodeTasks);
      styleCodeTasks = styleCodeTasks.filter((task) => task.status === "incomplete");
      totalTask = totalTask.concat(styleCodeTasks);
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
  // console.log("The value of the getTasks are", status, styleCodes)
  let totalTasks = [];
  for (let styleCodeSnapshot of styleCodes.docs) {
    const { buyerName, fabricUrl, styleCode, tasks } = styleCodeSnapshot.data();
    const styleCodeTasks = tasks.filter( task => task.status === (status || "incomplete"))
    let styleCodeTask = styleCodeTasks.map((doc) => {
      return {
        ...doc,
        id: doc.id,
        styleCodeId: styleCodeSnapshot.id,
        buyerName,
        fabricUrl,
        styleCode,
      };
    });
    totalTasks = totalTasks.concat(styleCodeTask);
  }
  return totalTasks;
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

const getTaskId = ({ name, id }) => {
	console.log("The name and id", name, id)
	if (id.includes("task")){
 	 	name = name.trim()
  	return standardTasks.indexOf(name) + 1
	} else {
		return parseInt(id.split('-')[0]) + 1
	}
};
