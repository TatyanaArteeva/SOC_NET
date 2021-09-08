import React, {Component} from 'react';
import { connect } from 'react-redux';
import {actionTransitionModification} from '../../actions';
import './modalWindowTransitionModification.scss';

class ModalWindowTransitionModification extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        let classModal="transition";
        // if(this.props.visible===true){
        //     classModal+=" active"
        // }
        return(
            <div className={classModal}>
                <div className="transition__wrapper">
                    {this.props.title}
                    <button onClick={()=>this.props.actionTransitionModification(true)}>Да</button>
                    <button onClick={()=>this.props.actionTransitionModification(false)}>Нет</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{

    }
}

const mapDispatchToProps = {
    actionTransitionModification
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindowTransitionModification);