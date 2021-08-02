import React, {Component} from 'react';
import RegistrationWindow from '../registrationWindow/registrationWindow';
import './login_page.scss';
import {connect} from 'react-redux';
import {openModalRegistration, loginMainPage, errorWindowLoginOpen, errorWindowLoginClose, userId, userAccesses, closeWindowMessageRegistration, userInformation, userEmail} from '../../actions';
import MainPage from '../main_page/mainPage';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import icon from './icon.svg';
import error from './error.svg';
import leaf from './leaf.svg';


class LoginPage extends Component  {
    
    constructor(props){
        super(props);
        this.state={
            login: '',
            password: '',
            rememberMe: false 
        }

        const {Service} = this.props;

        this.valueLogin=(event)=>{
            this.props.errorWindowLoginClose()
            this.setState({
                login: event.target.value
            })
        }

        this.valuePassword=(event)=>{
            this.props.errorWindowLoginClose()
            this.setState({
                password: event.target.value
            })
        }

        this.valueRememberMe=()=>{
            this.setState({
                rememberMe: !this.state.rememberMe
            })
        }

        this.postFormLogin=(event)=>{
            event.preventDefault();
            const formData=new FormData();
           
            for(let key in this.state){
                formData.append(key, this.state[key])
            }
            Service.loginPage('/api/login', formData)
            .then(res=>{
                if(res.status===200){
                    Service.getCurrentUserStatus('/api/status')
                    .then(res=>{
                        console.log(res)
                        if(res.status===200){
                            this.props.userId(res.data.currentAccount.id);
                            this.props.userAccesses(res.data.accesses);
                            this.props.userInformation(res.data.currentAccount);
                            this.props.userEmail(res.data.currentAccount.email)
                        }
                    }).then(res=>{
                        this.props.loginMainPage()
                    })
                }
            }).catch(err=>this.props.errorWindowLoginOpen())
        }
    }

    render(){
        
        if(this.props.logoutStatus && this.props.location.hash.length!==0 && !this.props.mainPage){
                this.props.history.push("")
        }

        if(this.props.mainPage){
            return <MainPage/>
        }

        const {registrationWindow, openModalRegistration, loginErrorWindow}=this.props;

        const registrationModalWindow=registrationWindow ? <RegistrationWindow/> : null;

        const windowRegistrationMessage=this.props.registrationOk? 
        <div className ="registrationWindow">
            Вы успешно зарегестрированы, пожалуйста, войдите на страницу!
            <div onClick={()=>{this.props.closeWindowMessageRegistration()}}>Закрыть!</div>
        </div> 
        : null;

        const errorWindowLogin=loginErrorWindow? <div className="error-window-login">
                                                    Введен неправильный логин или пароль
                                                    <img src={error} alt="error"/>
                                                </div> : null;
        return(
            <>
                <div className="label">
                    <img className="label__icon label__icon__animation" src={leaf} alt="icon"/>
                    <h2 className="label__text">Общаясь - расцветай!</h2>
                </div>
                {errorWindowLogin}
                <div className = "login-page">
                    <form onSubmit={this.postFormLogin} className="login-page__form">
                        <input className="login-page__form__input" onChange={this.valueLogin} placeholder="Введите свой e-mail" type="email" name="login" required/>
                        <input className="login-page__form__input" onChange={this.valuePassword} placeholder="Введите пароль" type="password" name="password" required/>
                        <div className="login-page__form__remmember-me"> 
                            <input onChange={this.valueRememberMe} type="checkbox" id="remmember_me" name="rememberMe" className="login-page__form__remmember-me__input"/>
                            <label htmlFor="remmember_me" className="login-page__form__remmember-me__label">Запомнить меня</label>
                        </div>
                        <button className="login-page__form__submit" type="submit">Войти</button>
                        <hr/>
                    </form>
                    {registrationModalWindow}
                    {windowRegistrationMessage}
                    <div>
                        <div className="login-page__offer-to-registration__question">
                            <hr/>
                            Нет аккаунта?
                            <hr/>
                        </div>
                        <button onClick = {()=> openModalRegistration()} className="login-page__offer-to-registration__button">Создать аккаунт</button>
                    </div>
                </div>
            </>
        )
    }
    
}

const mapStateToProps = (state) => {
    return {
        registrationWindow: state.windowRegistrationOpen,
        mainPage: state.loginMainPage,
        loginErrorWindow: state.loginErrorWindow,
        idUser: state.userId,
        registrationOk:state.registrationSuccessful,
        logoutStatus: state.logout
    }
}

const mapDispatchToProps = {
    openModalRegistration, 
    loginMainPage,
    errorWindowLoginOpen,
    errorWindowLoginClose,
    userId,
    userAccesses,
    closeWindowMessageRegistration  ,
    userInformation,
    userEmail
}

export default  withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(LoginPage)));