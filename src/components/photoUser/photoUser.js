import React, { Component } from 'react';
import './photoUser.scss';
import { connect } from 'react-redux';
import {
    modalWindowForMainPhotoOptionsOpen,
    photoUser,
    infoRelation,
    idForDialogFriends,
    loadingPhotoProfile,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import ModalWindowForOptonMainPhoto from '../modalWindowForOptonMainPhoto/modalWindowForOptonMainPhoto';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import cancel from './cancel.svg';

class PhotoUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorActionsWithFriends: false,
            errorMessageWithActionsFriends: '',
            inBlockMessageError: false
        }

        const {
            Service,
            loadingPhotoProfile,
            idForPhoto,
            match,
            photoUser,
            checkingForAuthorization,
            unsubscribe,
            infoRelation,
            idForDialogFriends,
            history,
            modalWindowForMainPhotoOptionsOpen } = this.props;

        let photo = null;

        this.componentDidMount = () => {
            loadingPhotoProfile(false)
            this.getPhoto()
        }

        this.componentDidUpdate = (prevProps) => {
            if (prevProps.idForPhoto !== idForPhoto || match.params.id) {
                Service.getAccountPhoto(`/api/account/${idForPhoto}/photo`, {
                    responseType: 'arraybuffer'
                })
                    .then(response => {
                        photo = Buffer.from(response.data, 'binary').toString('base64');
                        const newFormatPhoto = "data:image/jpg;base64," + photo;
                        photoUser(newFormatPhoto)
                    }).catch(err => {
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
        }

        this.getPhoto = () => {
            Service.getAccountPhoto(`/api/account/${idForPhoto}/photo`, {
                responseType: 'arraybuffer'
            })
                .then(response => {
                    photo = Buffer.from(response.data, 'binary').toString('base64');
                    const newFormatPhoto = "data:image/jpg;base64," + photo;
                    photoUser(newFormatPhoto);
                    loadingPhotoProfile(true)
                }).catch(err => {
                    loadingPhotoProfile(true)
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.actionsUserAndPageInfo = (path) => {
            Service.postActionsFriends(path)
                .then(res => {
                    if (res.status === 200) {
                        Service.getAccountInfo(`/api/account/${idForPhoto}/page-info`)
                            .then(res => {
                                if (res.status === 200) {
                                    infoRelation(res.data.info);
                                }
                            })
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        this.setState({
                            errorActionsWithFriends: true,
                            errorMessageWithActionsFriends: error
                        })
                        Service.getAccountInfo(`/api/account/${idForPhoto}/page-info`)
                            .then(res => {
                                if (res.status === 200) {
                                    infoRelation(res.data.info);
                                }
                            })
                    }
                })
        }

        this.addFriends = () => {
            this.actionsUserAndPageInfo(`/api/friend/addFriend/${idForPhoto}`)
        }

        this.cancelAddFriends = () => {
            this.actionsUserAndPageInfo(`/api/friend/removeFriend/${idForPhoto}`)
        }

        this.deleteFriends = () => {
            this.actionsUserAndPageInfo(`/api/friend/removeFriend/${idForPhoto}`)
        }

        this.rejectFriends = () => {
            this.actionsUserAndPageInfo(`/api/friend/rejectFriend/${idForPhoto}`)
        }

        this.writeMessage = () => {
            localStorage.setItem('idForDialogFriends', idForPhoto);
            idForDialogFriends(idForPhoto);
            history.push('/dialog')
        }

        this.inBlockMessageEnterTrue = () => {
            this.setState({
                inBlockMessageError: true
            })
        }

        this.inBlockMessageEnterFalse = () => {
            this.setState({
                inBlockMessageError: false
            })
        }

        this.closeModalWindowErrorActionsFriend = () => {
            if (!this.state.inBlockMessageError) {
                this.closeModalWindowErrorActionsFriend()
            }
        }

        this.changePhoto = () => {
            modalWindowForMainPhotoOptionsOpen();
        }

        this.closeModalWindowErrorMessageWithActionsFriends = () => {
            this.setState({
                errorActionsWithFriends: false,
                errorMessageWithActionsFriends: ''
            })
        }

    }

    render() {

        const {
            idUser,
            modalWindowForMainPhotoOptions,
            listRights,
            info,
            inputMessageCount,
            photo } = this.props;

        const { errorMessageWithActionsFriends } = this.state;

        const id = `/${idUser}`;
        let btnActionsElementsPage = null;
        let modalWindowForMainPhotoModification = null;
        let btnActionRejectFriend = null;
        let btnActionWriteMessage = null;
        let countMessage = null;
        let modalWindowForError = null;
        const editingPhotoBtn = <button onClick={this.changePhoto}>Редактировать фото</button>;
        const btnAddFriends = <button onClick={this.addFriends}>Добавить в друзья</button>;
        const btnCancelAddFriends = <button onClick={this.cancelAddFriends}>Отменить заявку</button>;
        const btnConfirmAddFriends = <button onClick={this.addFriends}>Подтвердить друга</button>;
        const btnRejectFriend = <button onClick={this.rejectFriends}>Отклонить друга</button>;
        const btnDeleteFriends = <button onClick={this.deleteFriends}>Удалить из друзей</button>;
        const btnWriteMessage = <button onClick={this.writeMessage}>Написать сообщение</button>;

        if (errorMessageWithActionsFriends.length > 0) {
            setTimeout(this.closeModalWindowErrorMessageWithActionsFriends, 2000)
        }

        if (modalWindowForMainPhotoOptions) {
            modalWindowForMainPhotoModification = <ModalWindowForOptonMainPhoto />;
        }

        if (listRights.canModify) {
            btnActionsElementsPage = editingPhotoBtn;
        }

        if (info.friendRelationStatus === "NO_RELATION") {
            btnActionsElementsPage = btnAddFriends;
        }

        if (info.friendRelationStatus === "OUTPUT") {
            btnActionsElementsPage = btnCancelAddFriends;
        }

        if (info.friendRelationStatus === "INPUT") {
            btnActionsElementsPage = btnConfirmAddFriends;
            btnActionRejectFriend = btnRejectFriend
        }
        if (info.friendRelationStatus === "FULL") {
            btnActionWriteMessage = btnWriteMessage;
            btnActionsElementsPage = btnDeleteFriends;
        }

        if (inputMessageCount.length > 0) {
            countMessage = inputMessageCount.length
        }

        if (errorMessageWithActionsFriends.length > 0) {
            modalWindowForError = <div className="photo-and-main-btn__overlay"
                onClick={this.closeModalWindowErrorActionsFriend}>
                <div className="photo-and-main-btn__modal"
                    onMouseEnter={() => this.inBlockMessageEnterTrue()}
                    onMouseLeave={() => this.inBlockMessageEnterFalse()}>
                    <div className="photo-and-main-btn__modal_close">
                        <img src={cancel}
                            alt="cancel"
                            onClick={() => this.closeModalWindowErrorMessageWithActionsFriends()}
                        />
                    </div>
                    <div className="photo-and-main-btn__modal_message">
                        {errorMessageWithActionsFriends}
                    </div>
                </div>
            </div>
        }

        return (
            <div className="photo-and-main-btn">
                <div className="photo-and-main-btn__photo">
                    <div className="photo-and-main-btn__photo__wrapper">
                        <img className="photo-and-main-btn__photo__photo-user"
                            src={photo}
                            alt="photoUser"
                        />
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
                        <button className="photo-and-main-btn__btns__navigation__main-btn">
                            Навигация
                        </button>
                        <div className="photo-and-main-btn__btns__navigation__menu">
                            <div className="photo-and-main-btn__btns__navigation__wrapper">
                                <Link to={id}>
                                    <img className="photo-and-main-btn__btns__navigation__item"
                                        src={home}
                                        alt="Домой"
                                    />
                                </Link>
                                <Link to={id}>
                                    <span className="photo-and-main-btn__btns__navigation__item__label">
                                        Домой
                                    </span>
                                </Link>
                            </div>
                            <div className="photo-and-main-btn__btns__navigation__wrapper">
                                <Link to="/friends/">
                                    <img className="photo-and-main-btn__btns__navigation__item"
                                        src={friends}
                                        alt="Друзья"
                                    />
                                </Link>
                                <Link to="/friends/">
                                    <span className="photo-and-main-btn__btns__navigation__item__label">
                                        Друзья
                                    </span>
                                </Link>
                            </div>
                            <div className="photo-and-main-btn__btns__navigation__wrapper">
                                <Link to="/dialogs">
                                    <img className="photo-and-main-btn__btns__navigation__item"
                                        src={messages}
                                        alt="Письма"
                                    />
                                </Link>
                                <span className="photo-and-main-btn__btns__navigation__item__count">
                                    {countMessage}
                                </span>
                                <Link to="/dialogs">
                                    <span className="photo-and-main-btn__btns__navigation__item__label">
                                        Письма
                                        <span className="photo-and-main-btn__btns__navigation__item__label__count">
                                            {countMessage}
                                        </span>
                                    </span>
                                </Link>
                            </div>
                            <div className="photo-and-main-btn__btns__navigation__wrapper">
                                <Link to="/groups/">
                                    <img className="photo-and-main-btn__btns__navigation__item"
                                        src={group}
                                        alt="Группы"
                                    />
                                </Link>
                                <Link to="/groups/">
                                    <span className="photo-and-main-btn__btns__navigation__item__label">
                                        Группы
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {modalWindowForError}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modalWindowForMainPhotoOptions: state.modalWindowForMainPhotoOptions,
        listRights: state.listRights,
        photo: state.photoUser,
        info: state.infoRelation,
        idUser: state.userId,
        inputMessageCount: state.inputMessageObj
    }
}

const mapDispatchToProps = {
    modalWindowForMainPhotoOptionsOpen,
    photoUser,
    infoRelation,
    idForDialogFriends,
    loadingPhotoProfile,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PhotoUser)))