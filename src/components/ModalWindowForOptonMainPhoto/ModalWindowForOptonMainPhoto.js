import React, {Component} from 'react';
import './ModalWindowForOptonMainPhoto.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsClose, photoUser, rights } from '../../actions';
import WithService from '../hoc/hoc';
import cancel from './cancel.svg';
import download from './download.svg';

class ModalWindowForOptonMainPhoto extends Component{
    
    constructor(props){
        super(props);
        this.state={
            valueNewPhoto: "",
            nameNewPhoto: "",
            modalWindowForMainPhotoModification: false,
            modalWindowQuestonRemovePhoto: false,
            userNotificationForModificationPhoto: false,
            modalWindowForMainPhotoRemove: false,
            messageInvalidFile: false
        }

        const {Service} = this.props;

       
        this.modalWindowForOptonsMainPhotoClose=()=>{
            this.props.modalWindowForMainPhotoOptionsClose()
        }

        this.modalWindowModificationMainPhoto=()=>{
            this.setState({
                modalWindowForMainPhotoModification: true
            })
        }

        this.modalWindowForModificationMainPhotoClose=()=>{
            this.setState({
                modalWindowForMainPhotoModification: false
            })
        }

        this.modalWindowInvalidFilesClose=()=>{
            this.setState({
                 messageInvalidFile: false
            })
        }

        this.valueNameAndContentPhoto=(event)=>{
            const files=event.target.value.split(".").pop().toLowerCase();
            if(event.target.value.length>0){
                if(files==="jpg" || files==="jpeg" || files==="png"){
                    this.setState({
                        valueNewPhoto: event.target.files[0],
                        nameNewPhoto: event.target.value
                    })
                }else{
                    this.setState({
                        nameNewPhoto: "",
                        valueNewPhoto: null,
                        messageInvalidFile: true
                    },()=>{
                        event.target.value=""
                    })
                    
                    setTimeout(this.modalWindowInvalidFilesClose, 2000)
                }
            }
        }

        this.modalWindowForQuestonRemovePhotoClose=()=>{
            this.setState({
                modalWindowQuestonRemovePhoto: false
            })
        }

        this.modalWindowForQuestonRemovePhotoOpen=()=>{
            this.setState({
                modalWindowQuestonRemovePhoto: true
            })
        }

        this.userNotificationForPhotoOpen=()=>{
            this.setState({
                userNotificationForModificationPhoto: true
            })
        }

        this.userNotificationForPhotoClose=()=>{
            this.setState({
                userNotificationForModificationPhoto: false
            })
        }

        this.userNotificationForPhotoRemoveOpen=()=>{
            this.setState({
                modalWindowForMainPhotoRemove: true
            })
        }

        this.userNotificationForPhotoRemoveClose=()=>{
            this.setState({
                modalWindowForMainPhotoRemove: false
            })
        }

        this.cancelChoiceNewPhoto=()=>{
            this.setState({
                nameNewPhoto: "",
                valueNewPhoto: null
            })
        }

        
            
        this.modalWindowForModificationPhotoClose=()=>{
            this.userNotificationForPhotoClose();
            this.modalWindowForModificationMainPhotoClose();
            this.cancelChoiceNewPhoto()
            this.userNotificationForPhotoRemoveClose();
            this.modalWindowForOptonsMainPhotoClose();
        }

        
        this.postNewPhotoProfile=(event)=>{
            event.preventDefault();
            const formData=new FormData();
            formData.append("photo", this.state.valueNewPhoto)
    
            Service.postNewPhotoProfile(`/api/account/${this.props.id}/change-photo`, formData)
                .then(res=>{
                    if(res.status===200){
                        this.props.rights(res.data.accesses)
                        const information=async ()=>{
                            const res=await Service.getAccountPhoto(`/api/account/${this.props.id}/photo`, {
                                responseType: 'arraybuffer'
                                })
                                .then(response => Buffer.from(response.data, 'binary').toString('base64'));
                                const newFormatPhoto="data:image/jpg;base64," + res;
                                this.props.photoUser(newFormatPhoto);
                                this.userNotificationForPhotoOpen();
                                if(this.state.userNotificationForModificationPhoto){
                                    setTimeout(this.modalWindowForModificationPhotoClose, 1000);
                                }
                                
                        }
                        information()
                    }
                })
        }

        this.confirmationRemovePhoto=(event)=>{
            event.preventDefault();
            Service.postRemovePhotoProfile(`/api/account/${this.props.id}/change-photo`, null)
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        this.props.rights(res.data.accesses);
                        const information=async ()=>{
                            const res=await Service.getAccountPhoto(`/api/account/${this.props.id}/photo`, {
                                responseType: 'arraybuffer'
                                })
                                .then(response => Buffer.from(response.data, 'binary').toString('base64'));
                                const newFormatPhoto="data:image/jpg;base64," + res;
                                this.props.photoUser(newFormatPhoto);
                                this.userNotificationForPhotoRemoveOpen();
                                setTimeout(this.modalWindowForModificationPhotoClose, 1000)
                                }
                        information()
                    }
                })
        }
    }
    
    render(){

        const invalidFile= <div className="modal-window-for-opton-main-photo__invalid-file">
                                <div className="modal-window-for-opton-main-photo__invalid-file_text">
                                    Не верный формат! Разрешены: .jpg, .jpeg, .png
                                </div>
                            </div>

        let ModalWindowMessageInvalidFile= this.state.messageInvalidFile ? invalidFile : null;

        const modalWindowNotificationForRemovePhoto=<div className="modal-window-for-opton-main-photo">
                                                        <div className="modal-window-for-opton-main-photo__cancel">
                                                            <img src={cancel} alt="cancel" onClick={()=>this.modalWindowForModificationPhotoClose}/>
                                                        </div>
                                                        <div className="modal-window-for-opton-main-photo__text_final">
                                                            Фото успешно удалено!
                                                        </div>
                                                    </div>

        if(this.state.modalWindowForMainPhotoRemove){
            return modalWindowNotificationForRemovePhoto
        }



        const modalWindowNotificationForModificationPhoto=<div className="modal-window-for-opton-main-photo">
                                                                <div className="modal-window-for-opton-main-photo__cancel">
                                                                    <img src={cancel} alt="cancel" onClick={()=>this.modalWindowForModificationPhotoClose}/>
                                                                </div>
                                                                <div className="modal-window-for-opton-main-photo__text_final">
                                                                    Фото успешно изменено!
                                                                </div>
                                                            </div>

        if(this.state.userNotificationForModificationPhoto){
            return modalWindowNotificationForModificationPhoto
        }

        const blockSaveNewPhoto=<div className="modal-window-for-opton-main-photo">
                                    <div className="modal-window-for-opton-main-photo__text">
                                        Вы выбрали новое фото: {this.state.nameNewPhoto}
                                    </div>
                                    <div className="modal-window-for-opton-main-photo__wrapper__btn">
                                        <button onClick={this.postNewPhotoProfile} className="modal-window-for-opton-main-photo__btn">Сохранить</button>
                                        <button onClick={this.cancelChoiceNewPhoto} className="modal-window-for-opton-main-photo__btn">Отменить</button>
                                    </div>
                                </div>

        if(this.state.nameNewPhoto!==undefined && this.state.nameNewPhoto!==null && this.state.nameNewPhoto.length>0){
            return blockSaveNewPhoto
        }

        const modalModification=<div className="modal-window-for-opton-main-photo">
                                    <div onClick={this.modalWindowForModificationMainPhotoClose} className="modal-window-for-opton-main-photo__cancel">
                                        <img src={cancel} alt="cancel" onClick={this.modalWindowForModificationMainPhotoClose}/>
                                    </div>
                                    <div className="modal-window-for-opton-main-photo__text_final">
                                        Пожалуйста, выберите новое фото!
                                    </div>
                                    <div className="modal-window-for-opton-main-photo__wrapper__input-file">
                                        <form>
                                            <input  name="photo" 
                                                    type="file" 
                                                    accept="image/jpeg,image/png" 
                                                    onChange={this.valueNameAndContentPhoto}
                                                    id="inputFile"
                                                    className="modal-window-for-opton-main-photo__input-file__input"
                                            />
                                            <label htmlFor="inputFile" className="modal-window-for-opton-main-photo__wrapper__input-file__label">
                                                <span className="modal-window-for-opton-main-photo__wrapper__input-file__label_img"><img src={download} alt="inputFile"/></span>
                                                <div className="modal-window-for-opton-main-photo__wrapper__input-file__label_border"></div>
                                                <span className="modal-window-for-opton-main-photo__wrapper__input-file__label_name">Выберите файл</span>
                                            </label>
                                        </form>
                                    </div>
                                    {ModalWindowMessageInvalidFile}
                                </div>

        
        const modalQuestonRemovePhoto=<div className="modal-window-for-opton-main-photo">
                                        <div className="modal-window-for-opton-main-photo__text">Вы уверены, что хотите удалить фото?</div>
                                        <div className="modal-window-for-opton-main-photo__wrapper__btn">
                                            <button onClick={this.confirmationRemovePhoto} className="modal-window-for-opton-main-photo__btn">Удалить фото</button>
                                            <button onClick={this.modalWindowForQuestonRemovePhotoClose} className="modal-window-for-opton-main-photo__btn">Отмена</button>
                                        </div>
                                    </div>

        const removePhoto=<button onClick={this.modalWindowForQuestonRemovePhotoOpen} className="modal-window-for-opton-main-photo__btn">Удалить фото</button>

        if( this.state.modalWindowForMainPhotoModification){
            return modalModification
        }

        if(this.state.modalWindowQuestonRemovePhoto){
            return modalQuestonRemovePhoto
        }

        const removePhotoBtn=this.props.listRights.canRemovePhoto ? removePhoto : null;
        return(
            <div className="modal-window-for-opton-main-photo">
                <div className="modal-window-for-opton-main-photo__cancel">
                    <img src={cancel} alt="cancel" onClick={this.modalWindowForOptonsMainPhotoClose}/>
                </div>
                <div className="modal-window-for-opton-main-photo__text">
                    Действия:
                </div>
                <div className="modal-window-for-opton-main-photo__wrapper__btn">
                    <button onClick={this.modalWindowModificationMainPhoto} className="modal-window-for-opton-main-photo__btn">Обновить фото</button>
                    {removePhotoBtn}
                </div>
            </div>
        )
    }
    
}


const mapStateToProps=(state)=>{
    return{
        listRights: state.listRights,
        id: state.userId,
    }
}

const mapDispatchToProps={
    modalWindowForMainPhotoOptionsClose,
    photoUser,
    rights
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(ModalWindowForOptonMainPhoto));