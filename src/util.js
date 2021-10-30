import moment from "moment";

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