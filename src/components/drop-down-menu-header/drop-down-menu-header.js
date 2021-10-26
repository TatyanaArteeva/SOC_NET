import React, {Component} from 'react';
import './drop-down-menu-header.scss';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';
import {connect} from 'react-redux';
import { withRouter } from "react-router";
import {inputMessageObj, openAndCloseDropDownMenu} from '../../actions';

class DropDownMenu extends Component{
    constructor(props){
        super(props);
        this.state={
            mouseLeaveBlockMenu: true
        }

        this.goToHome=()=>{
            this.props.history.push(`/${this.props.idUser}`);
            this.props.openAndCloseDropDownMenu(false)
        }

        this.goToFriends=()=>{
            this.props.history.push('/friends/')
            this.props.openAndCloseDropDownMenu(false)
        }

        this.goToMessages=()=>{
            this.props.history.push('/messages')
            this.props.openAndCloseDropDownMenu(false)
        }

        this.goToGroups=()=>{
            this.props.history.push('/groups/')
            this.props.openAndCloseDropDownMenu(false)
        }

        this.inBlock=()=>{
            this.setState({
                mouseLeaveBlockMenu: true
            })
        }

        this.outBlock=()=>{
            this.setState({
                mouseLeaveBlockMenu: false
            })
        }

        this.checkDownMouse=()=>{
            if(this.state.mouseLeaveBlockMenu===false){
                this.props.openAndCloseDropDownMenu(false)
                this.setState({
                    mouseLeaveBlockMenu: true
                })
            }
        }

        this.componentDidUpdate=()=>{
            window.addEventListener('click', this.checkDownMouse())
        }
    }

    render(){
        console.log(this.state.mouseLeaveBlockMenu)
        let countMessage=null;

        
        if(this.props.inputMessageCount.length>0){
            countMessage=this.props.inputMessageCount.length
        }

        return(
            <div className="drop-down-menu" onMouseEnter={this.inBlock} onMouseLeave={this.outBlock}>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item" src={home} alt="Домой" onClick={this.goToHome}/>
                    <span className="drop-down-menu__menu__item__label">Домой</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item" src={friends} alt="Друзья" onClick={this.goToFriends}/>
                    <span className="drop-down-menu__menu__item__label">Друзья</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item" src={messages} alt="Письма" onClick={this.goToMessages}/> 
                    <span className="drop-down-menu__menu__item__count">
                        {countMessage}
                     </span>
                    <span className="drop-down-menu__menu__item__label">Письма</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item" src={group} alt="Группы" onClick={this.goToGroups}/>
                    <span className="drop-down-menu__menu__item__label">Группы</span>
                </div>
            </div>
        )
    }
    
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId,
        inputMessageCount: state.inputMessageObj,
        dropDownMenu: state.dropDownMenu
    }
}

const mapDispatchToProps={
    inputMessageObj,
    openAndCloseDropDownMenu
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DropDownMenu));