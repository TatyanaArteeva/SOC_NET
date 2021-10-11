import React from 'react';
import './ModalWindowForMessageUser.scss';
import {connect} from 'react-redux';
import { modalWindowForUserNotificationClose } from '../../actions';
import { useHistory } from "react-router-dom";
import cancel from './cancel.svg';

const ModalWindowForMessageUser=({message, modalWindowForUserNotificationClose, id})=>{
    const { push } = useHistory();
    const idLink=`/${id}`;
    function closeModalWindow(){
        modalWindowForUserNotificationClose();
        push({
            pathname: `${idLink}`
        });
    }
    return(
      <div className="message">
          <div className="message__modal">
            <img onClick={closeModalWindow} className="message__modal__btn" alt="cancel" src={cancel}/>
            <div className="message__modal__message">{message}</div>
        </div>
      </div>
    )
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
    }
}

const mapDispatchToProps={
    modalWindowForUserNotificationClose
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalWindowForMessageUser);