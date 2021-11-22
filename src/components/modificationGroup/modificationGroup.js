import React, { Component } from 'react';
import WithService from '../hoc/hoc';
import {
    groupId,
    modalWindowInvalidFilesOpen,
    modalWindowInvalidFilesClose,
    modalWindowForUserNotificationCreatingGroupOpen,
    modalWindowForUserNotificationCreatingGroupClose,
    popstate,
    actionTransitionModification,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PromptNav from '../promptNav/promptNav';
import Spinner from '../spinner/spinner';
import './modificationGroup.scss';
import deletee from './delete.svg';
import download from './download.svg';
import cancel from './cancel.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';

class ModificationGroup extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            theme: '',
            ownTheme: '',
            subTheme: '',
            description: '',
            photo: '',
            photoName: '',
            id: '',
            nav: true,
            spinner: true,
            listSelectTheme: false,
            errorLoadingContent: false,
            errorModification: false,
            adminFirstName: '',
            adminLastName: '',
            errorMessage: '',
            mouseInBlockModalWindow: false,
        }

        const {
            Service,
            checkingForAuthorization,
            unsubscribe,
            actionTransitionModification,
            groupId,
            modalWindowForUserNotificationCreatingGroupOpen,
            modalWindowForUserNotificationCreatingGroupClose,
            history,
            idGroup,
            modalWindowInvalidFilesClose,
            modalWindowInvalidFilesOpen,
            popstate
        } = this.props;

        const id = localStorage.getItem('idGroup')

        let blockingTimerCloseNotificationSuccessfulModificationGroup = false

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            const inf = async () => {
                const res = await Service.getGroup(`/api/group/${id}`);
                try {
                    if (this._cleanupFunction) {
                        this.setState({
                            name: res.data.name,
                            theme: res.data.theme,
                            ownTheme: res.data.ownTheme,
                            subTheme: res.data.subTheme,
                            description: res.data.description,
                            photoName: res.data.photoName,
                            id: res.data.id,
                            adminFirstName: res.data.owner.firstName,
                            adminLastName: res.data.owner.lastName,
                            nav: false,
                            spinner: false
                        })
                        window.addEventListener('popstate', () => this.goToBack());
                        function dataURItoBlob(dataURI) {
                            let byteString = atob(dataURI);
                            let mimeString = { type: "image/jpg" };
                            let arrBuffer = new ArrayBuffer(byteString.length);
                            let formatUnit8 = new Uint8Array(arrBuffer);
                            for (let i = 0; i < byteString.length; i++) {
                                formatUnit8[i] = byteString.charCodeAt(i);
                            }
                            let formatBlob = new Blob([arrBuffer], mimeString);
                            return formatBlob
                        }
                        const newImg = dataURItoBlob(res.data.photo);
                        const file = new File([newImg], this.state.photoName, { type: "image/jpeg" })
                        this.setState({
                            photo: file
                        })
                    }
                } catch (err) {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            errorLoadingContent: true
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                }
            }
            inf()
        }

        this.componentWillUnmount = () => {
            window.removeEventListener('popstate', () => this.goToBack())
            actionTransitionModification('')
            this._cleanupFunction = false;
        }

        this.modificationGroup = (event) => {
            event.preventDefault();
            this.setState({
                spinner: true
            })
            const formData = new FormData();
            if (this.state.photo.length === 0) {
                const obj = {
                    name: this.state.name,
                    theme: this.state.theme,
                    ownTheme: this.state.ownTheme,
                    subTheme: this.state.subTheme,
                    description: this.state.description,
                    photoName: this.state.photoName,
                    id: this.state.id,
                }
                for (let key in obj) {
                    formData.append(key, this.state[key])
                }
            } else {
                for (let key in this.state) {
                    formData.append(key, this.state[key])
                }
            }
            Service.postNewGroup('/api/group', formData)
                .then(res => {
                    if (res.status === 200) {
                        groupId(res.data.id)
                        this.setState({
                            nav: true,
                            spinner: false
                        })
                        modalWindowForUserNotificationCreatingGroupOpen();
                        setTimeout(() => {
                            if (blockingTimerCloseNotificationSuccessfulModificationGroup === false) {
                                this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup()
                            }
                        }, 1000)
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        this.setState({
                            spinner: false,
                            errorModification: true,
                            errorMessage: error
                        })
                    }
                })
        }

        this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup = () => {
            blockingTimerCloseNotificationSuccessfulModificationGroup = true;
            modalWindowForUserNotificationCreatingGroupClose();
            history.push(`/groups/${idGroup}`)
        }

        this.goToBackGroup = () => {
            history.push(`/groups/${id}`)
        }

        this.toggleBtnForThemeGroupList = () => {
            this.setState({
                listSelectTheme: !this.state.listSelectTheme
            })
        }

        this.valueGroupName = (event) => {
            this.setState({
                name: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueThemeGroup = (event) => {
            if (event.target.innerHTML !== "Другое") {
                this.setState({
                    theme: event.target.innerHTML,
                    ownTheme: '',
                    listSelectTheme: false

                })
            } else if (event.target.innerHTML === "Другое") {
                this.setState({
                    theme: event.target.innerHTML,
                    listSelectTheme: false
                })
            }
        }

        this.valueOwnThemeGroup = (event) => {
            this.setState({
                ownTheme: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueSubthemeGroup = (event) => {
            this.setState({
                subTheme: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueDescriptionGroup = (event) => {
            this.setState({
                description: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.modalWindowInvalidFilesCloseFunc = () => {
            modalWindowInvalidFilesClose()
        }

        this.valueNameAndContentPhotoGroup = (event) => {
            const files = event.target.value.split(".").pop().toLowerCase();
            const value = event.target.value
            if (value.length > 0) {
                if (files === "jpg" || files === "jpeg" || files === "png") {
                    const valueNamePhoto = event.target.value.split("\\");
                    this.setState({
                        photo: event.target.files[0],
                        photoName: valueNamePhoto[valueNamePhoto.length - 1]
                    })
                } else {
                    this.setState({
                        photo: "",
                        photoName: "",
                    }, () => {
                        event.target.value = ""
                        modalWindowInvalidFilesOpen()
                    })
                    setTimeout(this.modalWindowInvalidFilesCloseFunc, 2000)
                }
            }
        }

        this.cancelSelectedPhoto = () => {
            this.setState({
                photo: "",
                photoName: ""
            })
        }

        this.goToBack = () => {
            popstate(true)
        }

        this.mouseLeaveThemeGroupList = () => {
            this.setState({
                listSelectTheme: false
            })
        }

        this.closeModalWindowErrorModificationGroup = () => {
            this.setState({
                errorModification: false,
                errorMessage: ''
            })
        }

        this.inBlockModalFalse = () => {
            this.setState({
                mouseInBlockModalWindow: false
            })
        }

        this.inBlockModalTrue = () => {
            this.setState({
                mouseInBlockModalWindow: true
            })
        }

        this.modificationGroupErrorCloseOverlay = () => {
            if (!this.state.mouseInBlockModalWindow) {
                this.closeModalWindowErrorModificationGroup()
            }
        }

        this.modificationGroupSuccessfullyCloseOverlay = () => {
            if (!this.state.mouseInBlockModalWindow) {
                this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup()
            }
        }
    }

    render() {

        let selectionTheme = null;
        let inputPhoto = null;
        let listClassTheme = "modification-group__select__list";

        const { modalWindowUserNotificationCreatingGroup, invalidFile } = this.props;

        const {
            errorModification,
            ownTheme,
            theme,
            photoName,
            listSelectTheme,
            name,
            subTheme,
            description,
            adminFirstName,
            adminLastName,
            errorLoadingContent,
            spinner,
            nav } = this.state;

        const modalWindowUserNotificationModificationGroup = modalWindowUserNotificationCreatingGroup ?
            <div className="modification-group__message-save-modification" onClick={this.modificationGroupSuccessfullyCloseOverlay}>
                <div className="modification-group__message-save-modification__modal"
                    onMouseLeave={this.inBlockModalFalse}
                    onMouseEnter={this.inBlockModalTrue}>
                    <img className="modification-group__message-save-modification__modal_btn"
                        onClick={this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup}
                        src={cancel}
                        alt="cancel"
                    />
                    <div className="modification-group__message-save-modification__modal_message">
                        Изменения успешно сохранены!
                    </div>
                </div>
            </div> : null;

        const errorModificationModalWindow = errorModification ?
            <div className="modification-group__message-save-modification" onClick={this.modificationGroupErrorCloseOverlay}>
                <div className="modification-group__message-save-modification__modal"
                    onMouseLeave={this.inBlockModalFalse}
                    onMouseEnter={this.inBlockModalTrue}>
                    <img className="modification-group__message-save-modification__modal_btn"
                        onClick={this.closeModalWindowErrorModificationGroup}
                        src={cancel}
                        alt="cancel"
                    />
                    <div className="modification-group__message-save-modification__modal_message">
                        Изменения не сохранены!
                        {this.state.errorMessage}
                    </div>
                </div>
            </div> : null;

        const invalidFileMessage = <div className="modification-group__input-file__invalid-file">
            <div className="modification-group__input-file__invalid-file_message">
                Не верный формат! Разрешены: .jpg, .jpeg, .png
            </div>
        </div>

        let modalWindowMessageInvalidFile = invalidFile ? invalidFileMessage : null;

        const fieldOwnTheme = <div className="modification-group__wrapper">
            <label className="modification-group__label">Своя тема группы:</label>
            <input
                onChange={this.valueOwnThemeGroup}
                type="text"
                name="groupName"
                placeholder="Тема группы"
                value={ownTheme}
                className="modification-group__label_input"
            />
        </div>

        if (theme === "Другое") {
            selectionTheme = fieldOwnTheme
        } else {
            selectionTheme = null
        }

        const notificationSelectedPhoto = <div className="modification-group__wrapper">
            <label className="modification-group__label">Фото группы:</label>
            <span className="modification-group__message">
                {photoName}
                <img onClick={this.cancelSelectedPhoto} src={deletee} alt="delete" />
            </span>
        </div>

        const notSelectedPhoto = <div className="modification-group__wrapper-theme">
            <label className="modification-group__label">Фото группы:</label>
            <label htmlFor="photoGroup" className="modification-group__input-file">
                <span className="modification-group__input-file_img">
                    <img src={download} alt="inputFile" />
                </span>
                <div className="modification-group__input-file_line"></div>
                <span className="modification-group__input-file_message">Выберите файл</span>
                {modalWindowMessageInvalidFile}
            </label>
            <input name="photo"
                type="file"
                accept="image/jpeg,image/png"
                onChange={this.valueNameAndContentPhotoGroup}
                id="photoGroup"
                className="modification-group__label_input-hidden"
            />
        </div>

        if (photoName.length === 0) {
            inputPhoto = notSelectedPhoto
        } else {
            inputPhoto = notificationSelectedPhoto
        }

        if (listSelectTheme === true) {
            listClassTheme = "activeListTheme"
        }

        let contentModification = <div>
            <form onSubmit={this.modificationGroup} className="modification-group">
                <h2 className="modification-group__title">Редактирование:</h2>
                <div className="modification-group__wrapper">
                    <label className="modification-group__label">Название группы: </label>
                    <input required
                        onChange={this.valueGroupName}
                        type="text"
                        name="groupName"
                        placeholder="Укажите название группы"
                        value={name}
                        className="modification-group__label_input"
                    />
                </div>
                <div className="modification-group__wrapper-theme">
                    <label className="modification-group__label">Тема группы: </label>
                    <div>
                        <div className="modification-group__select__btn"
                            onClick={this.toggleBtnForThemeGroupList}>
                            {theme}
                        </div>
                        <ul className={listClassTheme}
                            onMouseLeave={this.mouseLeaveThemeGroupList}>
                            <li onClick={this.valueThemeGroup}>Не выбрано</li>
                            <li onClick={this.valueThemeGroup}>Авто и автовладельцы</li>
                            <li onClick={this.valueThemeGroup}>Благотворительность</li>
                            <li onClick={this.valueThemeGroup}>Велосипеды</li>
                            <li onClick={this.valueThemeGroup}>Видеоигры</li>
                            <li onClick={this.valueThemeGroup}>Водный транспорт</li>
                            <li onClick={this.valueThemeGroup}>Городское сообщество</li>
                            <li onClick={this.valueThemeGroup}>Дизайн, интерьер</li>
                            <li onClick={this.valueThemeGroup}>Дикие животные</li>
                            <li onClick={this.valueThemeGroup}>Домашние животные</li>
                            <li onClick={this.valueThemeGroup}>Друзья</li>
                            <li onClick={this.valueThemeGroup}>Еда</li>
                            <li onClick={this.valueThemeGroup}>Здоровье</li>
                            <li onClick={this.valueThemeGroup}>Компьютеры, интернет</li>
                            <li onClick={this.valueThemeGroup}>Красота</li>
                            <li onClick={this.valueThemeGroup}>Кулинария</li>
                            <li onClick={this.valueThemeGroup}>Медицина</li>
                            <li onClick={this.valueThemeGroup}>Недвижимость</li>
                            <li onClick={this.valueThemeGroup}>Образование</li>
                            <li onClick={this.valueThemeGroup}>Объявления</li>
                            <li onClick={this.valueThemeGroup}>Отношения, семья</li>
                            <li onClick={this.valueThemeGroup}>Развлечения</li>
                            <li onClick={this.valueThemeGroup}>Спорт</li>
                            <li onClick={this.valueThemeGroup}>Туризм, путешествия</li>
                            <li onClick={this.valueThemeGroup}>Увлечения, хобби</li>
                            <li onClick={this.valueThemeGroup}>Финансы</li>
                            <li onClick={this.valueThemeGroup}>Другое</li>
                        </ul>
                    </div>
                </div>
                {selectionTheme}
                <div className="modification-group__wrapper">
                    <label className="modification-group__label"> Подтема группы:</label>
                    <input
                        onChange={this.valueSubthemeGroup}
                        type="text"
                        name="subThemeGroup"
                        placeholder="Подтема группы"
                        value={subTheme}
                        className="modification-group__label_input"
                    />
                </div>
                <div className="modification-group__wrapper-description">
                    <label className="modification-group__label">Описание группы:</label>
                    <textarea
                        onChange={this.valueDescriptionGroup}
                        name="description"
                        placeholder="Описание группы"
                        value={description}
                        className="modification-group__label_input-description"
                    />
                </div>
                {inputPhoto}
                <div className="modification-group__wrapper">
                    <label className="modification-group__label">Администратор группы:</label>
                    <span className="modification-group__label_admin">
                        {adminFirstName} {adminLastName}
                    </span>
                </div>
                <button className="modification-group__submit" type="submit">Сохранить</button>
                <div className="modification-group__cancel" onClick={this.goToBackGroup}>Отмена</div>
            </form>
            {modalWindowUserNotificationModificationGroup}
            {errorModificationModalWindow}
        </div>

        if (errorLoadingContent) {
            contentModification = <div>Что-то пошло не так! Контент не доступен!</div>
        }

        const content = spinner ? <Spinner /> : contentModification;

        return (
            <>
                <PromptNav when={nav === false} />
                {content}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        idGroup: state.groupId,
        invalidFile: state.invalidFile,
        modalWindowUserNotificationCreatingGroup: state.modalWindowUserNotificationCreatingGroup
    }
}

const mapDispatchToProps = {
    groupId,
    modalWindowInvalidFilesOpen,
    modalWindowInvalidFilesClose,
    modalWindowForUserNotificationCreatingGroupOpen,
    modalWindowForUserNotificationCreatingGroupClose,
    popstate,
    actionTransitionModification,
    checkingForAuthorization,
    unsubscribe
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(ModificationGroup)))
