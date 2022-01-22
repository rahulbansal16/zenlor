import moment from "moment";
import Papa from "papaparse";
import { initialState } from "./redux/reducers/taskReducer";


export const getTimeStamp = () => {
    return new Date().getTime()
}

// program to generate random strings

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateUId(prefix,length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result = prefix + result.trim()
    return result.trim();
}

export const generateImageStoryUploadId = (auth) => {
    return getUserName(auth).trim() + '_image_story_'+ generateUId(5)
}

export const getAvatarSrc = (user, username) => {
    if ( user.avatar )
        return user.avatar
    return "https://firebasestorage.googleapis.com/v0/b/noomi-d9a4e.appspot.com/o/pngkey.com-user-png-730477.png?alt=media&token=2de61205-da8a-4c03-a93a-a4fc12597052"
}

export const getTags = (user) => {
    let usertags = user.tag
    const index = usertags.indexOf("default")
    if ( user.tag.length > 1 && index)
        usertags.splice(index,1)
        return usertags
    return usertags
}

export const generateStoryId = (auth) => {
    return  getUserId(auth) + generateUId(10)
}

export const getUserName = (auth) => {
    return auth.currentUser ? auth.currentUser.email.split('@')[0] : "test"
}

export const getUserId = (auth) => {
    return auth && auth.currentUser? auth.currentUser.uid: 'noid';
}

export function between(min, max) {
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

export function getTimeStampAhead(day){
    return moment().add(day, "days").endOf("day").valueOf()
}

export function getTimeStampFromDate(date){
    return moment(date).format("MMM DD YY, h:mm:ss a").valueOf()
}

export const appendToPath= (history, path) => {
    return `${history.location.pathname+path}`
}

export function getCurrentTime(){
    return moment().format("MMM DD YY, h:mm:ss a")
}

export function formatDate(date){
    return moment(date).format("ddd DD MMM | h:mm A")
}

export function jsonToCsv(json){
    
}

export function purchaseMaterialKey(item){
    const {styleCode, materialId, materialDescription} = item
    return /*styleCode.toLowerCase().trim() +*/ materialId.toLowerCase().trim() + materialDescription.toLowerCase().trim()
}

export function downloadCsv(purchaseOrder){
    const poFields= initialState.purchaseOrder.columns.map(item => item.key)
    const poHeaders= initialState.purchaseOrder.columns.map(item => item.title)
    const {supplier, id, deliveryDate, amount} = purchaseOrder
    const topHeader = ['SUPPLIER',supplier,'','PO Number',id,'','Delivery',deliveryDate]
    const lineItems = purchaseOrder.lineItems.map(item => poFields.map(field => item[field]||"."))
    const footer = ['TOTAL', '','','','','','INR',amount||'.']
    console.log("Line Items", lineItems);

    const fileName = supplier+'_'+deliveryDate
    let data =[[...topHeader], [...poHeaders], ...lineItems, [...footer]]
    // data =[]
    console.log(data)
    const csv = Papa.unparse(data, {
        greedy: true,
        header: false,
      });
      const blob = new Blob([csv]);
      const a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `${fileName || "table"}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    // var downloadLink = document.createElement("a");
    // var blob = new Blob([fileContent], { type: 'text/csv' });
    // var url = URL.createObjectURL(blob);
    // downloadLink.href = url;
    // downloadLink.download = fileName;
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
}