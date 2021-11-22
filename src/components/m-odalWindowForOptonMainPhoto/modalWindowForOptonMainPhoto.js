import React, { Component } from 'react';
import './modalWindowForOptonMainPhoto.scss';
import { connect } from 'react-redux';
import {
    modalWindowForMainPhotoOptionsClose,
    photoUser,
    rights,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import WithService from '../hoc/hoc';
import cancel from './cancel.svg';
import download from './download.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';

class ModalWindowForOptonMainPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueNewPhoto: "",
            nameNewPhoto: "",
            modalWindowForMainPhotoModification: false,
            modalWindowQuestonRemovePhoto: false,
            userNotificationForModificationPhoto: false,
            modalWindowForMainPhotoRemove: false,
            messageInvalidFile: false,
            errorActionsSavePhoto: false,
            errorActionsMessageSavePhoto: ''
        }

        const {
            Service,
            modalWindowForMainPhotoOptionsClose,
            id,
            rights,
            checkingForAuthorization,
            unsubscribe,
            photoUser } = this.props;

        this.getPhoto = () => {
            let res = null;
            Service.getAccountPhoto(`/api/account/${id}/photo`, { responseType: 'arraybuffer' })
                .then(response => res = Buffer.from(response.data, 'binary').toString('base64'))
                .catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
            const newFormatPhoto = "data:image/jpg;base64," + res;
            photoUser(newFormatPhoto);
            this.userNotificationForPhotoOpen();
            if (this.state.userNotificationForModificationPhoto) {
                setTimeout(this.modalWindowForModificationPhotoClose, 1000);
            }
        }

        this.closeErrorSaveNewPhoto = () => {
            this.setState({
                errorActionsSavePhoto: false,
                errorActionsMessageSavePhoto: ''
            })
        }

        this.postNewPhotoProfile = (event) => {
            event.preventDefault();
            const formData = new FormData();
            formData.append("photo", this.state.valueNewPhoto)
            Service.postNewPhotoProfile(`/api/account/${id}/change-photo`, formData)
                .then(res => {
                    if (res.status === 200) {
                        rights(res.data.accesses)
                        this.getPhoto()
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        this.setState({
                            errorActionsSavePhoto: true,
                            errorActionsMessageSavePhoto: error
                        })
                        setTimeout(this.closeErrorSaveNewPhoto, 2000)
                    }
                })
        }

        this.confirmationRemovePhoto = (event) => {
            event.preventDefault();
            Service.postRemovePhotoProfile(`/api/account/${id}/change-photo`, null)
                .then(res => {
                    if (res.status === 200) {
                        rights(res.data.accesses);
                        this.getPhoto()
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.valueNameAndContentPhoto = (event) => {
            const files = event.target.value.split(".").pop().toLowerCase();
            if (event.target.value.length > 0) {
                if (files === "jpg" || files === "jpeg" || files === "png") {
                    const valueNamePhoto = event.target.value.split("\\");
                    this.setState({
                        valueNewPhoto: event.target.files[0],
                        nameNewPhoto: valueNamePhoto[valueNamePhoto.length - 1]
                    })
                } else {
                    this.setState({
                        nameNewPhoto: "",
                        valueNewPhoto: null,
                        messageInvalidFile: true
                    }, () => {
                        event.target.value = ""
                    })
                    setTimeout(this.modalWindowInvalidFilesClose, 2000)
                }
            }
        }

        this.modalWindowForQuestonRemovePhotoClose = () => {
            this.setState({
                modalWindowQuestonRemovePhoto: false
            })
        }

        this.modalWindowForQuestonRemovePhotoOpen = () => {
            this.setState({
                modalWindowQuestonRemovePhoto: true
            })
        }

        this.userNotificationForPhotoOpen = () => {
            this.setState({
                userNotificationForModificationPhoto: true
            })
        }

        this.userNotificationForPhotoClose = () => {
            this.setState({
                userNotificationForModificationPhoto: false
            })
        }

        this.userNotificationForPhotoRemoveOpen = () => {
            this.setState({
                modalWindowForMainPhotoRemove: true
            })
        }

        this.userNotificationForPhotoRemoveClose = () => {
            this.setState({
                modalWindowForMainPhotoRemove: false
            })
        }

        this.cancelChoiceNewPhoto = () => {
            this.setState({
                nameNewPhoto: "",
                valueNewPhoto: null
            })
        }

        this.modalWindowForOptonsMainPhotoClose = () => {
            modalWindowForMainPhotoOptionsClose()
        }

        this.modalWindowModificationMainPhoto = () => {
            this.setState({
                modalWindowForMainPhotoModification: true
            })
        }

        this.modalWindowForModificationMainPhotoClose = () => {
            this.setState({
                modalWindowForMainPhotoModification: false
            })
        }

        this.modalWindowInvalidFilesClose = () => {
            this.setState({
                messageInvalidFile: false
            })
        }

        this.modalWindowForModificationPhotoClose = () => {
            this.userNotificationForPhotoClose();
            this.modalWindowForModificationMainPhotoClose();
            this.cancelChoiceNewPhoto()
            this.userNotificationForPhotoRemoveClose();
            this.modalWindowForOptonsMainPhotoClose();
        }
    }

    render() {

        let errorSaveNewPhoto = null;

        if (this.state.errorActionsSavePhoto) {
            errorSaveNewPhoto = <div className="modal-window-for-opton-main-photo__invalid-file">
                <div className="modal-window-for-opton-main-photo__invalid-file_text">
                    {this.state.errorActionsMessageSavePhoto}
                </div>
            </div>
        }

        const invalidFile = <div className="modal-window-for-opton-main-photo__invalid-file">
            <div className="modal-window-for-opton-main-photo__invalid-file_text">
                Не верный формат! Разрешены: .jpg, .jpeg, .png
            </div>
        </div>

        let ModalWindowMessageInvalidFile = this.state.messageInvalidFile ? invalidFile : null;

        const modalWindowNotificationForRemovePhoto = <div className="modal-window-for-opton-main-photo">
            <div className="modal-window-for-opton-main-photo__cancel">
                <img src={cancel}
                    alt="cancel"
                    onClick={() => this.modalWindowForModificationPhotoClose()}
                />
            </div>
            <div className="modal-window-for-opton-main-photo__text_final">
                Фото успешно удалено!
            </div>
        </div>

        if (this.state.modalWindowForMainPhotoRemove) {
            return modalWindowNotificationForRemovePhoto
        }

        const modalWindowNotificationForModificationPhoto = <div className="modal-window-for-opton-main-photo">
            <div className="modal-window-for-opton-main-photo__cancel">
                <img src={cancel}
                    alt="cancel"
                    onClick={() => this.modalWindowForModificationPhotoClose()}
                />
            </div>
            <div className="modal-window-for-opton-main-photo__text_final">
                Фото успешно изменено!
            </div>
        </div>

        if (this.state.userNotificationForModificationPhoto) {
            return modalWindowNotificationForModificationPhoto
        }

        const blockSaveNewPhoto = <div className="modal-window-for-opton-main-photo">
            <div className="modal-window-for-opton-main-photo__text">
                Вы выбрали новое фото: {this.state.nameNewPhoto}
            </div>
            <div className="modal-window-for-opton-main-photo__wrapper__btn">
                <button onClick={this.postNewPhotoProfile}
                    className="modal-window-for-opton-main-photo__btn">
                    Сохранить
                </button>
                <button onClick={this.cancelChoiceNewPhoto}
                    className="modal-window-for-opton-main-photo__btn">
                    Отменить
                </button>
            </div>
            {errorSaveNewPhoto}
        </div>

        if (this.state.nameNewPhoto !== undefined &&
            this.state.nameNewPhoto !== null && this.state.nameNewPhoto.length > 0) {
            return blockSaveNewPhoto
        }

        const modalModification = <div className="modal-window-for-opton-main-photo">
            <div onClick={this.modalWindowForModificationMainPhotoClose}
                className="modal-window-for-opton-main-photo__cancel">
                <img src={cancel}
                    alt="cancel"
                    onClick={this.modalWindowForModificationMainPhotoClose}
                />
            </div>
            <div className="modal-window-for-opton-main-photo__text_final">
                Выберите новое фото!
            </div>
            <div className="modal-window-for-opton-main-photo__wrapper__input-file">
                <form>
                    <input name="photo"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={this.valueNameAndContentPhoto}
                        id="inputFile"
                        className="modal-window-for-opton-main-photo__input-file__input"
                    />
                    <label htmlFor="inputFile"
                        className="modal-window-for-opton-main-photo__wrapper__input-file__label">
                        <span className="modal-window-for-opton-main-photo__wrapper__input-file__label_img">
                            <img src={download} alt="inputFile" />
                        </span>
                        <div className="modal-window-for-opton-main-photo__wrapper__input-file__label_border"></div>
                        <span className="modal-window-for-opton-main-photo__wrapper__input-file__label_name">
                            Выберите файл
                        </span>
                    </label>
                </form>
            </div>
            {ModalWindowMessageInvalidFile}
        </div>

        const modalQuestonRemovePhoto = <div className="modal-window-for-opton-main-photo">
            <div className="modal-window-for-opton-main-photo__text">
                Вы уверены, что хотите удалить фото?
            </div>
            <div className="modal-window-for-opton-main-photo__wrapper__btn">
                <button onClick={this.confirmationRemovePhoto}
                    className="modal-window-for-opton-main-photo__btn">
                    Удалить фото
                </button>
                <button onClick={this.modalWindowForQuestonRemovePhotoClose}
                    className="modal-window-for-opton-main-photo__btn">
                    Отмена
                </button>
            </div>
        </div>

        const removePhoto = <button onClick={this.modalWindowForQuestonRemovePhotoOpen}
            className="modal-window-for-opton-main-photo__btn">
            Удалить фото
        </button>

        if (this.state.modalWindowForMainPhotoModification) {
            return modalModification
        }

        if (this.state.modalWindowQuestonRemovePhoto) {
            return modalQuestonRemovePhoto
        }

        const removePhotoBtn = this.props.listRights.canRemovePhoto ? removePhoto : null;
        return (
            <div className="modal-window-for-opton-main-photo">
                <div className="modal-window-for-opton-main-photo__cancel">
                    <img src={cancel}
                        alt="cancel"
                        onClick={this.modalWindowForOptonsMainPhotoClose}
                    />
                </div>
                <div className="modal-window-for-opton-main-photo__text">
                    Действия:
                </div>
                <div className="modal-window-for-opton-main-photo__wrapper__btn">
                    <button onClick={this.modalWindowModificationMainPhoto}
                        className="modal-window-for-opton-main-photo__btn">
                        Обновить фото
                    </button>
                    {removePhotoBtn}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listRights: state.listRights,
        id: state.userId
    }
}

const mapDispatchToProps = {
    modalWindowForMainPhotoOptionsClose,
    photoUser,
    rights,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(ModalWindowForOptonMainPhoto))