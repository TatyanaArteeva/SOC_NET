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
    const [spinner, setSpinner]=useState(true)
    const { push } = useHistory();
    const idUserForUrl=`/${idUser}`;
    
    useEffect(()=>{
        let cleanupFunction = false;
            currentIdLocation(idInUrl)
            const information=async () =>{
            try{
                const res=await Service.getGroup(`/api/group/${idInUrl}/page-info`);
                console.log(res)
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
            }catch(e){
                console.log(e)
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

    let postsContent=<div className="group__information__posts_not-access">Контент не доступен</div>
    console.log(infoRelation)
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
        theme=<div className="group__information__data__content">Тема: <span>{themeGroup}</span></div>
    }

    if(subThemeGroup!==undefined && subThemeGroup.length>0){
        subTheme=<div className="group__information__data__content">Субтема: <span>{subThemeGroup}</span></div>
    }

    if(descriptionGroup!==undefined && descriptionGroup.length>0){
        description=<div className="group__information__data__content_description"><div>Описание:</div> <span>{descriptionGroup}</span></div>
    }


    const groupContent= <>
                            <div className="group__photo-and-btns">
                               <div className="group__photo-and-btns__wrapper">
                                <div className="group__photo-and-btns__photo">
                                        <div className="group__photo-and-btns__photo__wrapper">
                                            <img className="group__photo-and-btns__photo__photo-group" src={photoGroup}  alt="photoGroup"/>
                                        </div>
                                    </div>
                                    <div className="group__photo-and-btns__btns">
                                        {blockActionsBtn}
                                        <div className="group__photo-and-btns__btns__navigation">
                                            <div >
                                                <button className="group__photo-and-btns__btns__navigation__main-btn">Навигация</button>
                                            </div>
                                        <div className="group__photo-and-btns__btns__navigation__menu">
                                                <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                    <img className="group__photo-and-btns__btns__navigation__item" src={home} alt="Домой"/>
                                                    <Link to={idUserForUrl}>
                                                        <span className="group__photo-and-btns__btns__navigation__item__label">Домой</span>
                                                    </Link>
                                                </div>
                                                <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                    <img className="group__photo-and-btns__btns__navigation__item" src={friends} alt="Друзья"/>
                                                    <Link to="/friends">
                                                        <span className="group__photo-and-btns__btns__navigation__item__label">Друзья</span>
                                                    </Link>
                                                </div>
                                                <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                    <img className="group__photo-and-btns__btns__navigation__item" src={messages} alt="Письма"/> 
                                                    <span className="group__photo-and-btns__btns__navigation__item__count">
                                                        {countMessage}
                                                    </span>
                                                    <Link to="/messages">
                                                        <span className="group__photo-and-btns__btns__navigation__item__label">Письма 
                                                            <span className="group__photo-and-btns__btns__navigation__item__label__count">
                                                                {countMessage}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="group__photo-and-btns__btns__navigation__wrapper">
                                                    <img className="group__photo-and-btns__btns__navigation__item" src={group} alt="Группы"/>
                                                    <Link to="/groups">
                                                        <span className="group__photo-and-btns__btns__navigation__item__label">Группы</span>
                                                    </Link>
                                                </div>
                                        </div>
                                        </div>
                                    </div>
                               </div>
                            </div>
                            <div className="group__information">
                                <div className="group__information__data">
                                    {btnModificationGroup}
                                    <div className="group__information__data__content__wrapper">
                                        <div className="group__information__data__content">Название группы: <span>{nameGroup}</span></div>
                                        {theme}
                                        {subTheme}
                                        {description}
                                        <div className="group__information__data__content_admin">Администратор группы: <span onClick={goToPageAdminGroup}>{administratorGroup.firstName} {administratorGroup.lastName}</span></div>
                                    </div>
                                </div>
                                <div className="group__information__participants">
                                    <div className="group__information__participants__count-and-btn">
                                        <div className="group__information__participants__count-and-btn_count">Участники группы: <span>{totalSizeUserInGroup}</span></div>
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
                        </>

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