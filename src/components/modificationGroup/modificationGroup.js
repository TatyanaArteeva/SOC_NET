import React, { Component} from 'react';
import WithService from '../hoc/hoc';
import {groupId, modalWindowInvalidFilesOpen, modalWindowInvalidFilesClose, modalWindowForUserNotificationCreatingGroupOpen, modalWindowForUserNotificationCreatingGroupClose} from '../../actions';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import PromptNav from'../PromptNav/promptNav';
import Spinner from '../spinner/spinner';
import './modificationGroup.scss';
import deletee from './delete.svg';
import download from './download.svg';
import cancel from './cancel.svg';

class ModificationGroup extends Component{
    _cleanupFunction = false;
    constructor(props){
        super(props)
        this.state={
            name: '',
            theme: '',
            ownTheme: '',
            subTheme: '',
            description: '',
            photo: '',
            photoName: '',
            id:'',
            nav:true,
            spinner:true,
            listSelectTheme: false
        }

        const {Service} = this.props;
        const id=localStorage.getItem('idGroup')
        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            const inf=async()=>{
                    const res=await Service.getGroup(`/api/group/${id}`);
                    console.log(res)
                      if(this._cleanupFunction){
                        this.setState({
                            name: res.data.name,
                            theme: res.data.theme,
                            ownTheme: res.data.ownTheme,
                            subTheme: res.data.subTheme,
                            description: res.data.description,
                            photoName: res.data.photoName,
                            id: res.data.id,
                            nav:false,
                            spinner: false
                        }) 
                        
                        function dataURItoBlob(dataURI) {
                            let byteString = atob(dataURI);
                            let mimeString = {type: "image/jpg"};
                            let ab = new ArrayBuffer(byteString.length);
                            let ia = new Uint8Array(ab);
                            for (let i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }
                            let bb = new Blob([ab], mimeString);
                            return bb
                        }

                        const newImg=dataURItoBlob(res.data.photo);
                        const file = new File([newImg], this.state.photoName, {type: "image/jpeg"});
                        console.log(file)

                        this.setState({
                            photo: file
                        })
                      }  
                
            } 
            inf() 
        }

        

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }


        this.valueGroupName=(event)=>{
            this.setState({
                name: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueThemeGroup=(event)=>{
            // console.log(event.target.innerHTML)
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

        this.cancelSelectedPhoto=()=>{
            this.setState({
                photo: "",
                photoName: ""
            })
        }

        let blockingTimerCloseNotificationSuccessfulModificationGroup=false

        this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup=()=>{
            blockingTimerCloseNotificationSuccessfulModificationGroup=true
            this.props.modalWindowForUserNotificationCreatingGroupClose();
            this.props.history.push(`/groups/${this.props.idGroup}`)
        }

        this.goToBackGroup=()=>{
            this.props.history.push(`/groups/${id}`)
        }

        this.toggleBtnForThemeGroupList=()=>{
            this.setState({
                listSelectTheme: !this.state.listSelectTheme
            })
        }

        this.modificationGroup=(event)=>{
            
            console.log("hi")
            event.preventDefault();
            this.setState({
                spinner:true
            })
            const formData=new FormData();

            if(this.state.photo.length===0){
                const obj={
                    name: this.state.name,
                    theme: this.state.theme,
                    ownTheme: this.state.ownTheme,
                    subTheme: this.state.subTheme,
                    description: this.state.description,
                    photoName: this.state.photoName,
                    id:this.state.id,
                }

                for(let key in obj){
                    formData.append(key, this.state[key])
                }
                
            }else{
                for(let key in this.state){
                    formData.append(key, this.state[key])
                }
            }

            Service.postNewGroup('/api/group', formData)
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        console.log(res.data.id)
                        this.props.groupId(res.data.id)
                        console.log(this.props.idGroup)
                        this.setState({
                            nav: true,
                            spinner:false
                        })
                        this.props.modalWindowForUserNotificationCreatingGroupOpen();
                        setTimeout(()=>{
                            if(blockingTimerCloseNotificationSuccessfulModificationGroup===false){
                                this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup()
                            }
                        }, 1000)
                    }
                })
        }

        this.goToBack=()=>{
            if(this._cleanupFunction){
                this.setState({
                    nav: true
                })
            }
        }

        this.mouseLeaveThemeGroupList=()=>{
            this.toggleBtnForThemeGroupList()
        }


        this.componentDidUpdate=()=>{
            window.addEventListener('popstate',()=>this.goToBack());
        }

        this.componentWillUnmount=()=>{
            window.removeEventListener('popstate',()=>this.goToBack())
            this._cleanupFunction=false;
        }

    }
    

   render(){
    console.log(this.state.nav)
    const modalWindowUserNotificationCreatingGroup=this.props.modalWindowUserNotificationCreatingGroup? <div className="modification-group__message-save-modification">
                                                                                                            <div className="modification-group__message-save-modification__modal">
                                                                                                                <img className="modification-group__message-save-modification__modal_btn" onClick={this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup} src={cancel} alt="cancel"/>
                                                                                                                <div className="modification-group__message-save-modification__modal_message">Изменения успешно сохранены!</div>
                                                                                                            </div>
                                                                                                        </div> :null;

    const invalidFileMessage= <div className="modification-group__input-file__invalid-file">
                                <div className="modification-group__input-file__invalid-file_message">
                                    Не верный формат! Разрешены: .jpg, .jpeg, .png
                                </div> 
                            </div>

    let modalWindowMessageInvalidFile= this.props.invalidFile ? invalidFileMessage : null;

    const fieldOwnTheme=<div className="modification-group__wrapper">
                            <label className="modification-group__label">Своя тема группы:</label>
                            <input 
                                    onChange={this.valueOwnThemeGroup} 
                                    type="text" 
                                    name="groupName" 
                                    placeholder="Тема группы" 
                                    value={this.state.ownTheme}
                                    className="modification-group__label_input"
                                /> 
                        </div>

    let selectionTheme=null;

    if(this.state.theme==="Другое"){
        selectionTheme=fieldOwnTheme
    }else{
        selectionTheme=null
    }

    const notificationSelectedPhoto=<div className="modification-group__wrapper">
                                        <label className="modification-group__label">Фото группы:</label>
                                        <span className="modification-group__message">
                                            {this.state.photoName}
                                            <img onClick={this.cancelSelectedPhoto} src={deletee} alt="delete"/>
                                        </span>
                                    </div>
    const notSelectedPhoto=<div className="modification-group__wrapper-theme">
                                <label className="modification-group__label">Фото группы:</label>
                                <label htmlFor="photoGroup" className="modification-group__input-file">
                                    <span className="modification-group__input-file_img"><img src={download} alt="inputFile"/></span>
                                    <div className="modification-group__input-file_line"></div>
                                    <span className="modification-group__input-file_message">Выберите файл</span>
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


    let listClassTheme="modification-group__select__list"

    if(this.state.listSelectTheme===true){
        listClassTheme="activeListTheme"
    }

    // const navBlock=!this.state.nav ? <PromptNav when={this.state.nav===false}/> : null;


    const contentModification=<div>
                                <PromptNav when={this.state.nav===false}/>
                                {/* {navBlock} */}
                                <form onSubmit={this.modificationGroup} className="modification-group">
                                    <h2 className="modification-group__title">Редактирование:</h2>
                                    <div className="modification-group__wrapper">
                                        <label className="modification-group__label">Название группы: </label>
                                            <input required
                                                onChange={this.valueGroupName} 
                                                type="text" 
                                                name="groupName" 
                                                placeholder="Укажите название группы" 
                                                value={this.state.name}
                                                className="modification-group__label_input"
                                            /> 
                                    </div>
                                    <div className="modification-group__wrapper-theme">
                                        <label className="modification-group__label">Тема группы: </label>
                                        <div className="modification-group__select__btn" onClick={this.toggleBtnForThemeGroupList}>{this.state.theme}</div>
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
                                    { selectionTheme}
                                    <div className="modification-group__wrapper">
                                        <label className="modification-group__label"> Подтема группы:</label>
                                        <input 
                                                onChange={this.valueSubthemeGroup} 
                                                type="text" 
                                                name="subThemeGroup" 
                                                placeholder="Подтема группы" 
                                                value={this.state.subTheme}
                                                className="modification-group__label_input"
                                                /> 
                                    </div>
                                    <div className="modification-group__wrapper-description">
                                        <label className="modification-group__label">Описание группы:</label>
                                        <textarea  
                                                onChange={this.valueDescriptionGroup} 
                                                name="description" 
                                                placeholder="Описание группы"
                                                value={this.state.description}
                                                className="modification-group__label_input-description"
                                                /> 
                                    </div>
                                    <div>
                                        {inputPhoto}
                                    </div>
                                    <button className="modification-group__submit" type="submit">Сохранить</button>
                                    <div className="modification-group__cancel" onClick={this.goToBackGroup}>Отмена</div>
                                </form>
                                {modalWindowUserNotificationCreatingGroup}
                            </div>

        const content=this.state.spinner? <Spinner/> : contentModification


        return (
            <>
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
    modalWindowForUserNotificationCreatingGroupClose
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(ModificationGroup)))
