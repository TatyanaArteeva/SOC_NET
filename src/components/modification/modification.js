import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import {userInformation, dataBirth} from '../../actions';
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import parseISO from 'date-fns/parseISO';
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Modification=({Service, userInformation, dataBirth})=>{
            // firstName: null,
            // lastName: null,
            // sex: null,
            // birthDate: null,
            // city: null,
            // familyStatus: null,
            // phone: null,
            // employment: null,
            // personal: null,
            // id: null

            
            const [firstName, setFirstName]= useState();
            const [lastName, setLastName]= useState();
            const [sex, setSex] = useState();
            const [city, setCity] = useState();
            const [familyStatus, setFamilyStatus] = useState();
            const [phone, setPhone] = useState();
            const [employment, setEmployment]= useState();
            const [description, setDescription] = useState();
            const [startDate, setStartDate] = useState()


            useEffect(()=>{
                const information=async ()=>{
                    const res= await  Service.getCurrentUserStatus('/api/status');
                    setFirstName(res.data.currentAccount.firstName)
                    setLastName(res.data.currentAccount.lastName)
                    setSex(res.data.currentAccount.sex)
                    setCity(res.data.currentAccount.city)
                    setFamilyStatus(res.data.currentAccount.familyStatus)
                    setPhone(res.data.currentAccount.phone)
                    setEmployment(res.data.currentAccount.employment)
                    setDescription(res.data.currentAccount.description)

                    let newDate=null;
                    if(res.data.currentAccount.birthDate!==undefined && res.data.currentAccount.birthDate!==null && res.data.currentAccount.birthDate!=="Информация отсутствует"){
                        const dateTime=new Date(res.data.currentAccount.birthDate).getTime();
                        const dateTimeZone=new Date(res.data.currentAccount.birthDate).getTimezoneOffset() * 60 * 1000;
                        const dateNewTimeZone=new Date(dateTime+dateTimeZone).toISOString();
                        const dateBirth=parseISO(dateNewTimeZone);
                        newDate=dateBirth
                    }
                    console.log(newDate)
                    setStartDate(newDate)
                    
                    userInformation(res.data.currentAccount)

                }
                information()
            }, [])


            registerLocale("ru", ru);
    
            const futureDays = date => {
                return date <= new Date();
            };



            function valueFirstName(event){
                setFirstName(event.target.value)
                console.log(firstName)
            }
    
            function valueLastName(event){
                setLastName(event.target.value)
                console.log(lastName)
            }
    
            function valueSex(event){
                setSex(event.target.value)
                console.log(sex)
            }
    
            // function valueBirtday(event){
            //     setStartDate(event.target.value)
            //     console.log(startDate)
            // }
    
           
            function valueCity(event){
                setCity(event.target.value)
                console.log(city)
            }

            function valueDescription(event){
                setDescription(event.target.value);
                console.log(description)
            }

        
    


           


            return(
                <form>
                    <label>Моё имя: 
                        <input 
                                onChange={valueFirstName} 
                                type="text" 
                                name="firstName" 
                                placeholder="Укажите свое имя" 
                                value={firstName}
                                required/> 
                    </label>
                    <label>Моя фамилия: 
                        <input 
                                onChange={valueLastName} 
                                type="text" 
                                name="lastName" 
                                placeholder="Укажите свою фамилию"
                                value={lastName}/> 
                    </label>
                    <div>Мой пол:
    
                        <label> Женский 
                            <input value="Женский"
                                    onClick={valueSex} 
                                    checked={sex === "Женский" ? true : false}
                                    type="radio" 
                                    name="sex" />
                        </label>
    
                        <label> Мужской 
                            <input value="Мужской"
                                onClick={valueSex} 
                                checked={sex === "Мужской" ? true : false}
                                type="radio" 
                                name="sex" /> 
                        </label>
                    </div>
                    <label>Мой день рождения: 
                        <DatePicker dateFormat="dd.MM.yyyy" 
                                    filterDate={futureDays}
                                    selected={startDate} 
                                    onChange={(date) =>{
                                    // setStartDate(date);
                                    let newFormatDate=null;
                                        if (date != null) {
                                        newFormatDate=new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
                                        }
                                        setStartDate(newFormatDate);
                                    }} 
                                    placeholderText="Укажите вашу дату рождения"
                                    isClearable
                                    locale={ru}
                        />
                    </label>
                    <label>Мой город: 
                        <input 
                                onChange={valueCity} 
                                type="text" 
                                name="city" 
                                placeholder="Укажите свой город проживания"
                                value={city}/> 
                    </label>
                    <label>Моё семейное положение: 
                        <select 
                        // onChange={this.valueFamilyStatus} 
                                name="familyStatus">
                            <option>Не выбрано</option>
                            <option>Не замужем</option>
                            <option>Встречаюсь</option>
                            <option>Замужем/Женат</option>
                            <option>В гражданском браке</option>
                            <option>Влюблена(а)</option>
                            <option>Всё сложно</option>
                            <option>В активном поиске</option>
                        </select> 
                    </label>
                    <label>Мой номер телефона: 
                        <input 
                        // onChange={this.valuePhone} 
                                type="phone" 
                                name="phone" 
                                placeholder="Укажите свой номер телефона"
                                value="8908"/> 
                    </label>
                    
                    <label>
                    Моё место работы или учёбы: 
                        <input 
                        // onChange={valueEmployment} 
                                type="text" 
                                name="employment" 
                                placeholder="Укажите, чем вы сейчас занимаетесь"
                                // value={employment} 
                                /> 
                    
                    </label>
                    <label>Обо мне: 
                        <textarea  
                                onChange={valueDescription} 
                                name="description" 
                                placeholder="Укажите, чем вы увлекаетесь в свободное время"
                                value={description}>
                        </textarea> 
                    </label>
                    <button>Сохранить</button>
                </form>
            )


}

const mapStateToProps=(state)=>{
    return{}
}

const mapDispatchToProps={
    userInformation,
    dataBirth
}


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Modification));