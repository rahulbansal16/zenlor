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

export const getData = () => {
  return db.collection("data").doc(CONSTANTS.companyId).get()
}
