import React, { Component } from 'react';
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import eye from './eye.svg';
import eyeBlocked from './eyeBlocked.svg';
import Spinner from '../spinner/spinner';

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

        let modalWindowIdenticalEmail=null;

        if(this.state.modalWindowIdenticalEmail){
            modalWindowIdenticalEmail=<div>
                                        <button onClick={this.closeModalWindowEdenticalEmail}>Закрыть</button>
                                        Текущая почта и новая идентичны!
                                    </div>
        }

        if (this.state.modalWindowNewEmailIsNull === true) {
            modalWindowNewEmailIsNull = <div>
                <div>новый Email не был введен!</div>
                <div>
                    <button onClick={this.closeModalWindowNewEmailIsNull}>Закрыть</button>
                </div>
            </div>
        }

        if (this.state.modalWindowSuccessfullyEmailChanged) {
            modalWindowSuccessfullyEmailChanged = <div>
                <div>Email успешно изменен!</div>
                <div>
                    <button onClick={this.closeModalWindowSuccessfullyEmailChange}>Закрыть</button>
                </div>
            </div>
        }

        let newEmailBlock = null;
        if (this.state.modificationEmail) {
            newEmailBlock = <div>
                <form onSubmit={this.modificationEmail}>
                    <label>
                        Введите новый E-mail:
                        <input placeholder="Введите новый E-mail" type="email" onChange={this.valueNewEmail} required />
                    </label>
                    <button type="submit">Сохранить</button>
                </form>
                <button onClick={this.closeModificationEmail}>Отменить</button>
            </div>
        }

        let modalWindowSuccessfullyPasswordChange = null;
        if (this.state.modalWindowSuccessfullyPasswordChanged) {
            modalWindowSuccessfullyPasswordChange = <div>
                <button onClick={this.closeModalWindowSuccessfullyPaswordChange}>Закрыть</button>
                Пароль успешно изменен!
            </div>
        }

        let modalWindowInvalidPasswordMessage = null;

        if (this.state.invalidPasswordMessage) {
            modalWindowInvalidPasswordMessage = <div>
                <button onClick={this.closeMessageInvalidPassword}>Закрыть</button>
                Пароль содержит не допустимые символы!
            </div>
        }


        let newPasswordBlock = null;

        let passwordRequirements = null;
        if (this.state.newPassword.length < 5) {
            passwordRequirements = <div>
                Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
            </div>
        }

        let passwordDontMatchMessageModalWindow = null;

        if (this.state.passwordDontMatchMessage) {
            passwordDontMatchMessageModalWindow = <div>
                Пароли не совпадают!
                <button onClick={this.closeMessagepasswordDontMatch}>Закрыть</button>
            </div>
        }

        if (this.state.modificationPassword) {
            newPasswordBlock = <div>
                <form onSubmit={this.modificationPassword}>
                    <label>
                        {passwordRequirements}
                        Введите старый пароль:
                        <input  placeholder="Введите старый пароль" 
                                type={this.state.hiddenOldPassword ? 'password' : 'text'}
                                onChange={this.valueOldPassword} 
                                required />
                        <span onClick={this.toggleShowOldPassword}><img src={this.state.hiddenOldPassword ? eye : eyeBlocked} alt="eye"/></span>
                    </label>
                    <label>
                        Введите новый пароль:
                        <input  placeholder="Введите новый пароль" 
                                type={this.state.hiddenNewPassword? 'password' : 'text'}
                                onChange={this.valueNewPassword} 
                                required />
                        <span onClick={this.toggleShowNewPassword}><img src={this.state.hiddenNewPassword ? eye : eyeBlocked} alt="eye"/></span>
                    </label>
                    <label>
                        Повторите новый пароль:
                        <input  placeholder="Повторите новый пароль" 
                                type={this.state.hiddenRepiatNewPassword? 'password' : 'text'}
                                onChange={this.repiatValueNewPassword} 
                                required />
                        <span onClick={this.toggleShowRepiatNewPassword}><img src={this.state.hiddenRepiatNewPassword ? eye : eyeBlocked} alt="eye"/></span>
                    </label>
                    <button type="submit">Сохранить</button>
                </form>
                <button onClick={this.closeModificationPassword}>Отменить</button>
            </div>
        }

        let buttonModificationEmail = <button onClick={this.openModificationEmail}>Изменить E-mail</button>;
        if (this.state.modificationEmail) {
            buttonModificationEmail = null;
        }

        let buttonModificationPassword = <button onClick={this.openModificationPassword}>Изменить пароль</button>;
        if (this.state.modificationPassword) {
            buttonModificationPassword = null;
        }

        let modalWindowIdenticalPassword=null;

        if(this.state.modalWindowIdenticalPassword){
            modalWindowIdenticalPassword=<div>
                                            <button onClick={this.closeModalWindowIdenticalPassword}>Закрыть</button>
                                            Старый пароль и новый идентичны!
                                            </div>
        }

        const contentModificationEmail=<div>
                                    Изменение E-mail:
                                    <br />
                                    <hr />
                                    Ваш текущий E-mail: <span>{this.state.email}</span>
                                    {buttonModificationEmail}
                                    {newEmailBlock}
                                    {modalWindowSuccessfullyEmailChanged}
                                    {modalWindowNewEmailIsNull}
                                    {modalWindowIdenticalEmail}
                                </div>

        const contentModificationPassword=<div>
                                            Изменение пароля:
                                            <br />
                                            <hr />
                                            {buttonModificationPassword}
                                            {newPasswordBlock}
                                            {modalWindowInvalidPasswordMessage}
                                            {passwordDontMatchMessageModalWindow}
                                            {modalWindowSuccessfullyPasswordChange}
                                            {modalWindowIdenticalPassword}
                                        </div>

        const allContent=<>
                            {contentModificationEmail}
                            {contentModificationPassword}
                        </>
        const content=this.state.spinner ? <Spinner/> : allContent;
        // const contentPassword=this.state.spinnerEmail ? <SpinnerPassword/> : contentModificationPassword;
        return (
            <div>
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
