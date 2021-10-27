import React, { Component} from 'react';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router-dom";
import {groupId, modalWindowInvalidFilesOpen, modalWindowInvalidFilesClose, modalWindowForUserNotificationCreatingGroupOpen, modalWindowForUserNotificationCreatingGroupClose, actionTransitionModification} from '../../actions';
import {connect} from 'react-redux';
import Spinner from '../spinner/spinner';
import './creatingGroup.scss';
import PromptNav from'../PromptNav/promptNav';
import deletee from './delete.svg';
import download from './download.svg';
import cancel from './cancel.svg';


class CreatingGroup extends Component{
    _cleanupFunction = false;
    constructor(props){
        super(props)
        this.state={
            name: '',
            theme: 'Не выбрано',
            ownTheme: '',
            subTheme: '',
            description: '',
            photo: '',
            photoName: '',
            spinner: false,
            nav:true,
            listSelectTheme: false,
            adminFirstName:'',
            adminLastName: '',
            error: false,
            mouseInBlockModalWindow:false
        }
        const {Service} = this.props;

        this.valueGroupName=(event)=>{
            this.setState({
                name: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.goToBack=()=>{
            if(this._cleanupFunction){
                this.setState({
                    nav: true
                })
                this.props.actionTransitionModification(true)
            }
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            window.addEventListener('popstate', ()=>this.goToBack());
            Service.getAccountInfo(`/api/account/${this.props.id}/page-info`)
                .then(res=>{
                    console.log(res)
                    if(this._cleanupFunction){
                        this.setState({
                            adminFirstName: res.data.account.firstName,
                            adminLastName: res.data.account.lastName,
                            nav: false
                        })
                    }
                }).catch(err=>{
                    if(this._cleanupFunction){
                        this.setState({
                            adminFirstName: "Что-то пошло не так! Администратор не известен!",
                            adminLastName: '',
                            nav: false
                        })
                    }
                })
            

        }

        this.componentWillUnmount=()=>{
            window.removeEventListener('popstate', ()=>this.goToBack())
            this._cleanupFunction=false;
        }


        this.valueThemeGroup=(event)=>{
            if(event.target.innerHTML!=="Другое"){
                this.setState({
                    theme: event.target.innerHTML,
                    ownTheme: ''
                })
            }else if(event.target.innerHTML==="Другое"){
                this.setState({
                    theme: event.target.innerHTML,
                })
            }
            this.toggleBtnForThemeGroupList()
        }

        this.valueOwnThemeGroup=(event)=>{
            this.setState({
                ownTheme: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueSubthemeGroup=(event)=>{
            this.setState({
                subTheme: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueDescriptionGroup=(event)=>{
            this.setState({
                description: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.modalWindowInvalidFilesClose=()=>{
            this.props.modalWindowInvalidFilesClose()
        }

        this.valueNameAndContentPhotoGroup=(event)=>{
            const files=event.target.value.split(".").pop().toLowerCase();
            const value=event.target.value
            console.log(files, value)
            if(event.target.value.length>0){
                if(files==="jpg" || files==="jpeg" || files==="png"){
                    this.setState({
                        photo: event.target.files[0],
                        photoName: event.target.value
                    })
                }else{
                    this.setState({
                        photo: "",
                        photoName: "",
                    },()=>{
                        event.target.value=""
                        this.props.modalWindowInvalidFilesOpen()
                    })

                    setTimeout(this.modalWindowInvalidFilesClose, 2000)
                }
            } 

        }

        let blockingTimerCloseNotificationSuccessfulCreatingGroup=false

        this.cancelSelectedPhoto=()=>{
            this.setState({
                photo: "",
                photoName: ""
            })
        }

        this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup=()=>{
            blockingTimerCloseNotificationSuccessfulCreatingGroup=true
            this.props.modalWindowForUserNotificationCreatingGroupClose();
            this.props.history.push(`/groups/${this.props.idGroup}`)
        
        }

        this.creatingGroup=(event)=>{
            event.preventDefault();
            const formData=new FormData();
            if(this.state.photoName.length>0){
                for(let key in this.state){
                    formData.append(key, this.state[key])
                }
            }else{
                const obj={
                    name: this.state.name,
                    theme: this.state.themr,
                    ownTheme: this.state.ownTheme,
                    subTheme: this.state.subTheme,
                    description: this.state.description,
                    photoName: ''
                }

                for(let key in obj){
                    formData.append(key, this.state[key])
                }
            }

            this.setState({
                spinner: true
            })
           
            Service.postNewGroup('/api/group/create', formData)
                .then(res=>{
                    if(res.status===200){
                        this.setState({
                            spinner: false,
                            nav: true
                        })
                        this.props.modalWindowForUserNotificationCreatingGroupOpen();
                        this.props.groupId(res.data.id)
                        setTimeout(()=>{
                            if(blockingTimerCloseNotificationSuccessfulCreatingGroup===false){
                                this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup()
                            }
                        }, 1000)              
                    }
                }).catch(err=>{
                    this.setState({
                        spinner: false,
                        error: true
                    })
                })
        }

        this.goToBackGroup=()=>{
            this.props.history.push(`/groups/`)
        }

        this.toggleBtnForThemeGroupList=()=>{
            this.setState({
                listSelectTheme: !this.state.listSelectTheme
            })
        }

        this.mouseLeaveThemeGroupList=()=>{
            this.setState({
                listSelectTheme: false
            })
        }


        this.closeErrorWindowCreatingGroup=()=>{
            this.setState({
                error: false
            })
        }

        this.inBlockModalFalse=()=>{
            this.setState({
                mouseInBlockModalWindow:false
            })
        }

        this.inBlockModalTrue=()=>{
            this.setState({
                mouseInBlockModalWindow:true
            })
        }

        this.creatingGroupSuccesfullyCloseOverlay=()=>{
            if(!this.state.mouseInBlockModalWindow){
                this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup()
            }
        }

        this.closeModalWindowErrorCreatingGroup=()=>{
            if(!this.state.mouseInBlockModalWindow){
                this.closeErrorWindowCreatingGroup()
            }
        }

    }
    

   render(){
    
    const modalWindowUserNotificationCreatingGroup=this.props.modalWindowUserNotificationCreatingGroup? <div className="creating-group__message-save-modification" onClick={this.creatingGroupSuccesfullyCloseOverlay}>
                                                                                                            <div className="creating-group__message-save-modification__modal" onMouseLeave={this.inBlockModalFalse} onMouseEnter={this.inBlockModalTrue}>
                                                                                                                <img className="creating-group__message-save-modification__modal_btn" onClick={this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup} src={cancel} alt="cancel"/>
                                                                                                                <div className="creating-group__message-save-modification__modal_message">Группа успешно создана!</div>
                                                                                                            </div>
                                                                                                        </div> :null;

    const errorModalWindowCreatingGroup=this.state.error ? <div className="creating-group__message-save-modification" onClick={this.closeModalWindowErrorCreatingGroup}>
                                                                <div className="creating-group__message-save-modification__modal" onMouseLeave={this.inBlockModalFalse} onMouseEnter={this.inBlockModalTrue}>
                                                                    <img className="creating-group__message-save-modification__modal_btn" src={cancel} alt="cancel" onClick={this.closeErrorWindowCreatingGroup} />
                                                                    <div className="creating-group__message-save-modification__modal_message">Что-то пошло не так! группа не создана!</div>
                                                                </div>
                                                            </div> :null;

    const invalidFileMessage= <div className="creating-group__input-file__invalid-file">
                                    <div className="creating-group__input-file__invalid-file_message">
                                        Не верный формат! Разрешены: .jpg, .jpeg, .png
                                    </div> 
                                </div>

    let modalWindowMessageInvalidFile= this.props.invalidFile ? invalidFileMessage : null;

    const fieldOwnTheme=<div className="creating-group__wrapper">
                            <label className="creating-group__label">Своя тема группы: </label>
                                <input 
                                    onChange={this.valueOwnThemeGroup} 
                                    type="text" 
                                    name="groupName" 
                                    placeholder="Тема группы" 
                                    value={this.state.ownTheme}
                                    className="creating-group__label_input"
                                /> 
                        </div>

    let selectionTheme=null;

    if(this.state.theme==="Другое"){
        selectionTheme=fieldOwnTheme
    }else{
        selectionTheme=null
    }

    const notificationSelectedPhoto=<div className="creating-group__wrapper">
                                        <label className="creating-group__label">Фото группы:</label>
                                        <span className="creating-group__messages">
                                            {this.state.photoName}
                                            <img onClick={this.cancelSelectedPhoto} src={deletee} alt="delete"/>
                                        </span>
                                    </div>
    const notSelectedPhoto=<div className="creating-group__wrapper-theme">
                                <label className="creating-group__label">Фото группы:</label>
                                <label htmlFor="photoGroup" className="creating-group__input-file">
                                    <span className="creating-group__input-file_img"><img src={download} alt="inputFile"/></span>
                                    <div className="creating-group__input-file_line"></div>
                                    <span className="creating-group__input-file_message">Выберите файл</span>
                                    {modalWindowMessageInvalidFile}
                                </label>
                                <input  name="photo" 
                                        type="file" 
                                        accept="image/jpeg,image/png" 
                                        onChange={this.valueNameAndContentPhotoGroup}
                                        id="photoGroup"
                                        className="modification-group__label_input-hidden"
                                    />
                            </div>

    
    let inputPhoto=null;
    if(this.state.photoName.length===0){
        inputPhoto=notSelectedPhoto
    }else{
        inputPhoto=notificationSelectedPhoto
    }

    let listClassTheme="creating-group__select__list"

    if(this.state.listSelectTheme===true){
        listClassTheme="activeListThemeCreatingGroup"
    }

    const contentCreatingGroup=<div>
                                    <form className="creating-group" onSubmit={this.creatingGroup}>
                                        <h2 className="creating-group__title">Создание группы:</h2>
                                        <div className="creating-group__wrapper">
                                            <label className="creating-group__label">Название группы:</label>
                                            <input 
                                                    onChange={this.valueGroupName} 
                                                    type="text" 
                                                    name="groupName" 
                                                    placeholder="Укажите название группы" 
                                                    value={this.state.name}
                                                    className="creating-group__label_input"
                                                    required/> 
                                        </div>
                                        <div className="creating-group__wrapper-theme">
                                        <label className="creating-group__label">Тема группы: </label>
                                        <div>
                                            <div className="creating-group__select__btn" onClick={this.toggleBtnForThemeGroupList}>{this.state.theme}</div>
                                            <ul className={listClassTheme} onMouseLeave={this.mouseLeaveThemeGroupList}>
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
                                        { selectionTheme}
                                        <div className="creating-group__wrapper">
                                            <label className="creating-group__label">Подтема группы:</label>
                                            <input 
                                                onChange={this.valueSubthemeGroup} 
                                                type="text" 
                                                name="subThemeGroup" 
                                                placeholder="Подтема группы" 
                                                value={this.state.subTheme}
                                                className="creating-group__label_input"
                                            /> 
                                        </div>
                                        <div className="creating-group__wrapper-description">
                                            <label className="creating-group__label">Описание группы:</label>
                                            <textarea  
                                                onChange={this.valueDescriptionGroup} 
                                                name="description" 
                                                placeholder="Описание группы"
                                                value={this.state.description}
                                                className="creating-group__label_input-description"
                                                /> 
                                        </div>
                                        {inputPhoto}
                                        <div className="creating-group__wrapper">
                                            <label className="creating-group__label">Администратор группы:</label>
                                            <span className="creating-group__label_admin">
                                                {this.state.adminFirstName} {this.state.adminLastName}
                                            </span>
                                        </div>
                                        <button className="creating-group__submit" type="submit">Сохранить</button>
                                        <div className="creating-group__cancel" onClick={this.goToBackGroup}>Отмена</div>
                                    </form>
                                    {modalWindowUserNotificationCreatingGroup}
                                    {errorModalWindowCreatingGroup}
                                </div>

        const content=this.state.spinner? <Spinner/>: contentCreatingGroup;

        return (
            <div>
                {content}
                <PromptNav when={this.state.nav===false}/>
            </div>
            
        )
   }
}

const mapStateToProps = (state) => {
    return {
        idGroup: state.groupId,
        invalidFile: state.invalidFile,
        modalWindowUserNotificationCreatingGroup: state.modalWindowUserNotificationCreatingGroup,
        id: state.userId,
        
    }
}

const mapDispatchToProps = {
    groupId,
    modalWindowInvalidFilesOpen,
    modalWindowInvalidFilesClose,
    modalWindowForUserNotificationCreatingGroupOpen,
    modalWindowForUserNotificationCreatingGroupClose,
    actionTransitionModification
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(CreatingGroup)))

