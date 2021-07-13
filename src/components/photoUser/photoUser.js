
import React, {Component} from 'react';
import './photoUser.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsOpen, photoUser } from '../../actions';
import ModalWindowForOptonMainPhoto from '../ModalWindowForOptonMainPhoto/ModalWindowForOptonMainPhoto';
import WithService from '../hoc/hoc';

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
                    this.props.photoUser(newFormatPhoto)
                });
                
        }

        this.componentDidMount=()=>{
            this.inf()
        }

    }

    render(){

        let btnActionsElementsPage=null;
        let modalWindowForMainPhotoModification=null;
        if(this.props.btnFunctionality==="user"){
            if(this.props.modalWindowForMainPhotoOptions){
                modalWindowForMainPhotoModification=<ModalWindowForOptonMainPhoto/>;
            }
            const editingPhotoBtn=<button onClick={this.changePhoto} className="add_photo">Редактировать фото</button>;
            if(this.props.listPhotoRights.canChangePhoto){
                btnActionsElementsPage=editingPhotoBtn;
            }
            
        }

        if(this.props.btnFunctionality==="friends"){
            // if(this.props.modalWindowForMainPhotoOptions){
            //     modalWindowForMainPhotoModification=<ModalWindowForOptonMainPhoto/>;
            // }
            const interactionsBtn=<button className="add_photo">добавить в друзья</button>;
            // if(this.props.listPhotoRights.canChangePhoto){
                btnActionsElementsPage=interactionsBtn;
            // }
            
        }
        

        return(
            <div>
                <div className="photo"><img className="photoUser" src={this.props.photo}  alt="photoUser"/></div>
                {btnActionsElementsPage}
                {modalWindowForMainPhotoModification}
            </div>
        )
    }

   
    
}

const mapStateToProps=(state)=>{
    return{
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