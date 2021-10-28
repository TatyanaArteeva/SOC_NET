import React, {Component} from 'react';
import { connect } from 'react-redux';
import {actionTransitionModification} from '../../actions';
import './modalWindowTransitionModification.scss';

class ModalWindowTransitionModification extends Component{
   
    render(){
        let classModal="transition";
        return(
            <div className={classModal}>
                <div className="transition__modal">
                    <div className="transition__modal__text">
                        {this.props.title}
                    </div>
                    <div className="transition__modal__wrapper">
                        <button className="transition__modal__btn" onClick={()=>this.props.actionTransitionModification(true)}>Да</button>
                        <button className="transition__modal__btn" onClick={()=>this.props.actionTransitionModification(false)}>Нет</button>
                    </div>
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