import React, {useState, useEffect} from 'react';
import './group.scss';
import WithService from '../hoc/hoc';
import { withRouter, useHistory} from "react-router-dom";
import {connect} from 'react-redux';
import {groupId, groupAccesses, groupInfoRelation, currentIdLocation, openModalAllParticipantsGroup} from '../../actions';
import {Link, HashRouter} from 'react-router-dom';
import ModalWindowAllParticipantsGroup from '../modalWindowAllParticipantsGpoup/modalWindowAllParticipantsGroup';
import PostsList from '../postsList/postsList';
import Spinner from '../spinner/spinner';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import cancel from './cancel.svg';
import './font.scss';
import eyeClose from './eyeClose.svg';

const Group =({Service, idInUrl, groupId, groupAccesses, accesses, groupInfoRelation, infoRelation, currentIdLocation, openModalAllParticipantsGroup, modalAllParticipantsGroup, idUser, inputMessageCount})=>{
    const[nameGroup, setNameGroup]=useState();
    const[themeGroup, setThemeGroup]=useState();
    const[subThemeGroup, setSubThemeGroup]=useState();
    const[descriptionGroup, setDescriptionGroup]=useState();
    const[photoGroup, setPhotoGroup]=useState('');
    const[photoNameGroup, setPhotoNameGroup]=useState();
    const[id, setId]=useState();
    const [administratorGroup, setAdministratorGroup]=useState({})
    const[userInGroup, setUsersInGroup]=useState([]);
    const [totalSizeUserInGroup, setTotalSizeUserInGroup]=useState();
    const [spinner, setSpinner]=useState(true);
    const [error, setError]=useState(false);
    const [errorMessage, setErrorMessage]=useState('');
    const [inBlockErrorMessage, setInBlockErrorMessage]=useState(false);
    const [errorReq, setErrorReq]=useState(false);
    const { push } = useHistory();
    const idUserForUrl=`/${idUser}`;
    
    useEffect(()=>{
        let cleanupFunction = false;
            currentIdLocation(idInUrl)
            const information=async () =>{
            try{
                const res=await Service.getGroup(`/api/group/${idInUrl}/page-info`);
                const userGroup=await Service.getUserGroup(`/api/group-relation/get-group-accounts/${idInUrl}?start=0&end=6`);
                    if(!cleanupFunction){
                        groupId(idInUrl)
                        localStorage.setItem('idGroup', idInUrl);
                        if(res.data.group.ownTheme.length>0){
                            setThemeGroup(res.data.group.ownTheme)
                            setSubThemeGroup(res.data.group.subTheme)
                        }else{
                            setThemeGroup(res.data.group.theme)
                            setSubThemeGroup(res.data.group.subTheme)
                        }
                        setNameGroup(res.data.group.name)
                        setSubThemeGroup(res.data.group.subTheme)
                        setDescriptionGroup(res.data.group.description)
                        setPhotoNameGroup(res.data.group.photoName)
                        setId(res.data.group.id)
                        setAdministratorGroup(res.data.group.owner)
                        setUsersInGroup(userGroup.data.accounts)
                        setTotalSizeUserInGroup(userGroup.data.totalSize)
                        const newFormatPhoto="data:image/jpg;base64," + res.data.group.photo;
                        setPhotoGroup(newFormatPhoto);
                        groupAccesses(res.data.accesses);
                        groupInfoRelation(res.data.info);  
                    }
            }catch{
                setErrorReq(true)
                setSpinner(false)
            }
             
        }
        information()
        
        

        return () => cleanupFunction = true;
        
    },[Service, groupAccesses, groupId, groupInfoRelation, currentIdLocation, idInUrl])

    useEffect(()=>{
        if(photoGroup.length>0){
            setSpinner(!spinner)
        }

    }, [photoGroup])

    function addGroups(){
        Service.postAddGroups(`/api/group-relation/join-group/${idInUrl}`)
            .then(res=>{
                if(res.status===200){
                    Service.getGroup(`/api/group/${idInUrl}/page-info`)
                        .then(res=>{
                            groupInfoRelation(res.data.info);
                        })
                    Service.getUserGroup(`/api/group-relation/get-group-accounts/${idInUrl}?start=0&end=6`)
                        .then(res=>{
                            setUsersInGroup(res.data.accounts)
                            setTotalSizeUserInGroup(res.data.totalSize)
                        })
                }
            }).catch(err=>{
                console.log("ошибка")
                const error=errorMessageForUser(err.response.data.code);
                console.log(error)
                setError(true);
                setErrorMessage(error)
                Service.getGroup(`/api/group/${idInUrl}/page-info`)
                        .then(res=>{
                            groupInfoRelation(res.data.info);
                        })
            })
    }

    function exitFromGroup(){
        Service.postAddGroups(`/api/group-relation/leave-group/${idInUrl}`)
            .then(res=>{
                if(res.status===200){
                    Service.getGroup(`/api/group/${idInUrl}/page-info`)
                        .then(res=>{
                            groupInfoRelation(res.data.info);
                        })
                    Service.getUserGroup(`/api/group-relation/get-group-accounts/${idInUrl}?start=0&end=6`)
                        .then(res=>{
                            setUsersInGroup(res.data.accounts)
                            setTotalSizeUserInGroup(res.data.totalSize)
                        })
                }
            }).catch(err=>{
                console.log("ошибка")
                const error=errorMessageForUser(err.response.data.code);
                console.log(error)
                setError(true);
                setErrorMessage(error)
                Service.getGroup(`/api/group/${idInUrl}/page-info`)
                        .then(res=>{
                            groupInfoRelation(res.data.info);
                        })
            })
    }

    function openAllUserGroup(){
        openModalAllParticipantsGroup()
    }

    

    let modalWindowAllParticipants=null;

    if(modalAllParticipantsGroup===true){
        modalWindowAllParticipants=<ModalWindowAllParticipantsGroup/>;
    }


    function goToModification(){
        push({
            pathname: '/modificationGroups'
        });
    }

    function goToPageAdminGroup(){
        push({
            pathname: `/${administratorGroup.id}`
        });
    }

    function closeModalErrorForActionsUser(){
        setErrorMessage('');
        setError(false)
    }

    let btnModificationGroup=null;
    let btnActionGroup=null;
    if(accesses.canModify){
        btnModificationGroup=<div className="group__information__data__modification__wrapper">
                                <button onClick={goToModification} className="group__information__data__modification__btn">Редактировать</button>
                            </div>
                            
    }

    if(infoRelation.groupRelationStatus==="NONE"){
        btnActionGroup=<button onClick={()=>addGroups()}>Вступить в группу</button>;
    }

    if(infoRelation.groupRelationStatus==="PARTICIPANT"){
        btnActionGroup=<button onClick={()=>exitFromGroup()}>Выйти из группы</button>;
    }

    let postsContent=<div className="group__information__posts_not-access">
                            <img src={eyeClose} alt="contentNotAccess"/>
                        </div>
    if(infoRelation.groupRelationStatus==="OWNER" || infoRelation.groupRelationStatus==="PARTICIPANT"){
        postsContent=<PostsList idForPosts={idInUrl} messageOnWallType={"GROUP"}/>
    }

    let blockActionsBtn=<div className="group__photo-and-btns__btns_actions">
                            {btnActionGroup}
                        </div>

    if(btnActionGroup===null){
        blockActionsBtn=null;
    }

    let countMessage=null;

    if(inputMessageCount.length>0){
        countMessage=inputMessageCount.length
    }

    let theme=null;
    let subTheme=null;
    let description=null;

    if(themeGroup!==undefined && themeGroup.length>0 ){
        theme=<div className="group__information__data__content"><div className="group__information__data__content_title">Тема:</div> <span className="group__information__data__content_content">{themeGroup}</span></div>
    }

    if(subThemeGroup!==undefined && subThemeGroup.length>0){
        subTheme=<div className="group__information__data__content"><div className="group__information__data__content_title">Субтема:</div> <span className="group__information__data__content_content">{subThemeGroup}</span></div>
    }

    if(descriptionGroup!==undefined && descriptionGroup.length>0){
        description=<div className="group__information__data__content"><div className="group__information__data__content_title">Описание:</div> <span className="group__information__data__content_content">{descriptionGroup}</span></div>
    }

    let modalWindowErrorActionsUserGroup=null;

    function inBlockErrorMessageFalse(){
        setInBlockErrorMessage(false)
    }

    function inBlockErrorMessageTrue(){
        setInBlockErrorMessage(true)
    }

    function closeModalWindowErrorMessage(){
        if(!inBlockErrorMessage){
            closeModalErrorForActionsUser()
        }
    }

    if(error){
        setTimeout(closeModalErrorForActionsUser, 2000)
    }
    

    if(errorMessage.length>0){
        modalWindowErrorActionsUserGroup=<div className="group__overlay" onClick={closeModalWindowErrorMessage}>
                                                <div className="group__modal" onMouseLeave={inBlockErrorMessageFalse} onMouseEnter={inBlockErrorMessageTrue}>
                                                    <div className="group__modal_cancel">
                                                        <img src={cancel} alt="cancel" onClick={closeModalErrorForActionsUser}/>
                                                    </div>
                                                    <div className="group__modal_message">
                                                        {errorMessage}
                                                    </div>
                                                </div>
                                            </div>;
    }

    

    let groupContent= <>
                            <div className="group__photo-and-btns">
                               <div className="group__photo-and-btns__wrapper">
                                <div className="group__photo-and-btns__photo">
                                        <div className="group__photo-and-btns__photo__wrapper">
                                            <img className="group__photo-and-btns__photo__photo-group" src={photoGroup}  alt="photoGroup"/>
                                        </div>
                                    </div>
                                    <div className="group__photo-and-btns__btns">
                                        <div className="group__photo-and-btns__btns__navigation">
                                            <button className="group__photo-and-btns__btns__navigation__main-btn">Навигация</button>
                                            <div className="group__photo-and-btns__btns__navigation__menu">
                                                    <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                        <Link to={idUserForUrl}>
                                                            <img className="group__photo-and-btns__btns__navigation__item" src={home} alt="Домой"/>
                                                        </Link>
                                                        <Link to={idUserForUrl}>
                                                            <span className="group__photo-and-btns__btns__navigation__item__label">Домой</span>
                                                        </Link>
                                                    </div>
                                                    <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                        <Link to="/friends">
                                                            <img className="group__photo-and-btns__btns__navigation__item" src={friends} alt="Друзья"/>
                                                        </Link>
                                                        <Link to="/friends">
                                                            <span className="group__photo-and-btns__btns__navigation__item__label">Друзья</span>
                                                        </Link>
                                                    </div>
                                                    <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                        <Link to="/dialogs">
                                                            <img className="group__photo-and-btns__btns__navigation__item" src={messages} alt="Письма"/>
                                                        </Link> 
                                                        <span className="group__photo-and-btns__btns__navigation__item__count">
                                                            {countMessage}
                                                        </span>
                                                        <Link to="/dialogs">
                                                            <span className="group__photo-and-btns__btns__navigation__item__label">Письма 
                                                                <span className="group__photo-and-btns__btns__navigation__item__label__count">
                                                                    {countMessage}
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    </div>
                                                    <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                        <Link to="/groups">
                                                            <img className="group__photo-and-btns__btns__navigation__item" src={group} alt="Группы"/>
                                                        </Link>
                                                        <Link to="/groups">
                                                            <span className="group__photo-and-btns__btns__navigation__item__label">Группы</span>
                                                        </Link>
                                                    </div>
                                            </div>
                                        </div>
                                        {blockActionsBtn}
                                    </div>
                               </div>
                            </div>
                            <div className="group__information">
                                <div className="group__information__data">
                                    {btnModificationGroup}
                                    <div className="group__information__data__content__wrapper">
                                        <div className="group__information__data__content"><span className="group__information__data__content_name">{nameGroup}</span></div>
                                        {theme}
                                        {subTheme}
                                        {description}
                                        <div className="group__information__data__content"><div className="group__information__data__content_title">Администратор группы:</div> <span onClick={goToPageAdminGroup} className="group__information__data__content_content">{administratorGroup.firstName} {administratorGroup.lastName}</span></div>
                                    </div>
                                </div>
                                <div className="group__information__participants">
                                    <div className="group__information__participants__count-and-btn">
                                        <div className="group__information__participants__count-and-btn_count"><div>Участники группы:</div> <span>{totalSizeUserInGroup}</span></div>
                                        <button className="group__information__participants__count-and-btn_btn" onClick={openAllUserGroup}>Показать всех</button>
                                        {modalWindowAllParticipants}
                                    </div>
                                    <ul className="group__information__participants__list_mini">
                                        {
                                            userInGroup.map(el=>{
                                                const imgUser="data:image/jpg;base64," + el.account.photo;
                                                const linkToPageUserGroup=`/${el.account.id}`
                                                return <li key={el.account.id} className="group__information__participants__list__item">
                                                                <Link to={linkToPageUserGroup}>
                                                                    <img src={imgUser} alt="imgUser"/>
                                                                    <span>{el.account.firstName} {el.account.lastName}</span>
                                                                </Link>
                                                        </li>
                                                        
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="group__information__posts">
                                    {postsContent}
                                </div>
                            </div>
                            {modalWindowErrorActionsUserGroup}
                        </>

        if(errorReq){
            groupContent=<div>Что-то пошло не так, контент не доступен!</div>
        }

        const content=spinner? <Spinner/>: groupContent;

        return(
            <div>
                <div className="group">
                    {content}
                </div>

            </div>
        )
    }

const mapStateToProps = (state) => {
    return {
        idGroup: state.groupId,
        accesses: state.groupAccesses,
        infoRelation: state.groupInfoRelation,
        modalAllParticipantsGroup :state.openModalAllParticipantsGroup,
        idUser: state.userId,
        inputMessageCount: state.inputMessageObj,
    }
}

const mapDispatchToProps = {
    groupId,
    groupAccesses, 
    groupInfoRelation,
    currentIdLocation,
    openModalAllParticipantsGroup
}


export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Group)))