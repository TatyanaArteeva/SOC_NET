
import React, {Component} from 'react';
import './photoUser.scss';
import {connect} from 'react-redux';
import { modalWindowForMainPhotoOptionsOpen, photoUser, infoRelation } from '../../actions';
import ModalWindowForOptonMainPhoto from '../ModalWindowForOptonMainPhoto/ModalWindowForOptonMainPhoto';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";

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

        this.componentDidUpdate=(prevProps)=>{
            if(prevProps.idForPhoto!==this.props.idForPhoto || "#" + this.props.match.params.id){
                this.inf()
            }
            
        }

        this.addFriends=()=>{
            console.log("add")
            Service.postAddFriend(`/api/friend/addFriend/${this.props.idForPhoto}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                            .then(res=>{
                                if(res.status===200){
                                    this.props.infoRelation(res.data.info);
                                    console.log(this.props.info)
                                }
                            })
                    }
                })
        }

        this.cancelAddFriends=()=>{
            console.log("cancel")
            Service.postCancelAddFriend(`/api/friend/removeFriend/${this.props.idForPhoto}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                            .then(res=>{
                                if(res.status===200){
                                    this.props.infoRelation(res.data.info);
                                    console.log(this.props.info)
                                }
                            })
                    }
                })
        }

        this.deleteFriends=()=>{
            console.log("delete")

            Service.postDeleteFriend(`/api/friend/removeFriend/${this.props.idForPhoto}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                        .then(res=>{
                            if(res.status===200){
                                this.props.infoRelation(res.data.info);
                                console.log(this.props.info)
                            }
                        })
                }
            })
        }

        this.rejectFriends=()=>{
            Service.postDeleteFriend(`/api/friend/rejectFriend/${this.props.idForPhoto}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${this.props.idForPhoto}/page-info`)
                        .then(res=>{
                            if(res.status===200){
                                this.props.infoRelation(res.data.info);
                                console.log(this.props.info)
                            }
                        })
                }
            })
        }

    }

    render(){

        let btnActionsElementsPage=null;
        let modalWindowForMainPhotoModification=null;
        let btnActionRejectFriend=null;
        if(this.props.modalWindowForMainPhotoOptions){
            modalWindowForMainPhotoModification=<ModalWindowForOptonMainPhoto/>;
        }
        const editingPhotoBtn=<button onClick={this.changePhoto} className="add_photo">Редактировать фото</button>;
        const btnAddFriends=<button onClick={this.addFriends} className="add_photo">Добавить в друзья</button>;
        const btnCancelAddFriends=<button onClick={this.cancelAddFriends} className="add_photo">Отменить заявку</button>;
        const btnConfirmAddFriends=<button onClick={this.addFriends} className="add_photo">Подтвердить друга</button>;
        const btnRejectFriend=<button onClick={this.rejectFriends} className="add_photo">Отклонить друга</button>;
        const btnDeleteFriends= <button onClick={this.deleteFriends} className="add_photo">Удалить из друзей</button>;
        if(this.props.listRights.canModify){
            btnActionsElementsPage=editingPhotoBtn;
        }

        if(this.props.info.friendRelationStatus==="NO_RELATION"){
            btnActionsElementsPage=btnAddFriends;
        }

        if(this.props.info.friendRelationStatus==="OUTPUT"){
            btnActionsElementsPage=btnCancelAddFriends;
        }

        if(this.props.info.friendRelationStatus==="INPUT"){
            btnActionsElementsPage=btnConfirmAddFriends;
            btnActionRejectFriend=btnRejectFriend
        }
        if(this.props.info.friendRelationStatus==="FULL"){
            btnActionsElementsPage=btnDeleteFriends;
        }
        
        return(
            <div>
                <div className="photo"><img className="photoUser" src={this.props.photo}  alt="photoUser"/></div>
                {btnActionsElementsPage}
                {btnActionRejectFriend}
                {modalWindowForMainPhotoModification}
            </div>
        )
    }

   
    
}

const mapStateToProps=(state)=>{
    return{
        modalWindowForMainPhotoOptions:state.modalWindowForMainPhotoOptions,
        listRights: state.listRights,
        photo: state.photoUser,
        info: state.infoRelation
    }
}

const mapDispatchToProps={
    modalWindowForMainPhotoOptionsOpen,
    photoUser,
    infoRelation
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PhotoUser)));