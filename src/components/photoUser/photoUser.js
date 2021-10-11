
import React, {Component} from 'react';
import './photoUser.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsOpen, photoUser, infoRelation, idForDialogFriends, loadingPhotoProfile} from '../../actions';
import ModalWindowForOptonMainPhoto from '../ModalWindowForOptonMainPhoto/ModalWindowForOptonMainPhoto';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import {  Link } from 'react-router-dom';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';

class PhotoUser extends Component{

    constructor(props){
        super(props);
        this.changePhoto=()=>{
            this.props.modalWindowForMainPhotoOptionsOpen();
        }

        const {Service}=this.props;

        let photo=null;


        this.inf=()=>{
            Service.getAccountPhoto(`/api/account/${this.props.idForPhoto}/photo`, {
                responseType: 'arraybuffer'
                })
                .then(response => {
                    photo=Buffer.from(response.data, 'binary').toString('base64');
                    const newFormatPhoto="data:image/jpg;base64," + photo;
                    this.props.photoUser(newFormatPhoto);
                    this.props.loadingPhotoProfile(true)
                });
                
        }

        this.componentDidMount=()=>{
            this.props.loadingPhotoProfile(false)
            this.inf()
        }

        this.componentDidUpdate=(prevProps)=>{
            if(prevProps.idForPhoto!==this.props.idForPhoto || "#" + this.props.match.params.id){
                Service.getAccountPhoto(`/api/account/${this.props.idForPhoto}/photo`, {
                    responseType: 'arraybuffer'
                    })
                    .then(response => {
                        photo=Buffer.from(response.data, 'binary').toString('base64');
                        const newFormatPhoto="data:image/jpg;base64," + photo;
                        this.props.photoUser(newFormatPhoto)
                    });
            }
            
        }

        this.addFriends=()=>{
            console.log("add")
            Service.postAddFriend(`/api/friend/addFriend/${this.props.idForPhoto}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                            .then(res=>{
                                if(res.status===200){
                                    this.props.infoRelation(res.data.info);
                                    console.log(this.props.info)
                                }
                            })
                    }
                })
        }

        this.cancelAddFriends=()=>{
            console.log("cancel")
            Service.postCancelAddFriend(`/api/friend/removeFriend/${this.props.idForPhoto}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                            .then(res=>{
                                if(res.status===200){
                                    this.props.infoRelation(res.data.info);
                                    console.log(this.props.info)
                                }
                            })
                    }
                })
        }

        this.deleteFriends=()=>{
            console.log("delete")

            Service.postDeleteFriend(`/api/friend/removeFriend/${this.props.idForPhoto}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                        .then(res=>{
                            if(res.status===200){
                                this.props.infoRelation(res.data.info);
                                console.log(this.props.info)
                            }
                        })
                }
            })
        }

        this.rejectFriends=()=>{
            Service.postDeleteFriend(`/api/friend/rejectFriend/${this.props.idForPhoto}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                        .then(res=>{
                            if(res.status===200){
                                this.props.infoRelation(res.data.info);
                                console.log(this.props.info)
                            }
                        })
                }
            })
        }

        this.writeMessage=()=>{
            localStorage.setItem('idForDialogFriends', this.props.idForPhoto);
            this.props.idForDialogFriends(this.props.idForPhoto);
            this.props.history.push('/dialog')
        }

    }

    render(){

        const {idUser}=this.props;
        const id=`/${idUser}`;

        let btnActionsElementsPage=null;
        let modalWindowForMainPhotoModification=null;
        let btnActionRejectFriend=null;
        let btnActionWriteMessage=null;
        if(this.props.modalWindowForMainPhotoOptions){
            modalWindowForMainPhotoModification=<ModalWindowForOptonMainPhoto/>;
        }
        const editingPhotoBtn=<button onClick={this.changePhoto}>Редактировать фото</button>;
        const btnAddFriends=<button onClick={this.addFriends}>Добавить в друзья</button>;
        const btnCancelAddFriends=<button onClick={this.cancelAddFriends}>Отменить заявку</button>;
        const btnConfirmAddFriends=<button onClick={this.addFriends}>Подтвердить друга</button>;
        const btnRejectFriend=<button onClick={this.rejectFriends}>Отклонить друга</button>;
        const btnDeleteFriends= <button onClick={this.deleteFriends}>Удалить из друзей</button>;
        const btnWriteMessage= <button onClick={this.writeMessage}>Написать сообщение</button>;
        if(this.props.listRights.canModify){
            btnActionsElementsPage=editingPhotoBtn;
        }

        if(this.props.info.friendRelationStatus==="NO_RELATION"){
            btnActionsElementsPage=btnAddFriends;
        }

        if(this.props.info.friendRelationStatus==="OUTPUT"){
            btnActionsElementsPage=btnCancelAddFriends;
        }

        if(this.props.info.friendRelationStatus==="INPUT"){
            btnActionsElementsPage=btnConfirmAddFriends;
            btnActionRejectFriend=btnRejectFriend
        }
        if(this.props.info.friendRelationStatus==="FULL"){
            btnActionWriteMessage=btnWriteMessage;
            btnActionsElementsPage=btnDeleteFriends;
        }

        let countMessage=null;

        if(this.props.inputMessageCount.length>0){
            countMessage=this.props.inputMessageCount.length
        }
        
        return(
            <div className="photo-and-main-btn">
                <div className="photo-and-main-btn__photo">
                    <div className="photo-and-main-btn__photo__wrapper">
                        <img className="photo-and-main-btn__photo__photo-user" src={this.props.photo}  alt="photoUser"/>
                        {modalWindowForMainPhotoModification}
                    </div>
                </div>
                <div className="photo-and-main-btn__btns">
                    <div className="photo-and-main-btn__btns_actions">
                        {btnActionWriteMessage}
                        {btnActionRejectFriend}
                        {btnActionsElementsPage}
                    </div>
                    <div className="photo-and-main-btn__btns__navigation">
                        <div >
                            <button className="photo-and-main-btn__btns__navigation__main-btn">Навигация</button>
                        </div>
                        <div className="photo-and-main-btn__btns__navigation__menu">
                                <div className="photo-and-main-btn__btns__navigation__wrapper">
                                        <img className="photo-and-main-btn__btns__navigation__item" src={home} alt="Домой"/>
                                    <Link to={id}>
                                        <span className="photo-and-main-btn__btns__navigation__item__label">Домой</span>
                                    </Link>
                                </div>
                                <div className="photo-and-main-btn__btns__navigation__wrapper">
                                        <img className="photo-and-main-btn__btns__navigation__item" src={friends} alt="Друзья"/>
                                    <Link to="/friends/">
                                        <span className="photo-and-main-btn__btns__navigation__item__label">Друзья</span>
                                    </Link>
                                </div>
                                <div className="photo-and-main-btn__btns__navigation__wrapper">
                                        <img className="photo-and-main-btn__btns__navigation__item" src={messages} alt="Письма"/> 
                                        <span className="photo-and-main-btn__btns__navigation__item__count">
                                            {countMessage}
                                        </span>
                                    <Link to="/messages">
                                        <span className="photo-and-main-btn__btns__navigation__item__label">Письма 
                                            <span className="photo-and-main-btn__btns__navigation__item__label__count">
                                                {countMessage}
                                            </span>
                                        </span>
                                    </Link>
                                </div>
                                <div className="photo-and-main-btn__btns__navigation__wrapper">
                                        <img className="photo-and-main-btn__btns__navigation__item" src={group} alt="Группы"/>
                                    <Link to="/groups/">
                                        <span className="photo-and-main-btn__btns__navigation__item__label">Группы</span>
                                    </Link>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

   
    
}

const mapStateToProps=(state)=>{
    return{
        modalWindowForMainPhotoOptions:state.modalWindowForMainPhotoOptions,
        listRights: state.listRights,
        photo: state.photoUser,
        info: state.infoRelation,
        idUser: state.userId,
        inputMessageCount: state.inputMessageObj,
    }
}

const mapDispatchToProps={
    modalWindowForMainPhotoOptionsOpen,
    photoUser,
    infoRelation,
    idForDialogFriends,
    loadingPhotoProfile
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PhotoUser)));