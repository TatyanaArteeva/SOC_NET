
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
        // if(res.status !== 200){
        //     new Error(`Что-то пошло не так! статус: ${res.status}`)
        // }
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

    getCurrentUserStatus = async (url) =>{
        const res = await this.currentUserStatus(url);

        return res
    }

    exitPage= async (url) =>{
        const res= await axios.post(url);

        return res
    }

    logoutRequest= async (url) =>{
        const res= await this.exitPage(url);
        return res
    }
    
}

export default Service;