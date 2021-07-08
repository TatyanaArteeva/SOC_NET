import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import {userInformation, modalWindowForUserNotificationOpen, modalWindowForUserNotificationClose} from '../../actions';
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import parseISO from 'date-fns/parseISO';
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { useHistory } from "react-router-dom";
import BeforeUnloadComponent from 'react-beforeunload-component';
import ModalWindow from '../ModalWindowForMessageUser/ModalWindowForMessageUser';

const Modification=({Service, userInformation, id, modalWindowForUserNotificationOpen, modalWindowForUserNotificationClose, modalWindowUserNotificationTrue})=>{

    const idLink=`/${id}`;
    const { push } = useHistory();
    registerLocale("ru", ru);

    const [firstName, setFirstName]= useState();
    const [lastName, setLastName]= useState();
    const [sex, setSex] = useState();
    const [city, setCity] = useState();
    const [familyStatus, setFamilyStatus] = useState();
    const [phone, setPhone] = useState()
    const [employment, setEmployment]= useState();
    const [description, setDescription] = useState();
    const [birthDate, setBirthtDate] = useState();
    const [email, setEmail] = useState();
    let newFormatDate=null;
  
    useEffect(()=>{
        const information=async ()=>{
            const res= await  Service.getUserAccountId(id);
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setSex(res.data.sex)
            setCity(res.data.city)
            setFamilyStatus(res.data.familyStatus)
            setPhone(res.data.phone)
            setEmployment(res.data.employment)
            setDescription(res.data.description)
            setEmail(res.data.email)

            let newDate=null;
            if(res.data.birthDate!==undefined && res.data.birthDate!==null && res.data.birthDate!=="Информация отсутствует"){
                const dateTime=new Date(res.data.birthDate).getTime();
                const dateTimeZone=new Date(res.data.birthDate).getTimezoneOffset() * 60 * 1000;
                const dateNewTimeZone=new Date(dateTime+dateTimeZone).toISOString();
                const dateBirth=parseISO(dateNewTimeZone);
                newDate=dateBirth
            }
            setBirthtDate(newDate)
            userInformation(res.data)

        }
        information()
    }, [])

    const futureDays = date => {
        return date <= new Date();
    };

    function valueFirstName(event){
        setFirstName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }
    
    function valueLastName(event){
        setLastName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }
    
    function valueSex(event){
        setSex(event.target.value)
    }
    
    function valueCity(event){
        setCity(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    function valueDescription(event){
        setDescription(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
    }
            
    function valueFamilyStatus(event){
        setFamilyStatus(event.target.value)
    }

    function valueEmployment(event){
        setEmployment(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    const partner=<><div>Здесь будут партнеры</div></>

    let selectionPartner=null;
    if(familyStatus!==null && familyStatus !== "Не выбрано" && familyStatus !== undefined && familyStatus.length>0){
        selectionPartner=partner
    }else{
        selectionPartner=null
    }

    function postModificationForm(event){
        if (birthDate !== null && birthDate !== undefined) {
            newFormatDate=new Date(birthDate.getTime() - birthDate.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
        }

        event.preventDefault();
        const modificationAccount={
            birthDate: newFormatDate,
            city: city,
            description: description,
            email: email,
            employment: employment,
            familyStatus: familyStatus,
            firstName: firstName,
            id: id,
            lastName: lastName,
            phone: phone,
            sex: sex
        }

        function closeModalWindowAndTransitionMyPage(){
            modalWindowForUserNotificationClose()
            push({
                pathname: `${idLink}`
            });
        }

        Service.postModificationUser('api/account', modificationAccount)
            .then(res=>{
                if(res.status===200){
                    modalWindowForUserNotificationOpen();
                }
            }).then(res=>{
                setTimeout(closeModalWindowAndTransitionMyPage, 3000)
            })
    }

    const modalWindowUserNotification=modalWindowUserNotificationTrue? <ModalWindow message={"Изменения успешно сохранены!"}/> :null;

    

    return(
        <div>
            <BeforeUnloadComponent blockRoute={true}
                                    alertMessage={"Вы уверены, что хотите уйти со страницы? Изменения не будут сохранены!"}>
                <form onSubmit={postModificationForm}>
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
                                <input  value="FEMALE"
                                        onClick={valueSex} 
                                        checked={sex === "FEMALE" ? true : false}
                                        type="radio" 
                                        name="sex" />
                        </label>
                        <label> Мужской 
                                <input  value="MALE"
                                        onClick={valueSex} 
                                        checked={sex === "MALE" ? true : false}
                                        type="radio" 
                                        name="sex" /> 
                        </label>
                    </div>
                    <label>Мой день рождения: 
                        <DatePicker dateFormat="dd.MM.yyyy" 
                                    filterDate={futureDays}
                                    selected={birthDate} 
                                    onChange={(date) =>{
                                        setBirthtDate(date);
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
                            onChange={valueFamilyStatus}
                            value={familyStatus} 
                            name="familyStatus">
                            <option>Не выбрано</option>
                            <option>Не замужем/ Не женат</option>
                            <option>Встречаюсь</option>
                            <option>Замужем/Женат</option>
                            <option>В гражданском браке</option>
                            <option>Влюблена(а)</option>
                            <option>Всё сложно</option>
                            <option>В активном поиске</option>
                        </select> 
                    </label>
                    { selectionPartner}
                    <label> Мой номер телефона:
                        <PhoneInput
                            placeholder="Укажите свой номер телефона"
                            value={phone}
                            onChange={setPhone}/>
                    </label>
                    <label>Моё место работы или учёбы: 
                        <input 
                            onChange={valueEmployment} 
                            type="text" 
                            name="employment" 
                            placeholder="Укажите, ваше место работы или учёбы"
                            value={employment} 
                        />      
                    </label>
                    <label>Обо мне: 
                        <textarea  
                            onChange={valueDescription} 
                            name="description" 
                            placeholder="Укажите, чем вы увлекаетесь в свободное время"
                            value={description}/> 
                    </label>
                    <button>Сохранить</button>
                </form>
            </BeforeUnloadComponent>
            {modalWindowUserNotification}
        </div>
    )
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
        modalWindowUserNotificationTrue: state.modalWindowForUserNotification
    }
}

const mapDispatchToProps={
    userInformation,
    modalWindowForUserNotificationOpen,
    modalWindowForUserNotificationClose
}


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Modification));