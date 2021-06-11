import React, {useState} from 'react';
import './ModalWindowForOptonMainPhoto.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsClose, modalWindowForModificationMainPhotoOpen, modalWindowForModificationMainPhotoClose, modalWindowForQuestonRemovePhotoOpen, modalWindowForQuestonRemovePhotoClose, photoUser } from '../../actions';
import WithService from '../hoc/hoc';

const ModalWindowForOptonMainPhoto=({Service ,modalWindowForMainPhotoOptionsClose, modalWindowForModificationMainPhotoOpen, modalWindowForModificationMainPhotoClose, modalWindowForMainPhotoModification, modalWindowQuestonRemovePhoto, modalWindowForQuestonRemovePhotoOpen, modalWindowForQuestonRemovePhotoClose, listPhotoRights, id, photoUser})=>{

    const [valueNewPhoto, setValueNewPhoto]=useState();
    const [nameNewPhoto, setNameNewPhoto]=useState()
   
    function modalWindowModificationMainPhoto(){
        modalWindowForModificationMainPhotoOpen()
    }

    function modalWindowForOptonsMainPhotoClose(){
        modalWindowForMainPhotoOptionsClose();
    }

    function modalWindowForQuestonRemovePhoto(){
        modalWindowForQuestonRemovePhotoOpen()
    }

    function postNewPhotoProfile(event){
        event.preventDefault();
        const formData=new FormData();
        formData.append("photo", valueNewPhoto)

        Service.postNewPhotoProfile(`/api/account/${id}/change-photo`, formData)
            .then(res=>{
                if(res.status===200){
                    const inf=async ()=>{
                        const res=await Service.getAccountPhoto(`/api/account/${id}/photo`, {
                            responseType: 'arraybuffer'
                            })
                            .then(response => Buffer.from(response.data, 'binary').toString('base64'));
                            const newFormatPhoto="data:image/jpg;base64," + res;
                            photoUser(newFormatPhoto)
                            }
                    inf()
                }
            })

    }

    const blockSaveNewPhoto=<div className="ModalWindowForOptonMainPhoto">
                                Вы выбрали новое фото профиля: {nameNewPhoto}
                                <div>
                                    <button onClick={postNewPhotoProfile}>Сохранить</button>
                                </div>
                            </div>

    if(nameNewPhoto!==undefined && nameNewPhoto!==null && nameNewPhoto.length>0){
        return blockSaveNewPhoto
    }
    
    const modalModification=<div className="ModalWindowForOptonMainPhoto">
                                <span onClick={modalWindowForModificationMainPhotoClose}>Закрыть</span>
                                <div>Пожалуйста, выберите фото для своего профиля!</div>
                                <div>
                                    <input  name="photo" 
                                            type="file" 
                                            accept="image/jpeg,image/png" 
                                            onChange={(event)=>{
                                                        setValueNewPhoto(event.target.files[0]);
                                                        setNameNewPhoto(event.target.value)
                                                        }
                                            }
                                    />
                                </div>
                            </div>

    const modalQuestonRemovePhoto=<div className="ModalWindowForOptonMainPhoto">
                                    <div>Вы уверены, что хотите удалить фото?</div>
                                    <div>
                                        <button>Удалить фото</button>
                                        <button onClick={modalWindowForQuestonRemovePhotoClose}>Отмена</button>
                                    </div>
                                </div>

    const removePhoto=<button onClick={modalWindowForQuestonRemovePhoto}>Удалить фото</button>

    if( modalWindowForMainPhotoModification){
        return modalModification
    }

    if(modalWindowQuestonRemovePhoto){
        return modalQuestonRemovePhoto
    }

    const removePhotoBtn=listPhotoRights.canRemovePhoto ? removePhoto : null;
    
    return(
        <div className="ModalWindowForOptonMainPhoto">
            <span onClick={modalWindowForOptonsMainPhotoClose}>Закрыть</span>
            <div>
                <button onClick={modalWindowModificationMainPhoto}>Обновить фото</button>
                {removePhotoBtn}
            </div>
        </div>
    )

}

const mapStateToProps=(state)=>{
    return{
        modalWindowForMainPhotoModification: state.modalWindowForMainPhotoModification,
        modalWindowQuestonRemovePhoto: state.modalWindowQuestonRemovePhoto,
        listPhotoRights: state.listPhotoRights,
        id: state.userId,
    }
}

const mapDispatchToProps={
    modalWindowForMainPhotoOptionsClose,
    modalWindowForModificationMainPhotoOpen,
    modalWindowForModificationMainPhotoClose,
    modalWindowForQuestonRemovePhotoOpen,
    modalWindowForQuestonRemovePhotoClose,
    photoUser
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(ModalWindowForOptonMainPhoto));