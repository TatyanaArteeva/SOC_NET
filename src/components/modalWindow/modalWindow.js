import React from 'react';
import './modalWindow.scss';
import {connect} from 'react-redux';
import { modalWindowForUserNotificationClose } from '../../actions';
import { useHistory } from "react-router-dom";

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
      <div className="ModalWindowForMessageUser">
        <button onClick={closeModalWindow}>Закрыть</button>
        <div>{message}</div>
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