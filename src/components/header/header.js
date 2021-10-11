import React, {Component} from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import {logout, displayingLoginAndRegistrationPage, inputMessageObj, unsubscribe, inputNotificationObj, pathLink} from '../../actions';
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



class Header extends Component{

    constructor(props){
        super(props);

        this.state={
            openNotificationsList: false
        }

        const {Service} = this.props;

        this.exit=()=>{

            Service.logoutRequest('api/logout')
                .then(res=>{
                    if(res.status===200){
                        this.props.unsubscribe();
                        localStorage.clear()
                        this.props.logout();
                    }
                })
        }

        this.goToSettings=()=>{
            this.props.history.push('/modificationEmailAndPassword')
        }

        this.componentDidMount=()=>{
            Service.getUnreadMessage('/api/message/get-unaccepted-messages')
                .then(res=>{
                    if(res.status===200){
                        res.data.forEach(el=>{
                            this.props.inputMessageObj(el)
                        })
                    }
                })
            Service.getUnacceptedNotifications('/api/notification/getUnacceptedNotifications')
                .then(res=>{
                    if(res.status===200){
                        res.data.forEach(el=>{
                            this.props.inputNotificationObj(el)
                        })
                    }
                })
        }

        this.openNotificationsList=()=>{
            this.setState({
                openNotificationsList: !this.state.openNotificationsList
            })
        }

        this.componentDidUpdate=()=>{
            if(this.props.mouseLeaveNotificationsListstate){
                this.openNotificationsList()
            }
        }


    }
    
    render(){

        const {idUser}=this.props;
        const id=`/${idUser}`;

        let countMessage=null;

        
        if(this.props.inputMessageCount.length>0){
            countMessage=this.props.inputMessageCount.length
        }

        let countNotifications=null;

        if(this.props.inputNotificationObjCount.length>0){
            countNotifications=this.props.inputNotificationObjCount.length
        }

        let listNotifications=null;

        if(this.state.openNotificationsList){
            listNotifications=<UserNotificationsList/>
        }

        // if(this.props.mouseLeaveNotificationsList){
        //     listNotifications=null;
        // }

        
        return (
            <header>
                <nav className="header">
                    <div><img src={sunflower} alt="logo" className="header__logo"/></div>

                    <div className="header__menu__wrapper">
                            <img className="header__menu__item" src={notifications} alt="notifications" onClick={this.openNotificationsList}/> 
                            <span className="header__menu__item__count_notifications">
                                {countNotifications}
                            </span>
                            <span className="header__menu__item__label">
                                Уведомления
                            </span>
                    </div>
                        {listNotifications}

                    <div className="header__menu">
                        <div className="header__menu__wrapper">
                            <Link to={id}>
                                <img className="header__menu__item" src={home} alt="Домой"/>
                            </Link>
                            <span className="header__menu__item__label">Домой</span>
                        </div>
                        <div className="header__menu__wrapper">
                         <Link to="/friends/">
                             <img className="header__menu__item" src={friends} alt="Друзья"/>
                         </Link>
                         <span className="header__menu__item__label">Друзья</span>
                        </div>
                        <div className="header__menu__wrapper">
                            <Link to="/messages">
                                    <img className="header__menu__item" src={messages} alt="Письма"/> 
                                    <span className="header__menu__item__count">
                                        {countMessage}
                                    </span>
                            </Link>
                            <span className="header__menu__item__label">Письма</span>
                        </div>

                        <div className="header__menu__wrapper">
                            <Link to="/groups/">
                                <img className="header__menu__item" src={group} alt="Группы"/>
                            </Link>
                            <span className="header__menu__item__label">Группы</span>
                        </div>

                    </div>

                    <HeaderSearch/>

                    <div className="header__menu">
                        
                        <div className="header__menu">
                            <div className="header__menu__wrapper">
                                <img src={settings} alt="Настройки" onClick={()=>this.goToSettings()} className="header__menu__item"/>
                                <span className="header__menu__item__label">
                                    Настройки
                                </span>
                            </div>
                        </div>

                        <div className="header__menu__wrapper">
                            <img src={exit} alt="Выход" onClick={()=>this.exit()} className="header__menu__item"/>
                            <span className="header__menu__item__label_last">
                                Выход
                            </span>
                        </div>
                    </div>
                    
                </nav>
            </header>
        )


        
    }
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId,
        logoutStatus: state.logout,
        mainPage: state.loginMainPage,
        inputMessageCount: state.inputMessageObj,
        inputNotificationObjCount: state.inputNotificationObj,
        mouseLeaveNotificationsListstate: state.mouseLeaveNotificationsList
    }
}

const mapDispatchToProps={
        logout,
        displayingLoginAndRegistrationPage,
        inputMessageObj,
        unsubscribe,
        inputNotificationObj,
        pathLink
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Header)));