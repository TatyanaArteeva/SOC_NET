import React, { Component } from 'react';
import './dropDownMenuHeader.scss';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { inputMessageObj, openAndCloseDropDownMenu } from '../../actions';

class DropDownMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseLeaveBlockMenu: true
        }

        const { idUser, openAndCloseDropDownMenu, history } = this.props;

        this.componentDidUpdate = () => {
            window.addEventListener('click', this.checkDownMouse())
        }

        this.goToHome = () => {
            history.push(`/${idUser}`);
            openAndCloseDropDownMenu(false)
        }

        this.goToFriends = () => {
            history.push('/friends/')
            openAndCloseDropDownMenu(false)
        }

        this.goToMessages = () => {
            history.push('/dialogs')
            openAndCloseDropDownMenu(false)
        }

        this.goToGroups = () => {
            history.push('/groups/')
            openAndCloseDropDownMenu(false)
        }

        this.inBlock = () => {
            this.setState({
                mouseLeaveBlockMenu: true
            })
        }

        this.outBlock = () => {
            this.setState({
                mouseLeaveBlockMenu: false
            })
        }

        this.checkDownMouse = () => {
            if (this.state.mouseLeaveBlockMenu === false) {
                openAndCloseDropDownMenu(false)
                this.setState({
                    mouseLeaveBlockMenu: true
                })
            }
        }
    }

    render() {
        
        let countMessage = null;

        const { inputMessageCount } = this.props;

        if (inputMessageCount.length > 0) {
            countMessage = inputMessageCount.length
        }

        return (
            <div className="drop-down-menu"
                onMouseEnter={this.inBlock}
                onMouseLeave={this.outBlock}>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item"
                        src={home} alt="Домой"
                        onClick={this.goToHome}
                    />
                    <span className="drop-down-menu__menu__item__label">Домой</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item"
                        src={friends} alt="Друзья"
                        onClick={this.goToFriends}
                    />
                    <span className="drop-down-menu__menu__item__label">Друзья</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item"
                        src={messages}
                        alt="Письма"
                        onClick={this.goToMessages}
                    />
                    <span className="drop-down-menu__menu__item__count">
                        {countMessage}
                    </span>
                    <span className="drop-down-menu__menu__item__label">Письма</span>
                </div>
                <div className="drop-down-menu__menu__wrapper">
                    <img className="drop-down-menu__menu__item"
                        src={group}
                        alt="Группы"
                        onClick={this.goToGroups}
                    />
                    <span className="drop-down-menu__menu__item__label">Группы</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        inputMessageCount: state.inputMessageObj,
        dropDownMenu: state.dropDownMenu
    }
}

const mapDispatchToProps = {
    inputMessageObj,
    openAndCloseDropDownMenu
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DropDownMenu));