
import axios from 'axios';

class Service {
   postLoginAndRegistration = async (url, data) => {
    const res = await axios.post (url, data);
    console.log(res)
    if(res.statue !== 201){
        new Error(`Что-то пошло не так! статус: ${res.status}`)
    }
    return res
   }

   loginPage=async (url, data)=>{
    const res= await this.postLoginAndRegistration(url, data);
    return res
   }
}

export default Service;