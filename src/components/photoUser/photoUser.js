import React from 'react';
import './photoUser.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsOpen, photoUser } from '../../actions';
import ModalWindowForOptonMainPhoto from '../ModalWindowForOptonMainPhoto/ModalWindowForOptonMainPhoto';
import WithService from '../hoc/hoc';


const PhotoUser=({ Service, id,  modalWindowForMainPhotoOptionsOpen, modalWindowForMainPhotoOptions, listPhotoRights, photoUser, photo})=>{

    function changePhoto(){
        modalWindowForMainPhotoOptionsOpen();
    }

    
    const inf=async ()=>{
        const res=await Service.getAccountPhoto(`/api/account/${id}/photo`, {
            responseType: 'arraybuffer'
            })
            .then(response => Buffer.from(response.data, 'binary').toString('base64'));
            const newFormatPhoto="data:image/jpg;base64," + res;
            photoUser(newFormatPhoto)
            }
    inf()
        
    
    
    const modalWindowForMainPhotoModification=modalWindowForMainPhotoOptions? <ModalWindowForOptonMainPhoto/> : null;

    const editingPhotoBtn=<button onClick={changePhoto} className="add_photo">Редактировать фото</button>

    const btnActionsElementsPage=listPhotoRights.canChangePhoto ? editingPhotoBtn : null;

    return(
        <div>
            <div className="photo"><img className="photoUser" src={photo}  alt="photoUser"/></div>
            {btnActionsElementsPage}
            {modalWindowForMainPhotoModification}
        </div>
    )
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
        modalWindowForMainPhotoOptions:state.modalWindowForMainPhotoOptions,
        listPhotoRights: state.listPhotoRights,
        photo: state.photoUser
    }
}

const mapDispatchToProps={
    modalWindowForMainPhotoOptionsOpen,
    photoUser
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(PhotoUser));