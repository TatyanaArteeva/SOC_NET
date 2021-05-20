import React, {Component} from 'react';
import RegistrationWindow from '../registrationWindow/registrationWindow';
import './login_page.css';
import {connect} from 'react-redux';
import {openModalRegistration, loginMainPage, errorWindowLoginOpen, errorWindowLoginClose, userId, userAccesses} from '../../actions';
import MainPage from '../main_page/mainPage';
import WithService from '../hoc/hoc';


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
            Service.loginPage('http://localhost:8080/api/login', formData)
            .then(res=>{
                if(res.status===200){
                    Service.getCurrentUserStatus('http://localhost:8080/api/status')
                    .then(res=>{
                        if(res.status===200){
                            this.props.userId(res.data.currentAccount.id);
                            this.props.userAccesses(res.data.accesses)
                        }
                    }).then(res=>{
                        this.props.loginMainPage()
                    })
                }
            }).catch(err=>this.props.errorWindowLoginOpen())
        }
    }

    render(){

        if(this.props.mainPage){
            return <MainPage/>
        }

        const {registrationWindow, openModalRegistration, loginErrorWindow}=this.props;

        const regWin=registrationWindow ? <RegistrationWindow/> : null;
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
                    <button onClick = { ()=> openModalRegistration() }>Создать аккаунт</button>
                </div>
        )
    }
    
}

const mapStateToProps = (state) => {
    return {
        registrationWindow: state.windowRegistrationOpen,
        mainPage: state.loginMainPage,
        loginErrorWindow: state.loginErrorWindow
    }
}

const mapDispatchToProps = {
    openModalRegistration, 
    loginMainPage,
    errorWindowLoginOpen,
    errorWindowLoginClose,
    userId,
    userAccesses  
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(LoginPage));