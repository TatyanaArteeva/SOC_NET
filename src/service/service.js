import axios from 'axios';

class Service {
    postLogin = async (url, data) => {
        const res = await axios.request({
            url: url,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.status !== 200) {
            new Error(`Что-то пошло не так! статус: ${res.status}`)
        }
        return res
    }

    loginPage = async (url, data) => {
        const res = await this.postLogin(url, data);
        return res
    }

    postRegistration = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    registrationPage = async (url, data) => {
        const res = await this.postRegistration(url, data);
        return res
    }

    currentUserStatus = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getCurrentUserStatus = async (url) => {
        const res = await this.currentUserStatus(url);
        return res
    }

    userAccount = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postUserAccount = async (url, data) => {
        const res = await this.userAccount(url, data);
        return res
    }


    userAccountId = async (id) => {
        const res = await axios.get(id);
        return res
    }

    getUserAccountId = async (id) => {
        const res = await this.userAccountId(`/api/account/${id}`);
        return res
    }

    exitPage = async (url) => {
        const res = await axios.post(url);
        return res
    }

    logoutRequest = async (url) => {
        const res = await this.exitPage(url);
        return res
    }

    modificationUser = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postModificationUser = async (url, data) => {
        const res = await this.modificationUser(url, data);
        return res
    }

    accountInfo = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getAccountInfo = async (url) => {
        const res = await this.accountInfo(url);
        return res
    }

    newPhotoProfile = async (url, data) => {
        const res = await axios.request({
            url: url,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res
    }

    postNewPhotoProfile = async (url, data) => {
        const res = await this.newPhotoProfile(url, data);
        return res
    }

    removePhotoProfile = async (url, data) => {
        const res = await axios.post(url, data)
        return res
    }

    postRemovePhotoProfile = async (url, data) => {
        const res = await this.removePhotoProfile(url, data);
        return res
    }

    accountPhoto = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getAccountPhoto = async (url, options) => {
        const res = await this.accountPhoto(url, options);
        return res
    }

    deleteImagesFromGallery = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postDeleteImagesFromGallery = async (url, data) => {
        const res = await this.deleteImagesFromGallery(url, data);
        return res
    }

    newGroup = async (url, data) => {
        const res = await axios.request({
            url: url,
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.status !== 200) {
            new Error(`Что-то пошло не так! статус: ${res.status}`)
        }
        return res
    }

    postNewGroup = async (url, data) => {
        const res = await this.newGroup(url, data);
        return res
    }

    group = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getGroup = async (url, options) => {
        const res = await this.group(url, options);
        return res
    }


    groupAll = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getGroupAll = async (url, options) => {
        const res = await this.groupAll(url, options);
        return res
    }

    friends = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getFriends = async (url, options) => {
        const res = await this.friends(url, options);
        return res
    }


    itemsList = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getItems = async (url, options) => {
        const res = await this.itemsList(url, options);
        return res
    }

    actionsFriends = async (url) => {
        const res = await axios.post(url);
        return res
    }

    postActionsFriends = async (url) => {
        const res = await this.actionsFriends(url);
        return res
    }

    cancelAddFriend = async (url) => {
        const res = await axios.post(url);
        return res
    }

    postCancelAddFriend = async (url) => {
        const res = await this.cancelAddFriend(url);
        return res
    }

    deleteFriend = async (url) => {
        const res = await axios.post(url);
        return res
    }

    postDeleteFriend = async (url) => {
        const res = await this.deleteFriend(url);
        return res
    }

    actionsGroups = async (url) => {
        const res = await axios.post(url);
        return res
    }

    postActionsGroups = async (url) => {
        const res = await this.actionsGroups(url);
        return res
    }

    userGroup = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getUserGroup = async (url) => {
        const res = await this.userGroup(url);
        return res
    }

    resultForSearch = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getResultForSearch = async (url, options) => {
        const res = await this.resultForSearch(url, options);
        return res
    }

    message = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postMessage = async (url, data) => {
        const res = await this.message(url, data);
        return res
    }

    messageAll = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    getMessageAll = async (url, data) => {
        const res = await this.message(url, data);
        return res
    }

    messageRead = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postMessageRead = async (url, data) => {
        const res = await this.messageRead(url, data);
        return res
    }

    unreadMessage = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getUnreadMessage = async (url) => {
        const res = await this.unreadMessage(url);
        return res
    }

    messagesAll = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getMessagesAll = async (url) => {
        const res = await this.messagesAll(url);
        return res
    }


    allPosts = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    getAllPosts = async (url, data) => {
        const res = await this.allPosts(url, data);
        return res
    }

    informationForInputMessage = async (url) => {
        const res = await axios.post(url);
        return res
    }

    getInformationForInputMessage = async (url) => {
        const res = await this.informationForInputMessage(url);
        return res
    }

    unacceptedNotifications = async (url) => {
        const res = await axios.get(url);
        return res
    }

    getUnacceptedNotifications = async (url) => {
        const res = await this.unacceptedNotifications(url);
        return res
    }

    allNotifications = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    getAllNotifications = async (url, data) => {
        const res = await this.allPosts(url, data);
        return res
    }

    notificationRead = async (url, data) => {
        const res = await axios.post(url, data);
        return res
    }

    postNotificationRead = async (url, data) => {
        const res = await this.messageRead(url, data);
        return res
    }

    allPossiblePartners = async (url, options) => {
        const res = await axios.get(url, options);
        return res
    }

    getAllPossiblePartners = async (url, options) => {
        const res = await this.allPossiblePartners(url, options);
        return res
    }

}

export default Service;