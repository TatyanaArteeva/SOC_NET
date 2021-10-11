import React, { Component } from 'react';
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import eye from './eye.svg';
import eyeBlocked from './eyeBlocked.svg';
import Spinner from '../spinner/spinner';
import './modificationEmailAndPassword.scss';
import cancel from './cancel.svg';

class ModificationEmailAndPasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            accountId: '',
            modificationEmail: false,
            modificationPassword: false,
            newEmail: '',
            oldPassword: '',
            newPassword: '',
            repiatNewPassword: '',
            modalWindowSuccessfullyEmailChanged: false,
            modalWindowNewEmailIsNull: false,
            invalidPasswordMessage: false,
            passwordDontMatchMessage: false,
            modalWindowSuccessfullyPasswordChanged: false,
            modalWindowIdenticalEmail: false,
            modalWindowIdenticalPassword:false,
            hiddenOldPassword: true,
            hiddenNewPassword: true,
            hiddenRepiatNewPassword: true,
            spinner:false,
        }


        const { Service } = this.props;


        this.componentDidMount = () => {
            Service.getUserAccountId(this.props.id)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            email: res.data.email,
                            accountId: res.data.id
                        })
                    }
                })
        }


        this.openModificationEmail = () => {
            this.setState({
                modificationEmail: true
            })
        }

        this.openModificationPassword = () => {
            this.setState({
                modificationPassword: true
            })
        }

        this.closeModificationEmail = () => {
            this.setState({
                modificationEmail: false,
                newEmail: ''
            })
        }

        this.closeModificationPassword = () => {
            this.setState({
                modificationPassword: false,
                oldPassword: '',
                newPassword: '',
                repiatNewPassword: ''
            })
        }

        this.valueNewEmail = (e) => {
            this.setState({
                newEmail: e.target.value
            })
        }

        this.valueOldPassword = (e) => {
            this.setState({
                oldPassword: e.target.value
            })
        }

        this.valueNewPassword = (e) => {
            this.setState({
                newPassword: e.target.value
            })
        }

        this.repiatValueNewPassword = (e) => {
            this.setState({
                repiatNewPassword: e.target.value
            })
        }

        this.closeModalWindowSuccessfullyEmailChange = () => {
            this.setState({
                modalWindowSuccessfullyEmailChanged: false
            })
        }

        this.closeModalWindowNewEmailIsNull = () => {
            this.setState({
                modalWindowNewEmailIsNull: false
            })
        }

        this.closeModalWindowEdenticalEmail=()=>{
            this.setState({
                modalWindowIdenticalEmail: false
            })
        }

        this.modificationEmail = (e) => {
            e.preventDefault();
            if (this.state.newEmail.length > 0) {
                if(this.state.email===this.state.newEmail){
                    console.log("одинаковые майлы")
                    this.setState({
                        modalWindowIdenticalEmail: true
                    })
                }else{
                    this.setState({
                        spinner:true
                    })
                    const emailModificationObj = {
                        email: this.state.newEmail,
                        accountId: this.state.accountId
                    }
                    Service.postModificationUser('/api/account/change-credentials', emailModificationObj)
                        .then(res => {
                            if (res.status === 200) {
                                this.setState({
                                    spinner:false,
                                    modalWindowSuccessfullyEmailChanged: true,
                                    modificationEmail: false,
                                    newEmail: ''
                                })
                                setTimeout(this.closeModalWindowSuccessfullyEmailChange, 2000)
                                Service.getUserAccountId(this.props.id)
                                    .then(res => {
                                        if (res.status === 200) {
                                            console.log(res)
                                            this.setState({
                                                email: res.data.email,
                                                accountId: res.data.id
                                            })
                                        }
                                    })
                            }
                        })
                }
            }

            if (this.state.newEmail.length === 0) {
                e.preventDefault();
                this.setState({
                    modalWindowNewEmailIsNull: true,
                    modificationEmail: false,
                })
                setTimeout(this.closeModalWindowNewEmailIsNull, 2000)
            }
        }

        this.closeMessageInvalidPassword = () => {
            this.setState({
                invalidPasswordMessage: false
            })
        }

        this.closeMessagepasswordDontMatch = () => {
            this.setState({
                passwordDontMatchMessage: false
            })
        }

        this.closeModalWindowSuccessfullyPaswordChange = () => {
            this.setState({
                modalWindowSuccessfullyPasswordChanged: false
            })
        }

        this.closeModalWindowIdenticalPassword=()=>{
            this.setState({
                modalWindowIdenticalPassword: false
            })
        }

        this.updatingData = () => {
            const formData = new FormData();

            const newData = {
                login: this.state.email,
                password: this.state.newPassword,
                rememberMe: localStorage.getItem('remmemberMeUser')
            }

            for (let key in newData) {
                formData.append(key, newData[key])
            }

            Service.loginPage('/api/login', formData)
                .then(res => {
                    console.log("запрос на перелогин")
                    console.log(res)
                    if (res.status === 200) {
                        this.setState({
                            modalWindowSuccessfullyPasswordChanged: true,
                            modificationPassword: false,
                            oldPassword: '',
                            newPassword: '',
                            repiatNewPassword: '',
                        })
                    }
                })
        }

        this.modificationPassword = (e) => {
            e.preventDefault();
            if (this.state.newPassword.length >= 5 && this.state.repiatNewPassword.length >= 5) {
                console.log("length")
                const OneInvalidSymbol = ' ';
                const twoInvalidSymbol = '    ';
                const valuePassword = this.state.newPassword;
                let validPassword = false;
                const oneCheck = valuePassword.indexOf(OneInvalidSymbol);
                const twoCheck = valuePassword.indexOf(twoInvalidSymbol);
                if (oneCheck === -1 && twoCheck === -1) {
                    validPassword = true;
                    console.log(validPassword)
                    console.log(this.state)
                    if(this.state.oldPassword===this.state.newPassword){
                        this.setState({
                            modalWindowIdenticalPassword: true
                        })
                    }else{
                        if (this.state.newPassword === this.state.repiatNewPassword && validPassword===true) {
                            console.log("отправка")
                            const passwordModificationObj = {
                                email: this.state.email,
                                accountId: this.state.accountId,
                                newPassword: this.state.newPassword,
                                oldPassword: this.state.oldPassword
                            };
                            console.log(passwordModificationObj)
                            this.setState({
                                spinner:true
                            })
                            Service.postModificationUser('/api/account/change-credentials', passwordModificationObj)
                                .then(res => {
                                    if (res.status === 200) {
                                        console.log("пароль заменили");
                                        console.log(res)
                                        console.log(this.state)
                                        this.setState({
                                            spinner:false
                                        })
                                        this.updatingData()
                                    }
                                })
                        } else {
                            this.setState({
                                passwordDontMatchMessage: true
                            })
                        }
                    }
                } else {
                    console.log(validPassword)
                    this.setState({
                        invalidPasswordMessage: true
                    })
                }
            } else {
                return
            }
        }

        this.toggleShowOldPassword=()=>{
            this.setState({
                hiddenOldPassword: !this.state.hiddenOldPassword
            })
        }

        this.toggleShowNewPassword=()=>{
            this.setState({
                hiddenNewPassword: !this.state.hiddenNewPassword
            })
        }

        this.toggleShowRepiatNewPassword=()=>{
            this.setState({
                hiddenRepiatNewPassword: !this.state.hiddenRepiatNewPassword
            })
        }

    }


    render() {

        console.log(this.state)

        if (this.state.modalWindowSuccessfullyPasswordChanged) {
            setTimeout(this.closeModalWindowSuccessfullyPaswordChange, 2000)
        }

        if (this.state.invalidPasswordMessage) {
            setTimeout(this.closeMessageInvalidPassword, 2000)
        }

        if (this.state.passwordDontMatchMessage) {
            setTimeout(this.closeMessagepasswordDontMatch, 2000)
        }

        if(this.state.modalWindowIdenticalEmail){
            setTimeout(this.closeModalWindowEdenticalEmail, 2000)
        }

        if(this.state.modalWindowIdenticalPassword){
            setTimeout(this.closeModalWindowIdenticalPassword, 2000)
        }

        let modalWindowSuccessfullyEmailChanged = null;

        let modalWindowNewEmailIsNull = null;

        let modalWindowIdenticalEmail=<div></div>;

        if(this.state.modalWindowIdenticalEmail){
            modalWindowIdenticalEmail= <div className="modification-email-and-password__warning">
                                            Текущая почта и новая идентичны!
                                        </div>
        }

        if (this.state.modalWindowNewEmailIsNull === true) {
            modalWindowNewEmailIsNull = <div className="modification-email-and-password__warning">
                                            <div>новый Email не был введен!</div>
                                        </div>
        }

        if (this.state.modalWindowSuccessfullyEmailChanged) {
            modalWindowSuccessfullyEmailChanged =   <div className="modification-email-and-password__modal-successfully">
                                                        <div className="modification-email-and-password__modal-successfully__window">
                                                            <img onClick={this.closeModalWindowSuccessfullyEmailChange} className="modification-email-and-password__modal-successfully__window__close" src={cancel} alt="cancel"/>
                                                            <div className="modification-email-and-password__modal-successfully__window__message">
                                                                Email успешно изменен!
                                                            </div>
                                                        </div>
                                                    </div>
        }

        let inputExistentEmail=null;

        // if(сдесь будет приходить ответ от сервера, что такой мэйл уже существует){
        //     inputExistentEmail=<div className="modification-email-and-password__warning">
        //                             <div>этот E-mail занят</div>
        //                         </div>
        // }

        let newEmailBlock = null;
        if (this.state.modificationEmail) {
            newEmailBlock = <div>
                <form onSubmit={this.modificationEmail}>
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">
                            Введите новый E-mail:
                        </label>
                        <input  placeholder="Введите новый E-mail" 
                                type="email" 
                                onChange={this.valueNewEmail} 
                                required 
                                className="modification-email-and-password__input"
                                />
                        {modalWindowNewEmailIsNull}
                        {modalWindowIdenticalEmail}
                        {inputExistentEmail}
                        <div className="modification-email-and-password__message">
                            Ваш текущий E-mail: <span>{this.state.email}</span>
                        </div>
                    </div>
                    <div className="modification-email-and-password__btns__wrapper">
                        <button type="submit" className="modification-email-and-password__btns__item">Сохранить</button>
                    </div>
                </form>
            </div>
        }

        let modalWindowSuccessfullyPasswordChange = null;
        if (this.state.modalWindowSuccessfullyPasswordChanged) {
            modalWindowSuccessfullyPasswordChange = <div className="modification-email-and-password__modal-successfully">
                                                        <div className="modification-email-and-password__modal-successfully__window">
                                                            <img onClick={this.closeModalWindowSuccessfullyPaswordChange} className="modification-email-and-password__modal-successfully__window__close" src={cancel} alt="cancel"/>
                                                            <div className="modification-email-and-password__modal-successfully__window__message">
                                                                Пароль успешно изменен!
                                                            </div>
                                                        </div>
                                                    </div>
        }

        let modalWindowInvalidPasswordMessage = null;

        if (this.state.invalidPasswordMessage) {
            modalWindowInvalidPasswordMessage = <div className="modification-email-and-password__warning">
                                                    Новый пароль содержит не допустимые символы!
                                                </div>
        }


        let newPasswordBlock = null;

        let passwordRequirements = <div></div>;
        if (this.state.newPassword.length < 5) {
            passwordRequirements =  <div className="modification-email-and-password__warning">
                                        Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
                                    </div>
        }

        let passwordDontMatchMessageModalWindow = null;

        if (this.state.passwordDontMatchMessage) {
            passwordDontMatchMessageModalWindow = <div className="modification-email-and-password__warning">
                                                    Пароли не совпадают!
                                                  </div>
        }

        let modalWindowIdenticalPassword=null;

        if(this.state.modalWindowIdenticalPassword){
            modalWindowIdenticalPassword=<div className="modification-email-and-password__warning">
                                            Старый пароль и новый идентичны!
                                        </div>
        }

        let modalWindowErrorInputOldPassword=null;

        // if(здесь будет ошибка от сервера о том, что старый пароль введен не верно){
        //     modalWindowErrorInputOldPassword=<div className="modification-email-and-password__warning">
        //                                         Старый пароль введен не верно!
        //                                     </div>
        // }

        if (this.state.modificationPassword) {
            newPasswordBlock = <div>
                <form onSubmit={this.modificationPassword}>
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">Введите старый пароль:</label>
                       <span className="modification-email-and-password__external-block__wrapper-input">
                            <input  placeholder="Введите старый пароль" 
                                    type={this.state.hiddenOldPassword ? 'password' : 'text'}
                                    onChange={this.valueOldPassword} 
                                    required 
                                    className="modification-email-and-password__input_password"
                                    />
                            <span onClick={this.toggleShowOldPassword} className="modification-email-and-password__input_show">
                                <img src={this.state.hiddenOldPassword ? eye : eyeBlocked} alt="eye"/>
                            </span>
                            {modalWindowErrorInputOldPassword}
                       </span>
                    </div>
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">Введите новый пароль:</label>
                        <span className="modification-email-and-password__external-block__wrapper-input">
                            <input  placeholder="Введите новый пароль" 
                                type={this.state.hiddenNewPassword? 'password' : 'text'}
                                onChange={this.valueNewPassword} 
                                required 
                                className="modification-email-and-password__input_password"
                                />
                            <span onClick={this.toggleShowNewPassword} className="modification-email-and-password__input_show"><img src={this.state.hiddenNewPassword ? eye : eyeBlocked} alt="eye"/></span>
                            {passwordRequirements}
                            {modalWindowInvalidPasswordMessage}
                            {modalWindowIdenticalPassword}
                        </span>
                    </div>
                    <div className="modification-email-and-password__external-block">
                    <label className="modification-email-and-password__external-block__label">Повторите новый пароль:</label>
                        <span className="modification-email-and-password__external-block__wrapper-input">
                            <input  placeholder="Повторите новый пароль" 
                                type={this.state.hiddenRepiatNewPassword? 'password' : 'text'}
                                onChange={this.repiatValueNewPassword} 
                                required 
                                className="modification-email-and-password__input_password"
                                />
                            <span onClick={this.toggleShowRepiatNewPassword} className="modification-email-and-password__input_show"><img src={this.state.hiddenRepiatNewPassword ? eye : eyeBlocked} alt="eye"/></span>
                            {passwordDontMatchMessageModalWindow}
                        </span>
                    </div>
                    <div className="modification-email-and-password__btns__wrapper">
                        <button type="submit" className="modification-email-and-password__btns__item">Сохранить</button>
                    </div>
                </form>
            </div>
        }
        let buttonModificationEmail = <button onClick={this.openModificationEmail} className="modification-email-and-password__external-block__btn">
                                        Изменить E-mail
                                    </button>;
        if (this.state.modificationEmail) {
            buttonModificationEmail = <button onClick={this.closeModificationEmail} className="modification-email-and-password__external-block__btn">Отменить</button>
        }

        let buttonModificationPassword = <button onClick={this.openModificationPassword} className="modification-email-and-password__external-block__btn">
                                            Изменить пароль
                                        </button>;
        if (this.state.modificationPassword) {
            buttonModificationPassword = <button onClick={this.closeModificationPassword} className="modification-email-and-password__external-block__btn">Отменить</button>;
        }

        const contentModificationEmail=<div className="modification-email-and-password__email">
                                            <div className="modification-email-and-password__external-block">
                                                <label className="modification-email-and-password__external-block__label">
                                                    E-mail:
                                                </label>
                                                {buttonModificationEmail}
                                            </div>
                                            {newEmailBlock}
                                            {modalWindowSuccessfullyEmailChanged}
                                        </div>

        const contentModificationPassword=<div className="modification-email-and-password__password">
                                            <div className="modification-email-and-password__external-block">
                                                <label className="modification-email-and-password__external-block__label">
                                                    Пароля:
                                                </label>
                                                {buttonModificationPassword}
                                            </div>
                                            {newPasswordBlock}
                                            {modalWindowSuccessfullyPasswordChange}
                                        </div>

        const allContent=<>
                            {contentModificationEmail}
                            {contentModificationPassword}
                        </>
        const content=this.state.spinner ? <Spinner/> : allContent;
        // const contentPassword=this.state.spinnerEmail ? <SpinnerPassword/> : contentModificationPassword;
        return (
            <div className="modification-email-and-password">
                <h2 className="modification-email-and-password__title">Редактирование:</h2>
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userId,
    }
}
export default WithService()(connect(mapStateToProps)(ModificationEmailAndPasswordPage));
