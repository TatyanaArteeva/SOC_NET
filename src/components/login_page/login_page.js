import React, {Component} from 'react';
import RegistrationWindow from '../registrationWindow/registrationWindow';
import './login_page.css';
import {connect} from 'react-redux';
import {openModalRegistration, loginMainPage} from '../../actions';
import MainPage from '../main_page/mainPage';
import Service from '../../service/service';


class LoginPage extends Component  {

    constructor(props){
        super(props);
        this.state={
            login: '',
            password: '',
            rememberMe: false 
        }

        const service=new Service();

        this.valueLogin=(event)=>{
            this.setState({
                login: event.target.value
            })
        }

        this.valuePassword=(event)=>{
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
            service.loginPage('http://localhost:3000/networkLog', this.state)
            .then(res=>{
                if(res.status===201){
                    console.log("Переходим на основную страницу")
                    this.props.loginMainPage()
                }else{
                    console.log("Что-то пошло не так!")
                }
            })
        }
    }



    render(){

        if(this.props.mainPage){
            return <MainPage/>
        }

        const {registrationWindow, openModalRegistration}=this.props;

        const regWin=registrationWindow ? <RegistrationWindow/> : null;

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
                        <a href="#">Забыли пароль?</a>
                        <hr/>
                    </form>
                    {regWin}
                    <button onClick = { ()=> openModalRegistration() }>Создать аккаунт</button>
                </div>
        )
    }
    
}

const mapStateToProps = (state) => {
    return {
        registrationWindow: state.windowRegistrationOpen,
        mainPage: state.loginMainPage
    }
}

const mapDispatchToProps = {
    openModalRegistration, 
    loginMainPage
}

export default connect (mapStateToProps, mapDispatchToProps)(LoginPage);