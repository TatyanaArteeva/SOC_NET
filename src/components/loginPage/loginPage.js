import React, { Component } from 'react';
import RegistrationWindow from '../registrationWindow/registrationWindow';
import './loginPage.scss';
import { connect } from 'react-redux';
import {
    openModalRegistration,
    loginMainPage,
    errorWindowLoginOpen,
    errorWindowLoginClose,
    userId,
    userAccesses,
    closeWindowMessageRegistration,
    userInformation,
    userEmail,
    subscribe,
    unsubscribe
} from '../../actions';
import MainPage from '../mainPage/mainPage';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import cancel from './cancel.svg';
import Spinner from '../spinner/spinner';
import sunflower from './sunflower.svg';
import LoginPageDeviz from '../loginPageDeviz/loginPageDeviz';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            rememberMe: false,
            hiddenPassword: true,
            spinner: false,
            errorMessage: ''
        }

        const {
            Service,
            history,
            errorWindowLoginClose,
            subscribe,
            userId,
            userAccesses,
            userInformation,
            userEmail,
            loginMainPage,
            errorWindowLoginOpen,
            closeWindowMessageRegistration,
        } = this.props;

        this.componentDidUpdate = () => {
            if (this.props.logoutStatus && this.props.location.pathname !== '/' && !this.props.mainPage) {
                history.push("")
            }
        }

        this.valueLogin = (event) => {
            errorWindowLoginClose()
            this.setState({
                login: event.target.value,
                errorMessage: ''
            })
        }

        this.valuePassword = (event) => {
            errorWindowLoginClose()
            this.setState({
                password: event.target.value,
                errorMessage: ''
            })
        }

        this.valueRememberMe = () => {
            this.setState({
                rememberMe: !this.state.rememberMe
            })
        }

        this.postFormLogin = (event) => {
            localStorage.clear();
            if (this.state.password.length >= 5) {
                event.preventDefault();
                const formData = new FormData();
                const loginObj = {
                    login: this.state.login,
                    password: this.state.password,
                    rememberMe: this.state.rememberMe
                }
                for (let key in loginObj) {
                    formData.append(key, loginObj[key])
                }
                this.setState({
                    spinner: true
                })
                Service.loginPage('/api/login', formData)
                    .then(res => {
                        if (res.status === 200) {
                            Service.getCurrentUserStatus('/api/status')
                                .then(res => {
                                    if (res.status === 200) {
                                        localStorage.setItem('remmemberMeUser', this.state.rememberMe)
                                        localStorage.setItem("idUser", res.data.currentAccount.id)
                                        subscribe()
                                        userId(res.data.currentAccount.id);
                                        userAccesses(res.data.accesses);
                                        userInformation(res.data.currentAccount);
                                        userEmail(res.data.currentAccount.email)
                                    }
                                }).then(res => {
                                    this.setState({
                                        rememberMe: false,
                                        spinner: false
                                    })
                                    loginMainPage()
                                })
                        }
                    }).catch(err => {
                        const error = errorMessageForUser(err.response.data.code);
                        this.setState({
                            spinner: false,
                            errorMessage: error
                        })
                        errorWindowLoginOpen()
                    })
            }
        }

        this.toggleShowPassword = () => {
            this.setState({
                hiddenPassword: !this.state.hiddenPassword
            })
        }

        this.closeModalWindowRegistration = (e) => {
            const modal = document.querySelector('.registration-successfully__modal');
            const modalWrapper = document.querySelector('.registration-successfully__modal__wrapper');
            const modalMessage = document.querySelector('.registration-successfully__modal__message');
            if (e.target !== modal && e.target !== modalWrapper && e.target !== modalMessage) {
                closeWindowMessageRegistration()
            }
        }
    }

    render() {

        const {
            registrationWindow,
            openModalRegistration,
            loginErrorWindow,
            mainPage,
            registrationOk,
            closeWindowMessageRegistration } = this.props;

        const { errorMessage, password, hiddenPassword, spinner } = this.state;

        if (mainPage) {
            return <MainPage />
        }

        const registrationModalWindow = registrationWindow ? <RegistrationWindow /> : null;

        const windowRegistrationMessage = registrationOk ?
            <div className="registration-successfully" onClick={this.closeModalWindowRegistration}>
                <div className="registration-successfully__modal">
                    <div className="registration-successfully__modal__wrapper">
                        <span className="registration-successfully__modal__close"
                            onClick={() => { closeWindowMessageRegistration() }}>
                            <img src={cancel} alt="cancel" />
                        </span>
                        <div className="registration-successfully__modal__message">
                            Вы успешно зарегистрированы.
                            Пожалуйста, войдите на страницу!
                        </div>
                    </div>
                </div>
            </div>
            : null;

        let passwordRequirements = <div className="passwordRequirements">
            Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
        </div>

        if (loginErrorWindow) {
            passwordRequirements = <div className="passwordRequirements">
                {errorMessage}
            </div>
        }

        if (!loginErrorWindow && password.length >= 5) {
            passwordRequirements = <div className="passwordRequirements_null"></div>;
        }

        let contentLoginPage = null;

        if (!registrationWindow) {
            contentLoginPage = <>
                <form onSubmit={this.postFormLogin} className="login-page__form">
                    <h2 className="registration-window__modal__title">Вход</h2>
                    <input className="login-page__form__input"
                        onChange={this.valueLogin}
                        placeholder="Введите свой e-mail"
                        type="email"
                        name="login"
                        required
                    />
                    <div>
                        <input className="login-page__form__input__password"
                            onChange={this.valuePassword}
                            placeholder="Введите пароль"
                            type={hiddenPassword ? 'password' : 'text'}
                            name="password"
                            required

                        />
                        <span className="login-page__form__input__show"
                            onClick={this.toggleShowPassword}>
                            {hiddenPassword ? <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>Показать пароль</title>
                                <path fill="#89d8c2" d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
                            </svg>
                                :
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <title>Скрыть пароль</title>
                                    <path fill="#026670" d="M29.561 0.439c-0.586-0.586-1.535-0.586-2.121 0l-6.318 6.318c-1.623-0.492-3.342-0.757-5.122-0.757-6.979 0-13.028 4.064-16 10 1.285 2.566 3.145 4.782 5.407 6.472l-4.968 4.968c-0.586 0.586-0.586 1.535 0 2.121 0.293 0.293 0.677 0.439 1.061 0.439s0.768-0.146 1.061-0.439l27-27c0.586-0.586 0.586-1.536 0-2.121zM13 10c1.32 0 2.44 0.853 2.841 2.037l-3.804 3.804c-1.184-0.401-2.037-1.521-2.037-2.841 0-1.657 1.343-3 3-3zM3.441 16c1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 1.715 0.54 3.304 1.459 4.607l-1.904 1.904c-1.639-1.151-3.038-2.621-4.114-4.323z"></path>
                                    <path fill="#026670" d="M24 13.813c0-0.849-0.133-1.667-0.378-2.434l-10.056 10.056c0.768 0.245 1.586 0.378 2.435 0.378 4.418 0 8-3.582 8-8z"></path>
                                    <path fill="#026670" d="M25.938 9.062l-2.168 2.168c0.040 0.025 0.079 0.049 0.118 0.074 1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303-1.208 0-2.403-0.149-3.561-0.439l-2.403 2.403c1.866 0.671 3.873 1.036 5.964 1.036 6.978 0 13.027-4.064 16-10-1.407-2.81-3.504-5.2-6.062-6.938z"></path>
                                </svg>
                            }
                        </span>
                    </div>
                    {passwordRequirements}
                    <div className="login-page__form__remmember-me">
                        <input onChange={this.valueRememberMe}
                            type="checkbox"
                            id="remmember_me"
                            name="rememberMe"
                            className="login-page__form__remmember-me__input"
                            checked={this.state.rememberMe}
                        />
                        <label htmlFor="remmember_me"
                            className="login-page__form__remmember-me__label">
                            Запомнить меня
                        </label>
                    </div>
                    <button className="login-page__form__submit" type="submit">Войти</button>
                    <hr />
                </form>
                {windowRegistrationMessage}
                <div>
                    <div className="login-page__offer-to-registration__question">
                        <hr />
                        Нет аккаунта?
                        <hr />
                    </div>
                    <button onClick={() => openModalRegistration()}
                        className="login-page__offer-to-registration__button">
                        Создать аккаунт
                    </button>
                </div>
            </>
        }

        const content = spinner ? <Spinner /> : contentLoginPage

        return (
            <>
                <div className="label">
                    <img className="label__icon label__icon__animation"
                        src={sunflower}
                        alt="icon"
                    />
                    <span className="label__text"><LoginPageDeviz /></span>
                </div>
                <div className="login-page">
                    {content}
                    {registrationModalWindow}
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
        registrationOk: state.registrationSuccessful,
        logoutStatus: state.logout,
        notAuthorization: state.notAuthorization
    }
}

const mapDispatchToProps = {
    openModalRegistration,
    loginMainPage,
    errorWindowLoginOpen,
    errorWindowLoginClose,
    userId,
    userAccesses,
    closeWindowMessageRegistration,
    userInformation,
    userEmail,
    subscribe,
    unsubscribe
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(LoginPage)))