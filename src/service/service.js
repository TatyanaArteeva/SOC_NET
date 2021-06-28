
import axios from 'axios';

class Service {
    postLogin = async (url, data) => {
        const res = await axios.request({
            url: url,
            method: 'post',
            data: data,
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        if(res.status !== 200){
        new Error(`Что-то пошло не так! статус: ${res.status}`)
        }
        return res
    }

    loginPage =async (url, data)=>{
        const res= await this.postLogin(url, data);
        return res
    }

    postRegistration = async (url, data)=>{
        const res= await axios.post(url, data);

        return res
    }

    registrationPage = async (url, data)=>{
        const res= await this.postRegistration(url, data);
        return res
    }

    currentUserStatus = async (url)=> {
        const res= await axios.get(url);

        return res
    }

    getCurrentUserStatus = async (url) => {
        const res = await this.currentUserStatus(url);

        return res
    }

    userAccount= async (url, data) => {
        const res= await axios.post(url, data);

        return res
    }

    postUserAccount= async (url, data) => {
        const res= await this.userAccount(url, data);

        return res
    }


    userAccountId= async (id) => {
        const res= await axios.get(id);

        return res
    }

    getUserAccountId= async (id) => {
        const res= await this.userAccountId(`/api/account/${id}`);

        return res
    }

    exitPage= async (url) =>{
        const res= await axios.post(url);

        return res
    }

    logoutRequest= async (url) => {
        const res= await this.exitPage(url);
        return res
    }

    modificationUser= async (url, data)=>{
        const res= await axios.post(url, data);

         return res
    }

    postModificationUser= async (url, data) => {
        const res= await this.modificationUser(url, data);

        return res
    }

    accountInfo= async (url) => {
        const res= await axios.get(url);

        return res
    }

    getAccountInfo=async (url) =>{
        const res=await this.accountInfo(url);

        return res
    }

    newPhotoProfile=async (url, data)=>{
        const res = await axios.request({
            url: url,
            method: 'post',
            data: data,
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });

        return res
    }

    postNewPhotoProfile= async (url, data)=>{
        const res= await this.newPhotoProfile(url, data);

        return res
    }

    removePhotoProfile=async (url, data)=>{
        const res = await axios.post(url, data)

        return res
    }

    postRemovePhotoProfile= async (url, data)=>{
        const res= await this.removePhotoProfile(url, data);

        return res
    }

    accountPhoto= async (url, options) => {
        const res= await axios.get(url, options);

        return res
    }

    getAccountPhoto=async (url, options) => {
        const res=await this.accountPhoto(url, options);

        return res
    }

    deleteImagesFromGallery=async (url, data) => {
        const res=await axios.post(url, data);

        return res
    }

    postDeleteImagesFromGallery=async (url, data) => {
        const res=await this.deleteImagesFromGallery(url, data);

        return res
    }

}

export default Service;