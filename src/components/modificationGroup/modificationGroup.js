import React, { Component} from 'react';
import {Link, HashRouter} from 'react-router-dom';
import WithService from '../hoc/hoc';
import {groupId, modalWindowInvalidFilesOpen, modalWindowInvalidFilesClose, modalWindowForUserNotificationCreatingGroupOpen, modalWindowForUserNotificationCreatingGroupClose} from '../../actions';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import PromptNav from'../PromptNav/promptNav';
import Spinner from '../spinner/spinner';

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
            spinner:true
        }

        const {Service} = this.props;
        const id=localStorage.getItem('idGroup')
        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            const inf=async()=>{
                    const res=await Service.getGroup(`/api/group/${id}`);
                    console.log(res.data.photo)
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
            this.setState({
                theme: event.target.value
            })
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
                        }, 3000)
                    }
                })
        }


    }
    

   render(){
    console.log(this.state.photo.length)
    const id=localStorage.getItem('idGroup')
    const cancelFromModificationGroupLink=`/groups/${id}`

    const modalWindowUserNotificationCreatingGroup=this.props.modalWindowUserNotificationCreatingGroup? <div>
                                                                                                            <div>
                                                                                                                <button onClick={this.creatingGroupSuccessfullyCreatingAndTransitionAllGroup}>Закрыть</button>
                                                                                                                Изменения успешно применены!
                                                                                                            </div>
                                                                                                        </div> :null;

    const invalidFileMessage= <div>
                            <div>Не верный формат файла!</div>
                            <div>Допустимые значения: .jpg, .jpeg, .png</div>
                        </div>

    let modalWindowMessageInvalidFile= this.props.invalidFile ? invalidFileMessage : null;

    const fieldOwnTheme=<div>
                            <label>Укажите свою тематику группы: 
                                <input 
                                    onChange={this.valueOwnThemeGroup} 
                                    type="text" 
                                    name="groupName" 
                                    placeholder="Тема группы" 
                                    value={this.state.ownTheme}
                                /> 
                            </label>
                        </div>

    let selectionTheme=null;

    if(this.state.theme==="Другое"){
        selectionTheme=fieldOwnTheme
    }else{
        selectionTheme=null
    }

    const notificationSelectedPhoto=<div>
                                        <div>Вы выбрали фото группы: {this.state.photoName}</div>
                                        <button onClick={this.cancelSelectedPhoto}>Отменить</button>
                                    </div>
    const notSelectedPhoto=<div>
                                <label>Фото группы: 
                                    <input  name="photo" 
                                            type="file" 
                                            accept="image/jpeg,image/png" 
                                            onChange={this.valueNameAndContentPhotoGroup}
                                    />
                                </label>
                            </div>

    
    let inputPhoto=null;
    if(this.state.photoName.length===0){
        inputPhoto=notSelectedPhoto
    }else{
        inputPhoto=notificationSelectedPhoto
    }

    const contentModification=<div>
                                <PromptNav when={this.state.nav===false}/>
                                <form>
                                    <label>Название группы: 
                                        <input 
                                            onChange={this.valueGroupName} 
                                            type="text" 
                                            name="groupName" 
                                            placeholder="Укажите название группы" 
                                            value={this.state.name}
                                            required/> 
                                    </label>
                                    <label>Тематика группы: 
                                        <select 
                                            onChange={this.valueThemeGroup}
                                            value={this.state.theme} 
                                            name="themeGroup">
                                            <option>Не выбрано</option>
                                            <option>Авто и автовладельцы</option>
                                            <option>Благотворительность</option>
                                            <option>Велосипеды</option>
                                            <option>Видеоигры</option>
                                            <option>Водный транспорт</option>
                                            <option>Городское сообщество</option>
                                            <option>Дизайн, интерьер</option>
                                            <option>Дикие животные</option>
                                            <option>Домашние животные</option>
                                            <option>Друзья</option>
                                            <option>Еда</option>
                                            <option>Здоровье</option>
                                            <option>Компьютеры, интернет</option>
                                            <option>Красота</option>
                                            <option>Кулинария</option>
                                            <option>Медицина</option>
                                            <option>Недвижимость</option>
                                            <option>Образование</option>
                                            <option>Объявления</option>
                                            <option>Отношения, семья</option>
                                            <option>Развлечения</option>
                                            <option>Спорт</option>
                                            <option>Туризм, путешествия</option>
                                            <option>Увлечения, хобби</option>
                                            <option>Финансы</option>
                                            <option>Другое</option>
                                        </select> 
                                    </label>
                                    { selectionTheme}
                                    <label> Учитывая тему, укажите подтему группы: 
                                            <input 
                                                onChange={this.valueSubthemeGroup} 
                                                type="text" 
                                                name="subThemeGroup" 
                                                placeholder="Подтема группы" 
                                                value={this.state.subTheme}
                                            /> 
                                    </label>
                                    <label>Описание группы: 
                                        <textarea  
                                            onChange={this.valueDescriptionGroup} 
                                            name="description" 
                                            placeholder="Описание группы"
                                            value={this.state.description}/> 
                                    </label>
                                    {inputPhoto}
                                    {modalWindowMessageInvalidFile}
                                    <div>
                                        Указать организатора группы
                                    </div>
                                </form>
                                <button onClick={this.modificationGroup}>Сохранить</button>
                                <HashRouter>
                                    <Link to={cancelFromModificationGroupLink}><button>Отмена</button></Link>
                                </HashRouter>
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
