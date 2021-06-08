import React, {Component} from 'react';
import RegistrationWindow from '../registrationWindow/registrationWindow';
// import './login_page.css';
import {connect} from 'react-redux';
import {openModalRegistration, loginMainPage, errorWindowLoginOpen, errorWindowLoginClose, userId, userAccesses, closeWindowMessageRegistration, userInformation} from '../../actions';
import MainPage from '../main_page/mainPage';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";


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
                        if(res.status===200){
                            this.props.userId(res.data.currentAccount.id);
                            this.props.userAccesses(res.data.accesses);
                            this.props.userInformation(res.data.currentAccount)
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
                this.props.history.push({hash: ""})
        }

        if(this.props.mainPage){
            return <MainPage/>
        }

        const {registrationWindow, openModalRegistration, loginErrorWindow}=this.props;

        const regWin=registrationWindow ? <RegistrationWindow/> : null;

        const windowRegistrationMessage=this.props.registrationOk? 
        <div className ="registrationWindow">
            Вы успешно зарегестрированы, пожалуйста, войдите на страницу!
            <div onClick={()=>{this.props.closeWindowMessageRegistration()}}>Закрыть!</div>
        </div> 
        : null;

        const errorWindowLogin=loginErrorWindow? <div>Введен неправильный логин или пароль</div> : null;
        return(
                <div className = "login_page">
                    <div>
                        Привет! Вы находитесь на стартовой странице моей социальной сети! 
                        Для того,чтобы начать ей пользоваться, войдите или зарегистрируйтесь!
                    </div>
                    <form onSubmit={this.postFormLogin}>
                        <input onChange={this.valueLogin} placeholder="Введите свой e-mail" type="email" name="login" required/>
                        <input onChange={this.valuePassword} placeholder="Введите пароль" type="password" name="password" required/>
                        <div> <input onChange={this.valueRememberMe} type="checkbox" name="rememberMe"/>Запомнить меня</div>
                        <button type="submit">Войти</button>
                        {errorWindowLogin}
                        <a href="#abc">Забыли пароль?</a>
                        <hr/>
                    </form>
                    {regWin}
                    {windowRegistrationMessage}
                    <button onClick = { ()=> openModalRegistration() }>Создать аккаунт</button>
                </div>
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
    userInformation
}

export default  withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(LoginPage)));