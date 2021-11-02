// import { LEFT_SWIPE, RIGHT_SWIPE, STORY_END,NOTIFICATION_UPDATED, TOGGLE_STORY, UPDATE_AUTH, UPDATE_STORY_INDEX, UPDATE_USER_PROFILE, UPDATE_USER_STORY_STATUS,UPDATE_USER_WALKTHROUGH, STORY_INIT, PREV_STORY, NEXT_STORY, NOTIFICATION_READ, STORY_UPDATED, TAG_STORIES } from './actionType';

import { FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS} from "./actionType"
export const updateTaskStatusAction = (styleCodeId, taskId, {status}) => ({
    type: UPDATE_TASK_STATUS,
    payload: {styleCodeId, taskId, status}
})

export const fetchIncompleteTasksActions = (tasks) => ({
    type: FETCH_INCOMPLETE_TASKS,
    payload: {tasks}
})

export const fetchCompleteTasksActions = (tasks) => ({
    type: FETCH_INCOMPLETE_TASKS,
    payload: {tasks}
})


// export const updateUserState = (user) => ({
//     type: UPDATE_AUTH,
//     payload: user
// })

// export const updateIsStoryPaused = (isStoryPaused) => ({
//     type: TOGGLE_STORY,
//     payload: {isStoryPaused}
// })

// export const updateStoryIndex = (userStoryIndex, appStoryIndex) => ({
//     type: UPDATE_STORY_INDEX,
//     payload: {userStoryIndex, appStoryIndex}
// })

// export const updateUserStoryStatus = (userStoryStatus) => ({
//    type: UPDATE_USER_STORY_STATUS,
//     payload: {userStoryStatus}
// })

// export const updateUserProfile = (userProfile) => ({
//     type: UPDATE_USER_PROFILE,
//     payload : userProfile
// })

// export const updateWalkThrough = (walkThrough) => ({
//   type: UPDATE_USER_WALKTHROUGH,    
//   payload: walkThrough
// })

// export const rightSwipe = (currentIndex, totalStories) => ({
//     type: RIGHT_SWIPE,
//     payload: {
//         currentIndex,
//         totalStories
//     }
// })

// export const leftSwipe = (currentIndex, totalStories) => ({
//     type: LEFT_SWIPE,
//     payload: {
//         currentIndex,
//         totalStories
//     }
// })

// export const prevStory = () => ({
//     type: PREV_STORY,
//     // payload: {

//     // }
// })

// export const nextStory = () => ({
//     type: NEXT_STORY,
//     // payload: {

//     // }
// })

// export const userStoryEnd = (currentIndex, totalStories) => ({
//     type: STORY_END,
//     payload: {
//         currentIndex,
//         totalStories
//     }
// })

// export const updateNotifications = (notificationData) => ({
//     type: NOTIFICATION_UPDATED,
//     payload: {notifications: notificationData}
// })

// export const storyInit = (payload) => ({
//     type: STORY_INIT,
//     payload: payload
// })

// export const readNotifications = (notificationId) => ({
//     type: NOTIFICATION_READ,
//     payload: {
//         notificationId
//     }
// })

// export const storyUpdated = (payload) => ({
//     type: STORY_UPDATED,
//     payload
// })

// export const tagStories = (tags) => ({
//     type: TAG_STORIES,
//     payload: {
//         tags
//     }
// })