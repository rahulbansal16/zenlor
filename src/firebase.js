import firebase from "firebase/app";
// import { Timestamp } from "@firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { generateUId, getTimeStamp } from "./util";
import { useEffect, useState, useContext, createContext } from "react";
import CONSTANTS from "./CONSTANTS";

const firebaseConfig = {
  apiKey: "AIzaSyAbXZfE3-8LgoKqqUOWElAR4aQnkuKAVwo",
  authDomain: "zenlor.firebaseapp.com",
  projectId: "zenlor",
  storageBucket: "zenlor.appspot.com",
  messagingSenderId: "495989491032",
  appId: "1:495989491032:web:63242d32f3d2587c3d512d",
  measurementId: "G-M2GZD60DKZ",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const analytics = firebase.analytics();
export const functions = firebase.app().functions('asia-northeast3');
export const storage = firebase.storage().ref();
firebase.auth().useDeviceLanguage();
export const firestore = firebase.firestore();
export const db = firestore;
firebase.firestore().settings({
  ignoreUndefinedProperties: true,
});
//
// The style code needs to be fetched from the database
//
export const fetchStyleCode = async (companyId, populateStyleCodes) => {
  // anusha_8923
  const styleCodeRef = await db
    .collection("company")
    .doc(companyId)
    .collection("style_codes")
    .orderBy("dueDate", "desc");
  return new Promise((resolve, reject) => {
    styleCodeRef.onSnapshot((snapshot) => {
      let styleCodes = [];
      snapshot.docs.forEach((d) => {
        console.log("Fetching the existing notification", d.data());
        styleCodes.push(d.data());
      });
      resolve(styleCodes);
    });
  });
};

export const updateTaskStatus = (styleCodeId, taskId, value) => {
  const createdAt = getTimeStamp();
  if (value['progressUpdate']){
    const remarksId = generateUId("re:" + createdAt, 10);
    db.collection("company")
    .doc(CONSTANTS.companyId)
    .collection("style_codes")
    .doc(styleCodeId)
    .collection("tasks")
    .doc(taskId)
    .collection("remarks")
    .doc(remarksId)
    .set({
      id: remarksId,
      createdAt,
      ...value,
    });
  }
  return db
    .collection("company")
    .doc(CONSTANTS.companyId)
    .collection("style_codes")
    .doc(styleCodeId)
    .collection("tasks")
    .doc(taskId)
    .update(
      {...value,
        modifiedAt: getTimeStamp()
      }, {
      merge: true,
    });
};

export const fetchTask = (styleCodeId, taskId) => {
  return db
    .collection("company")
    .doc(CONSTANTS.companyId)
    .collection("style_codes")
    .doc(styleCodeId)
    .collection("tasks")
    .doc(taskId)
    .get();
};

export const fetchTaskRemarks = async (companyId, styleCodeId, taskId) => {
  const remarksRef = await db
    .collection("company")
    .doc(companyId)
    .collection("style_codes")
    .doc(styleCodeId)
    .collection("tasks")
    .doc(taskId)
    .collection("remarks");
  return new Promise((resolve, reject) => {
    remarksRef.onSnapshot((snapshot) => {
      let remarks = [];
      snapshot.docs.forEach((d) => {
        console.log("Fetching the existing remarks", d.data());
        remarks.push(d.data());
      });
      remarks = remarks.reverse()
      resolve(remarks);
    });
  });
};

export const createStyleCode = (value) => {
  console.log("The value is", value);
  const {
    companyId,
    buyerName,
    dueDate,
    status,
    sizeSet,
    garmentCategory,
    styleCodeId,
  } = value;
  const styleCodeInternalId = generateUId("sc:" + getTimeStamp(), 15);
  const createdAt = getTimeStamp();
  console.log("The values are  ", {
    companyId,
    buyerName,
    dueDate,
    status,
    sizeSet,
    garmentCategory,
    styleCodeId,
  });
  return new Promise(async (resolve, reject) => {
    await db
      .collection("company")
      .doc(companyId)
      .collection("style_codes")
      .doc(styleCodeInternalId)
      .set({
        ...value,
        createdAt,
        id: styleCodeInternalId,
      });
    resolve(styleCodeInternalId);
  });
};

export const createTask = (value) => {
  console.log("The value is", value);
  const {
    companyId,
    name,
    dueDate,
    styleCodeId,
  } = value;
  const createdAt = getTimeStamp();
  return db
      .collection("company")
      .doc(companyId)
      .collection("style_codes")
      .doc(styleCodeId)
      .collection("tasks")
      .doc("task" + createdAt + generateUId("",3))
      .set({
        ...value,
        dueDate: dueDate.valueOf(),
        createdAt,
      });
}

// export const AuthContext = createContext()

// export const AuthContextProvider = props => {
//   const [user, setUser] = useState()
//   const [error, setError] = useState()

//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged( async userAuth => {
//       console.log('The uesrAuth is', userAuth)
//       setUser(userAuth)
//     })
//     return () => unsubscribe()
//   }, [])
//   return <AuthContext.Provider value={{ user, error }} {...props} />
// }

// export const useAuthState = () => {
//   const auth = useContext(AuthContext)
//   return { ...auth, isAuthenticated: auth.user != null }
// }

// export const getUser = async (username) => {
//     // console.log('The username is', username)
//     const snapshot = await db.collection('users').where('username','==', username).limit(1).get()
//     // console.log('The value of the of the user profile is', snapshot)
//     if (snapshot.empty){
//         return {}
//     }
//     let result = {}
//     snapshot.forEach( d => {
//         result = d.data();
//     })
//     return result
// }

// export const postNotifications = async ({
//     userId,
//     storyId,
//     storyCreatordId,
//     commentId,
//     avatar,
//     type,
//     content,
//     username
// }) => {
//     const notificationRef = db.collection('notifications').doc(storyCreatordId).collection('notification_data').doc()
//     notificationRef.set({
//         timestamp: getTimeStamp(),
//         storyId,
//         read: false,
//         userId,
//         avatar,
//         username,
//         type,
//         content,
//         commentId
//     })
// }

// export const updateNotifications = async (userId, notificationId) => {
//     const notificationRef = db.collection('notifications').doc(userId).collection('notification_data').doc(notificationId).set({
//         read: true
//     },{merge: true})
// }

// export const subscribeToNotifications = async (userId, updateNotifications) => {
//    const notificationRef =  db.collection('notifications').doc(userId).collection('notification_data').orderBy('timestamp', 'desc')
//    notificationRef.onSnapshot( snapshot => {
//     //    console.log('The existing data is ', snapshot.data())
//     //    snapshot.docs.forEach( d => {
//     //        console.log('Fetching the existing notification', d.data())
//     //        updateNotifications( d.data() )
//     //    })
//        snapshot.docChanges().forEach( change => {
//          if (change.type === "added"){
//             //  console.log('New data added in notifications', change.doc.data())
//              updateNotifications({ ...change.doc.data(), notificationId: change.doc.id})
//          }
//        })
//    }, err => console.log('Error loading the notification data', err))
// }

// export const getUserAndPassword = async (token, onSuccess) => {
//     const snap = await db.collection('tokens').doc(token).get()
//     const {username, password} = snap.data()
//     if ( username && password)
//         auth.signInWithEmailAndPassword(username, password).then(onSuccess)
//         Mixpanel.track("Login", {"source": "Token", "username": username})
//     return snap.data()
// }

// export const getUserFromId = async (uid) => {
//     const snapshot = await db.collection('users').doc(uid).get()
//     if ( !snapshot.data()){
//         return undefined
//     }
//     console.log('The snapshot data is ', snapshot.data())
//     return snapshot.data()
// }

// export const updateUser = async (id, user) => {
//      db.collection('users').doc(id).set(user, {merge: true}).catch( e => console.log('Error updating the user', e))
// }

// export const getStories = async (initStoryAction, updateStoryAction) => {
//     // const snapshot = await db.collection('stories1.0').orderBy('timestamp', 'desc').get();
//     const snapshotRef = db.collection('stories1.0').orderBy('timestamp', 'desc')
//     const snapshot = await snapshotRef.get()
//     if (snapshot.empty) {
//         return []
//     }
//     var result = { slideData: [] }
//     snapshot.forEach((doc) => {
//         console.log('The doc is', doc.data())
//         const {userStories} = doc.data()
//         // console.log('The userStories are ', userStories)
//             result.slideData.push(userStories)
//         // result.slideData.push({
//             // ...doc.data(),
//             // id: doc.id,
//             // comment_data: []
//         // })
//     });
//     initStoryAction(result)
//     console.log('The result is ',result.slideData)

//     snapshotRef.onSnapshot(snapshot => {
//         snapshot.docChanges().forEach( change => {
//             if (change.type === "added"){
//                  updateStoryAction({ ...change.doc.data(), id: change.doc.id})
//              }
//            })
//        }, err => console.log('Error loading the notification data', err)
//     )

//     return result
// }
// export const postTextStory = async ({
//     user_id,
//     avatar,
//     storyId,
//     user_name,
//     status,
//     type,
//     tags,
//     backgroundColor
// }) => {
//     let story = {
//         avatar,
//         tags: tags,
//         user_name,
//         type: 'text',
//         status,
//         backgroundColor,
//         id: storyId,
//         user_id,
//         timestamp: getTimeStamp()
//     }
//     let stories = {
//         timestamp: getTimeStamp(),
//         userStories: [story]
//     }
//     const newStoryRef = db.collection('stories1.0').doc(storyId)
//     return newStoryRef.set(stories, {merge:true})
// }

// export const uploadImage = async (file, name) => {

//     // const fileRead = await getBase64(file)
//     var snapshot = await storage.child(name).put(file, {
//         cacheControl:'public,max-age=4000'
//     })
//     return snapshot.ref.getDownloadURL()
// }

// export const postStories = async ({
//     id,
//     avatar,
//     user_name,
//     image_name
// }) => {
//     await db.collection('stories').doc(id).set({
//         avatar,
//         user_name,
//         image_name
//     })
// }
// export const sendNotifications = functions.httpsCallable('sendNotifications')
