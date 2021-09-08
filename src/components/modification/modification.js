import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import {userInformation, modalWindowForUserNotificationOpen, modalWindowForUserNotificationClose, pathLink, actionTransitionModification} from '../../actions';
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
import './modification.scss';
import PromptNav from '../PromptNav/promptNav';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinner/spinner';
import SpinnerMiniMini from '../spinner/spinner';

let req=false;

const Modification=({Service, userInformation, id, modalWindowForUserNotificationOpen, modalWindowForUserNotificationClose, modalWindowUserNotificationTrue})=>{
    const idLink=`/${id}`;
    const { push } = useHistory();
    registerLocale("ru", ru);
    const [firstName, setFirstName]= useState('');
    const [lastName, setLastName]= useState('');
    const [sex, setSex] = useState('');
    const [city, setCity] = useState('');
    const [familyStatus, setFamilyStatus] = useState('');
    const [phone, setPhone] = useState('')
    const [employment, setEmployment]= useState('');
    const [description, setDescription] = useState('');
    const [birthDate, setBirthtDate] = useState('');
    const [email, setEmail] = useState('');
    const[start, setStart]=useState(0);
    const [end, setEnd]=useState(10);
    const [accountsPartners, setAccountsPartners]=useState([]);
    const[totalSizePartners, setTotalSizePartners]=useState('');
    const [searchSelectPartner, setSearchSelectPartner]=useState('');
    const[ selectPartner,setSelectPartner]=useState('');
    const [searchPartner, setSearchPartner]=useState(false);
    const[calcIndex, setCalcIndex]=useState(false);
    const[loadingPartners, setLoadingPartners]=useState(false);
    const [modalWindowSelectPartner, setModalWindowSelectPartner]=useState(false);
    const [listPartnerStyle, setListPartnerStyle]=useState("modification__wrapper__select-partner__list");
    const[selectElem, setSelectElem]=useState({});
    const [nav, setNav]=useState('');
    const[prompt, setPrompt]=useState(true);
    const [spinner, setSpinner]=useState(true);
    const [spinnerMini, setSpinnerMini]=useState(false);
    const [spinnerMiniMini, setSpinnerMiniMini]=useState(false);
    const partnersListRef=useRef();

   

    let newFormatDate=null;
    useEffect(()=>{
        let cleanupFunction = false;
        const information=async ()=>{
            try{
                const res= await  Service.getUserAccountId(id);
                if(!cleanupFunction){
                    if(res.data.partner!==null){
                        setSelectElem(res.data.partner)
                        setSelectPartner(res.data.partner.id)
                    }else{
                        setSelectElem('')
                        setSelectPartner('')
                    }
                    const objModification={
                        city: res.data.city,
                        description: res.data.description,
                        email: res.data.email,
                        employment: res.data.employment,
                        familyStatus: res.data.familyStatus,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        phone: res.data.phone,
                        sex: res.data.sex,
                    }

                    for(let key in objModification){
                        if(objModification[key]===null || objModification[key]===undefined || objModification[key]==="Информация отсутствует"){
                            objModification[key]= ""
                        }
                    }

                    setFirstName(objModification.firstName)
                    setLastName(objModification.lastName)
                    setSex(objModification.sex)
                    setCity(objModification.city)
                    setFamilyStatus(objModification.familyStatus)
                    setPhone(objModification.phone)
                    setEmployment(objModification.employment)
                    setDescription(objModification.description)
                    setEmail(res.data.email)
                    setNav(false)
                    setSpinner(false)
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
            }catch(e){
                console.log(e)
            }

        }
        information()
        return () => cleanupFunction = true;
    }, [Service,id, userInformation])

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

    function valueSearchPartner(event){
        setSearchSelectPartner(event.target.value)
        setStart(0);
        setEnd(10)
    }

    function searchPartnerTrue(){
        setSearchPartner(true)
    }

    function openModalSelectPartner(){
        setModalWindowSelectPartner(true)
    }

    useEffect(()=>{
        if(searchSelectPartner.length===0 && searchPartner===true){
            setListPartnerStyle("active")
            setSelectPartner('')
            setSpinnerMini(true)
            Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`, {params:{name: searchSelectPartner}})
                .then(res=>{
                    if(res.status===200){
                            console.log(res)
                            const accountArr=res.data.accounts.map(el=>{
                                return el.account
                            })
                            console.log(accountArr)
                            setSpinnerMini(false)
                            setAccountsPartners(accountArr)
                            setTotalSizePartners(res.data.totalSize);
                    }
                })
        }
    },[searchSelectPartner, searchPartner])

    useEffect(()=>{
        if(searchSelectPartner.length>0 && searchPartner===true){
            
            if(start===0){
                setSpinnerMini(true)
                Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`, {params:{name: searchSelectPartner}})
                .then(res=>{
                    if(res.status===200){
                            const accountArr=res.data.accounts.map(el=>{
                                return el.account
                            })
                            console.log(accountArr)
                            setSpinnerMini(false)
                            setAccountsPartners(accountArr)
                            setTotalSizePartners(res.data.totalSize);
                    }
                })
            }

        }
    },[searchSelectPartner, searchPartner])

    let windowHeight= null;

    if((partnersListRef.current!==undefined && end<totalSizePartners)){
        console.log(partnersListRef)
        if( partnersListRef.current!==null){
            partnersListRef.current.addEventListener("scroll", ()=>{
                windowHeight=partnersListRef.current.clientHeight;
                let scrollTop = partnersListRef.current.scrollTop;
                if(partnersListRef.current!==null && partnersListRef.current!==undefined){
                    let heghtList=partnersListRef.current.scrollHeight;
                    console.log(scrollTop, heghtList)
                    let heghtListOffsetTop=partnersListRef.current.offsetTop
                    if((scrollTop+windowHeight - heghtListOffsetTop)>=(heghtList/100*50) && req===false && totalSizePartners!==undefined){
                        console.log("calc=true")
                        setCalcIndex(true)
                    }
                }  
            })
        }
    }

    useEffect(()=>{
        if(calcIndex){
            if(start+10===totalSizePartners){
                console.log("выходим")
                setCalcIndex(false)
                return
            }else if(start+10>totalSizePartners){
                console.log("выходим")
                setCalcIndex(false)
                return
            } else if(end+10>totalSizePartners){
                console.log("последний запрос")
                setStart(end)
                setEnd(totalSizePartners)
                req=true;
                setLoadingPartners(true)
                setCalcIndex(false)
            } else{
                console.log("запрос")
                setStart(end)
                setEnd(end+10)
                req=true
                setLoadingPartners(true)
                setCalcIndex(false)
            }
        }
    },[req, start, end, calcIndex])

    useEffect(()=>{
        let cleanupFunction = false;
        if(loadingPartners && start>=10){ 
            console.log("подгружаем новые данные")
            const inf=async ()=>{
                setSpinnerMiniMini(true)
                try{
                    const res=await Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`, {params:{name: searchSelectPartner}})
                    console.log(res)
                    if(!cleanupFunction){
                        const accountArr=res.data.accounts.map(el=>{
                            return el.account
                        })
                        console.log(accountArr)
                        setSpinnerMiniMini(false)
                        setAccountsPartners([...accountsPartners , ...accountArr])
                        setTotalSizePartners(res.data.totalSize)
                        req=false;
                        setLoadingPartners(false)
                    }
                }catch(e){
                    console.log(e)
                }
            }
            inf()
        }
        return () => cleanupFunction = true;
    },[loadingPartners])

    useEffect(()=>{
        if(!searchPartner){
            setListPartnerStyle("modification__wrapper__select-partner__list")
        }
    }, [searchPartner])
    

    function postModificationForm(event){
        setSpinner(true)
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
            sex: sex,
            partnerId: selectPartner
        }

        console.log(modificationAccount)

        for(let key in modificationAccount){
            if( modificationAccount[key]===null || modificationAccount[key].length===0){
                modificationAccount[key]= null
            }
        }

        console.log(modificationAccount)

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
                    setSpinner(false)
                    setNav(true)
                }
            }).then(res=>{
                setTimeout(closeModalWindowAndTransitionMyPage, 3000)
            })
    }

    const miniSpinner=spinnerMini ? <SpinnerMini/> : null;
    const miniMiniSpinner=spinnerMiniMini ? <SpinnerMiniMini/> : null;
    
    let accountsPartnersList=null;

    if(accountsPartners.length>0 && !spinnerMini){
        accountsPartnersList=<div>Возможных партнеров не найдено</div>
    }

    if(accountsPartners.length>0 && !spinnerMini){
        accountsPartnersList=accountsPartners.map((el, index)=>{
                            return  <li key={el.id} className="listPartnerItem" onClick={()=>{
                                setSelectElem(el)
                                setSelectPartner(el.id)
                            }}>
                                        <img src={"data:image/jpg;base64," + el.photo} alt="photoName" className="modification__wrapper__select-partner__list__img"/>
                                        <span>{index+1} {el.firstName} {el.lastName}</span>
                                    </li>
                        })
    }


    
    const partner=  <div className="modification__wrapper__select-partner">
                        <button onClick={closeModalSelectPartner}>Закрыть</button>
                        <input placeholder="Введите имя партнера"
                         type="text" 
                         name="selectPartner" 
                         value={searchSelectPartner} 
                         onChange={valueSearchPartner}
                         onClick={searchPartnerTrue}
                         className="modification__wrapper__select-partner__input"
                         autoComplete="off"
                         />
                         <div>
                             <ul className={listPartnerStyle} ref={partnersListRef}>
                                {totalSizePartners}
                                {
                                    accountsPartnersList
                                }
                                {miniSpinner}
                                {miniMiniSpinner}
                             </ul>
                         </div>
                    </div>;



let selectionPartner=null;

let selectPartnerBtn=null;

if(familyStatus==="RELATION"){
    selectPartnerBtn=<button onClick={openModalSelectPartner}>Выбрать партнера</button>
}

useEffect(()=>{
    if(familyStatus==="NO_RELATION" || familyStatus==="ACTIVE_SEARCH" || familyStatus.length===0){
        deleteSelectPartner()
    }
},[familyStatus])


let messageSelectPartner=null;

function closeModalSelectPartner(){
    setSearchPartner(false)
    setModalWindowSelectPartner(false);
    setSearchSelectPartner('');
}

function deleteSelectPartner(){
    setSelectElem({})
    setSelectPartner('')
}

useEffect(()=>{
    if(selectPartner.length>0 && selectElem.id.length>0){
        setSearchPartner(false)
        setModalWindowSelectPartner(false);
        setSearchSelectPartner('');
    }
},[selectElem])


if(selectPartner.length>0 && !searchPartner && !modalWindowSelectPartner && searchSelectPartner.length===0 && familyStatus==="RELATION"){
    selectPartnerBtn=null;
    let informationAboutConfirmationRelationships=null;
    if(selectElem.accepted===true){
        informationAboutConfirmationRelationships="Ваш партнер подтвердил отношения!"
    }else if(selectElem.accepted===false){
        informationAboutConfirmationRelationships="Ваш партнер еще не подтвердил отношения!"
    }else if(selectElem.accepted===undefined){
        informationAboutConfirmationRelationships=null
    }
        messageSelectPartner=<div>
                                <button onClick={deleteSelectPartner}>Удалить</button>
                                Ваш партнер: {selectElem.firstName} {selectElem.lastName}
                                {informationAboutConfirmationRelationships}
                            </div>
}



if(modalWindowSelectPartner){
    selectPartnerBtn=null;
    selectionPartner=partner

}

let promptReturn=prompt?<PromptNav when={nav===false}/>: null;

const modalWindowUserNotification=modalWindowUserNotificationTrue? <ModalWindow message={"Изменения успешно сохранены!"}/> :null;

const contentModification=<form onSubmit={postModificationForm}>
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
                                                onChange={valueSex} 
                                                checked={sex === "FEMALE" ? true : false}
                                                type="radio" 
                                                name="sex" />
                                </label>
                                <label> Мужской 
                                        <input  value="MALE"
                                                onChange={valueSex} 
                                                checked={sex === "MALE" ? true : false}
                                                type="radio" 
                                                name="sex" /> 
                                </label>
                                <label> Не выбрано
                                        <input  value=""
                                                onChange={valueSex} 
                                                checked={sex === "" ? true : false}
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
                                    <option value={''}>Не выбрано</option>
                                    <option value="RELATION">В отношениях</option>
                                    <option value="NO_RELATION">Не в отношениях</option>
                                    <option value="ACTIVE_SEARCH">В активном поиске</option>
                                </select> 
                            </label>
                            { selectionPartner}
                            {selectPartnerBtn}
                            {messageSelectPartner}
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

    const content=spinner?<Spinner/>: contentModification;

    return(
        <div className="modification">
                {promptReturn}
                {content}
                {modalWindowUserNotification}
        </div>
    )
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
        modalWindowUserNotificationTrue: state.modalWindowForUserNotification,
        pathLinkState: state.pathLink,
        actionTransitionModificationState: state.actionTransitionModification
    }
}

const mapDispatchToProps={
    userInformation,
    modalWindowForUserNotificationOpen,
    modalWindowForUserNotificationClose,
    pathLink
}


export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Modification));
