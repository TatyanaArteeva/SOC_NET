import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import ModalWindowTransitionModification from '../modalWindowTransitionModification/modalWindowTransitionModification';
import { connect } from 'react-redux';
import {actionTransitionModification} from '../../actions';


const PromptNav=({when, actionTransitionModification, actionTransitionModificationState})=>{
    const history = useHistory();
    const [showPrompt, setShowPrompt]=useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const [permissionShowPrompt, setPermissionShowPrompt]=useState(false);

    useEffect(()=>{
        if(when===true){
            history.block((prompt)=>{
                console.log(prompt.pathname)
                setCurrentPath(prompt.pathname);
                setPermissionShowPrompt(true)
                return "true";       
            })
        }else{
            history.block(() => {});
        }

    },[when])




    useEffect(()=>{
        if(permissionShowPrompt===true){
            setShowPrompt(true);
        }else{
            setShowPrompt(false);
        }
    },[permissionShowPrompt])

    useEffect(()=>{
        if(actionTransitionModificationState===true){
            actionTransitionModification('');
            history.block(() => {});
            console.log(currentPath)
            history.push(currentPath);
        }

        if(actionTransitionModificationState===false){
            actionTransitionModification(''); 
            setPermissionShowPrompt(false)
        }

    }, [actionTransitionModificationState])


    return showPrompt ? (
        <ModalWindowTransitionModification
            title={"Вы уверены, что хотите покинуть страницу? Изменения не будут сохранены!"}
        />
    ): null;


}

const mapStateToProps=(state)=>{
    return{
        actionTransitionModificationState: state.actionTransitionModification
    }
}

const mapDispatchToProps = {
    actionTransitionModification
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptNav);