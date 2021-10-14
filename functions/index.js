const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// Generate the Task on demand, Later on we will preindex the task for a particular date.
// company/anusha_8923/style_codes/style_code_id/tasks/task_id
// Fetch all such task initially and post that we can populate the db or store in the database

// in case of ForEach there is an issue while handing the internal promises
exports.fetchTasks = functions.https.onCall(async (data, context) => {
        const {companyId} = data;
        let totalTask = []
        const styleCodesSnapshot = await admin.firestore().collection("company").doc(companyId).collection('style_codes').where('status', "==", "active").get()
        for (let styleCodeSnapshot of styleCodesSnapshot.docs){
            const tasksSnapshots =  await styleCodeSnapshot.ref.collection('tasks').get()
            for (let tasksSnapshot of tasksSnapshots.docs){
                totalTask.push({...tasksSnapshot.data(), id: tasksSnapshot.id, styleCodeId: styleCodeSnapshot.id})
            }
        }
        return totalTask
});