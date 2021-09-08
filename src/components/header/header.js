import React, {Component} from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import {logout, displayingLoginAndRegistrationPage, inputMessageObj, unsubscribe, inputNotificationObj, pathLink} from '../../actions';
import { withRouter } from "react-router";
import './header.scss';
import logo from './leaf.svg';
import arrow from './arrow.svg';
import HeaderSearch from '../headerSearch/headerSearch';
import UserNotificationsList from '../userNotificationsList/userNotificationsList';

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

        return (
            <header>
                <nav className="header">
                    <div><img src={logo} alt="logo" className="header__logo"/></div>
                    <HeaderSearch/>
                    <ul className="header__menu">
                        <div className="header__menu__wrapper">
                            <h1 className="header__menu__wrapper__button">Меню <img src={arrow} alt="arrow"/>{countMessage}</h1>
                            <ul className="header__menu__wrapper__list">
                                {/* <HashRouter> */}
                                    <li className="header__menu__wrapper__list__item" onClick={()=>this.props.pathLink(`${id}`)}><Link to={id}>Моя страница</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/friends" onClick={()=>this.props.pathLink("/friends")}>Друзья</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/messages" onClick={()=>this.props.pathLink("/messages")}>Сообщения</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/groups" onClick={()=>this.props.pathLink("/groups")}>Группы</Link></li>
                                {/* </HashRouter> */}
                            </ul>
                        </div>
                    </ul>
                    <button onClick={this.openNotificationsList}>Уведомления {countNotifications}</button>
                    {listNotifications}
                    <button onClick={()=>this.goToSettings()}>Настройки</button>
                    <button onClick={()=>this.exit()}>Выход</button>
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
        inputNotificationObjCount: state.inputNotificationObj
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