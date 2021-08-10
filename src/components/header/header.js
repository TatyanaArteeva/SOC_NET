import React, {Component} from 'react';
import { HashRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import App from '../app/App';
import {logout, displayingLoginAndRegistrationPage} from '../../actions';
import { withRouter } from "react-router";
import './header.scss';
import logo from './leaf.svg';
import arrow from './arrow.svg';
import HeaderSearch from '../headerSearch/headerSearch';

class Header extends Component{

    constructor(props){
        super(props);

        const {Service} = this.props;

        this.exit=()=>{

            Service.logoutRequest('api/logout')
                .then(res=>{
                    if(res.status===200){
                        localStorage.clear()
                        this.props.logout();
                    }
                })
        }

        this.goToSettings=()=>{
            this.props.history.push('/modificationEmailAndPassword')
        }

    }
    
    render(){
 
        const {idUser}=this.props;
        const id=`/${idUser}`;

        return (
            <header>
                <nav className="header">
                    <div><img src={logo} alt="logo" className="header__logo"/></div>
                    <HeaderSearch/>
                    <ul className="header__menu">
                        <div className="header__menu__wrapper">
                            <h1 className="header__menu__wrapper__button">Меню <img src={arrow} alt="arrow"/></h1>
                            <ul className="header__menu__wrapper__list">
                                <HashRouter>
                                    <li className="header__menu__wrapper__list__item"><Link to={id}>Моя страница</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/friends">Друзья</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/messages">Сообщения</Link></li>
                                    <li className="header__menu__wrapper__list__item"><Link to="/groups"> Группы</Link></li>
                                </HashRouter>
                            </ul>
                        </div>
                    </ul>
                    <button onClick={this.goToSettings}>Настройки</button>
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
    }
}

const mapDispatchToProps={
        logout,
        displayingLoginAndRegistrationPage
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Header)));