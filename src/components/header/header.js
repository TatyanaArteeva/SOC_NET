import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import {
    logout,
    displayingLoginAndRegistrationPage,
    inputMessageObj,
    unsubscribe,
    inputNotificationObj,
    pathLink,
    openAndCloseDropDownMenu,
    mouseLeaveNotificationsList
} from '../../actions';
import { withRouter } from "react-router";
import './header.scss';
import HeaderSearch from '../headerSearch/headerSearch';
import UserNotificationsList from '../userNotificationsList/userNotificationsList';
import home from './home.svg';
import friends from './friends.svg';
import messages from './message.svg';
import group from './group.svg';
import notifications from './bell.svg';
import settings from './settings.svg';
import exit from './exit.svg';
import sunflower from './sunflower.svg';
import menu from './menu.svg';
import menuNotNull from './menuNotNull.svg';
import DropDownMenu from '../dropDownMenuHeader/dropDownMenuHeader';

class Header extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            openNotificationsList: false
        }

        const {
            Service,
            inputMessageObj,
            inputNotificationObj,
            mouseLeaveNotificationsList,
            unsubscribe,
            logout,
            history,
            openAndCloseDropDownMenu } = this.props;

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            Service.getUnreadMessage('/api/message/get-unaccepted-messages')
                .then(res => {
                    if (this._cleanupFunction) {
                        if (res.status === 200) {
                            res.data.forEach(el => {
                                inputMessageObj(el)
                            })
                        }
                    }
                })
            Service.getUnacceptedNotifications('/api/notification/getUnacceptedNotifications')
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            res.data.forEach(el => {
                                inputNotificationObj(el)
                            })
                        }
                    }
                })
        }

        this.componentDidUpdate = () => {
            if (this.props.mouseLeaveNotificationsListstate && this.state.openNotificationsList) {
                this.closeListNotifications()
            }
        }

        this.componentWillUnmount = () => {
            this._cleanupFunction = false;
        }

        this.exit = () => {
            Service.logoutRequest('api/logout')
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            unsubscribe();
                            localStorage.clear();
                            logout();
                            history.push('');
                        }
                    }
                })
        }

        this.goToSettings = () => {
            history.push('/modificationEmailAndPassword')
        }

        this.openNotificationsList = () => {
            if(!this.state.openNotificationsList){
                this.setState({
                    openNotificationsList: true
                })
            }else{
                this.setState({
                    openNotificationsList: false
                })
            }
        }

        this.toggleDropDownMenu = () => {
            openAndCloseDropDownMenu(!this.props.dropDownMenu)
        }

        this.closeListNotifications = () => {
            this.setState({
                openNotificationsList: false
            })
            mouseLeaveNotificationsList(false)
        }
    }

    render() {

        const {
            idUser,
            inputMessageCount,
            inputNotificationObjCount,
            dropDownMenu } = this.props;

        const { openNotificationsList } = this.state;

        const id = `/account/${idUser}`;
        let countMessage = null;
        let menuItem = menu;
        let countNotifications = null;
        let listNotifications = null;
        let dropDownMenuBlock = null;

        if (inputMessageCount.length > 0) {
            countMessage = inputMessageCount.length;
            menuItem = menuNotNull;
        }

        if (inputNotificationObjCount.length > 0) {
            countNotifications = inputNotificationObjCount.length
        }

        if (openNotificationsList) {
            listNotifications = <UserNotificationsList />
        }

        if (dropDownMenu) {
            dropDownMenuBlock = <DropDownMenu />
        }

        return (
            <header>
                <nav className="header">
                    <img src={sunflower}
                        alt="logo"
                        className="header__logo"
                    />
                    <div className="header__menu__wrapper">
                        <div className="header__menu__item" >
                            <img src={notifications}
                                alt="notifications"
                                onClick={this.openNotificationsList}
                                className="img__notifications"
                            />
                            <span className="header__menu__item__count_notifications"
                                onClick={this.openNotificationsList}>
                                {countNotifications}
                            </span>
                            <span className="header__menu__item__label">
                                Уведомления
                            </span>
                        </div>
                    </div>
                    {listNotifications}
                    <div className="header__menu">
                        <div className="header__menu__wrapper">
                            <div className="header__menu__item">
                                <Link to={id}>
                                    <img src={home}
                                        alt="Домой"
                                    />
                                </Link>
                                <span className="header__menu__item__label">Домой</span>
                            </div>
                        </div>
                        <div className="header__menu__wrapper">
                            <div className="header__menu__item">
                                <Link to="/friends/">
                                    <img src={friends}
                                        alt="Друзья"
                                    />
                                </Link>
                                <span className="header__menu__item__label">Друзья</span>
                            </div>
                        </div>
                        <div className="header__menu__wrapper">
                            <div className="header__menu__item">
                                <Link to="/dialogs">
                                    <img src={messages}
                                        alt="Письма"
                                    />
                                    <span className="header__menu__item__count">
                                        {countMessage}
                                    </span>
                                </Link>
                                <span className="header__menu__item__label">Письма</span>
                            </div>
                        </div>
                        <div className="header__menu__wrapper">
                            <div className="header__menu__item">
                                <Link to="/groups/">
                                    <img
                                        src={group}
                                        alt="Группы"
                                    />
                                </Link>
                                <span className="header__menu__item__label">Группы</span>
                            </div>
                        </div>
                    </div>
                    <HeaderSearch />
                    <div className="header__menu__mini-size">
                        <img className="header__menu__item"
                            src={menuItem}
                            alt="menu"
                            onClick={()=>this.toggleDropDownMenu()}
                        />
                        {dropDownMenuBlock}
                    </div>
                    <div className="header__menu__settings-and-exit">
                        <div className="header__menu__settings-and-exit">
                            <div className="header__menu__wrapper">
                                <div className="header__menu__item">
                                    <img src={settings}
                                        alt="Настройки"
                                        onClick={() => this.goToSettings()}
                                    />
                                    <span className="header__menu__item__label">
                                        Настройки
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="header__menu__wrapper">
                            <div className="header__menu__item">
                                <img src={exit}
                                    alt="Выход"
                                    onClick={() => this.exit()}
                                />
                                <span className="header__menu__item__label_last">
                                    Выход
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        logoutStatus: state.logout,
        mainPage: state.loginMainPage,
        inputMessageCount: state.inputMessageObj,
        inputNotificationObjCount: state.inputNotificationObj,
        mouseLeaveNotificationsListstate: state.mouseLeaveNotificationsList,
        dropDownMenu: state.dropDownMenu
    }
}

const mapDispatchToProps = {
    logout,
    displayingLoginAndRegistrationPage,
    inputMessageObj,
    unsubscribe,
    inputNotificationObj,
    pathLink,
    openAndCloseDropDownMenu,
    mouseLeaveNotificationsList
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Header)))