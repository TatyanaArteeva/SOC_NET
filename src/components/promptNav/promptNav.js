import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ModalWindowTransitionModification from '../modalWindowTransitionModification/modalWindowTransitionModification';
import { connect } from 'react-redux';
import { actionTransitionModification, popstate } from '../../actions';

const PromptNav = (
    {
        when,
        actionTransitionModification,
        actionTransitionModificationState,
        popstateStatus,
        popstate 
    }
) => {

    const history = useHistory();
    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const [permissionShowPrompt, setPermissionShowPrompt] = useState(false);

    useEffect(() => {
        if (when === true) {
            history.block((prompt) => {
                setCurrentPath(prompt.pathname);
                return "true";
            })
        } else {
            history.block(() => { });
        }
    }, [when, popstateStatus])

    useEffect(() => {
        if (currentPath.length > 0) {
            if (!popstateStatus) {
                setPermissionShowPrompt(true)
            } else {
                popstate(false)
                history.block(() => { });
                history.push(currentPath);
                setCurrentPath('');
            }
        }
    }, [currentPath, popstateStatus])

    useEffect(() => {
        if (permissionShowPrompt === true) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, [permissionShowPrompt])

    useEffect(() => {
        if (actionTransitionModificationState === true) {
            actionTransitionModification('');
            history.block(() => { });
            history.push(currentPath);
        }
        if (actionTransitionModificationState === false) {
            actionTransitionModification('');
            setCurrentPath('');
            setPermissionShowPrompt(false)
        }
    }, [actionTransitionModificationState])

    return showPrompt ? (
        <ModalWindowTransitionModification
            title={"Вы уверены, что хотите покинуть страницу? Изменения не будут сохранены!"}
        />
    ) : null;
}

const mapStateToProps = (state) => {
    return {
        actionTransitionModificationState: state.actionTransitionModification,
        popstateStatus: state.popstate
    }
}

const mapDispatchToProps = {
    actionTransitionModification,
    popstate
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptNav)