import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import ModalWindowTransitionModification from '../modalWindowTransitionModification/modalWindowTransitionModification';
import { connect } from 'react-redux';
import {actionTransitionModification} from '../../actions';


const PromptNav=({when, actionTransitionModification, actionTransitionModificationState})=>{
    const history = useHistory();
    const location=useLocation()
    const [showPrompt, setShowPrompt]=useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const [permissionShowPrompt, setPermissionShowPrompt]=useState(false)

    useEffect(()=>{
        if(when){
            history.block((prompt)=>{
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

    console.log(location)


    useEffect(()=>{
        if(actionTransitionModificationState===true){
            actionTransitionModification('');
            history.block(() => {});
            history.push(currentPath);      
        }

        if(actionTransitionModificationState===false){
            actionTransitionModification(''); 
            setPermissionShowPrompt(false)
            
        }

    }, [actionTransitionModificationState])


    return showPrompt ? (
        <ModalWindowTransitionModification
            title={"Вы уверены, что хотите покинуть страницу модификации?"}
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