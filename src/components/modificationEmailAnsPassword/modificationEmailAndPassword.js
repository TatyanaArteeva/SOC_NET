import React, { Component } from 'react';
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import eye from './eye.svg';
import eyeBlocked from './eyeBlocked.svg';
import Spinner from '../spinner/spinner';
import './modificationEmailAndPassword.scss';
import cancel from './cancel.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import { checkingForAuthorization, unsubscribe } from '../../actions';

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
            modalWindowIdenticalPassword: false,
            hiddenOldPassword: true,
            hiddenNewPassword: true,
            hiddenRepiatNewPassword: true,
            hiddenCurrentPasswordForChangeEmail: true,
            spinner: false,
            errorMessageEmail: '',
            errorEmail: false,
            errorMessagePassword: '',
            errorPassword: false,
            currentPasswordForChangeEmail: '',
            invalidCurrentPasswordForChangeEmail: false,
        }

        const { Service, id, checkingForAuthorization, unsubscribe } = this.props;

        this.componentDidMount = () => {
            Service.getUserAccountId(id)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            email: res.data.email,
                            accountId: res.data.id
                        })
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
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

        this.closeModalWindowEdenticalEmail = () => {
            this.setState({
                modalWindowIdenticalEmail: false
            })
        }

        this.modificationEmail = (e) => {
            e.preventDefault();
            if (this.state.newEmail.length > 0) {
                if (this.state.email === this.state.newEmail) {
                    this.setState({
                        modalWindowIdenticalEmail: true
                    })
                } else {
                    if (this.state.currentPasswordForChangeEmail.length >= 5) {
                        const OneInvalidSymbol = ' ';
                        const twoInvalidSymbol = '    ';
                        const valuePassword = this.state.currentPasswordForChangeEmail;
                        const oneCheck = valuePassword.indexOf(OneInvalidSymbol);
                        const twoCheck = valuePassword.indexOf(twoInvalidSymbol);
                        if (oneCheck === -1 && twoCheck === -1) {
                            this.setState({
                                spinner: true
                            })
                            const emailModificationObj = {
                                email: this.state.newEmail,
                                accountId: this.state.accountId,
                                passwordForEmailChange: this.state.currentPasswordForChangeEmail
                            }
                            Service.postModificationUser('/api/account/change-credentials',
                                emailModificationObj)
                                .then(res => {
                                    if (res.status === 200) {
                                        this.updatingDataEmail()
                                    }
                                })
                                .catch(err => {
                                    if (err.response.status === 401) {
                                        unsubscribe()
                                        checkingForAuthorization();
                                    } else {
                                        const error = errorMessageForUser(err.response.data.code);
                                        this.setState({
                                            spinner: false,
                                            errorEmail: true,
                                            errorMessageEmail: error
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                invalidCurrentPasswordForChangeEmail: true
                            })
                        }
                    }
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

        this.closeModalWindowIdenticalPassword = () => {
            this.setState({
                modalWindowIdenticalPassword: false
            })
        }

        this.updatingDataEmail = () => {
            const formData = new FormData();
            const newData = {
                login: this.state.newEmail,
                password: this.state.currentPasswordForChangeEmail,
                rememberMe: localStorage.getItem('remmemberMeUser')
            }
            for (let key in newData) {
                formData.append(key, newData[key])
            }
            Service.loginPage('/api/login', formData)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            spinner: false,
                            modalWindowSuccessfullyEmailChanged: true,
                            modificationEmail: false,
                            newEmail: '',
                            currentPasswordForChangeEmail: ''
                        })
                        setTimeout(this.closeModalWindowSuccessfullyEmailChange, 2000)
                        Service.getUserAccountId(id)
                            .then(res => {
                                if (res.status === 200) {
                                    this.setState({
                                        email: res.data.email,
                                        accountId: res.data.id
                                    })
                                }
                            })
                    }
                })
                .catch(err => checkingForAuthorization(err.response.status))
        }

        this.updatingDataPassword = () => {
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
                .catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.modificationPassword = (e) => {
            e.preventDefault();
            if (this.state.newPassword.length >= 5 && this.state.repiatNewPassword.length >= 5) {
                const OneInvalidSymbol = ' ';
                const twoInvalidSymbol = '    ';
                const valuePassword = this.state.newPassword;
                let validPassword = false;
                const oneCheck = valuePassword.indexOf(OneInvalidSymbol);
                const twoCheck = valuePassword.indexOf(twoInvalidSymbol);
                if (oneCheck === -1 && twoCheck === -1) {
                    validPassword = true;
                    if (this.state.oldPassword === this.state.newPassword) {
                        this.setState({
                            modalWindowIdenticalPassword: true
                        })
                    } else {
                        if (this.state.newPassword === this.state.repiatNewPassword &&
                            validPassword === true) {
                            const passwordModificationObj = {
                                email: this.state.email,
                                accountId: this.state.accountId,
                                newPassword: this.state.newPassword,
                                oldPassword: this.state.oldPassword
                            };
                            this.setState({
                                spinner: true
                            })
                            Service.postModificationUser('/api/account/change-credentials',
                                passwordModificationObj)
                                .then(res => {
                                    if (res.status === 200) {
                                        this.setState({
                                            spinner: false
                                        })
                                        this.updatingDataPassword()
                                    }
                                })
                                .catch(err => {
                                    const error = errorMessageForUser(err.response.data.code)
                                    this.setState({
                                        spinner: false,
                                        errorPassword: true,
                                        errorMessagePassword: error
                                    })
                                    if (err.response.status === 401) {
                                        unsubscribe()
                                        checkingForAuthorization();
                                    }
                                })
                        } else {
                            this.setState({
                                passwordDontMatchMessage: true
                            })
                        }
                    }
                } else {
                    this.setState({
                        invalidPasswordMessage: true
                    })
                }
            } else {
                return
            }
        }

        this.toggleShowOldPassword = () => {
            this.setState({
                hiddenOldPassword: !this.state.hiddenOldPassword
            })
        }

        this.toggleShowNewPassword = () => {
            this.setState({
                hiddenNewPassword: !this.state.hiddenNewPassword
            })
        }

        this.toggleShowRepiatNewPassword = () => {
            this.setState({
                hiddenRepiatNewPassword: !this.state.hiddenRepiatNewPassword
            })
        }

        this.closeModalErrorModificationEmail = () => {
            this.setState({
                errorEmail: false,
                errorMessageEmail: ''
            })
        }

        this.closeModalErrorModificationPassword = () => {
            this.setState({
                errorPassword: false,
                errorMessagePassword: ''
            })
        }

        this.toggleShowCurrentPasswordForChangeEmail = () => {
            this.setState({
                hiddenCurrentPasswordForChangeEmail: !this.state.hiddenCurrentPasswordForChangeEmail
            })
        }

        this.valueCurrentPasswordForChangeEmail = (e) => {
            this.setState({
                currentPasswordForChangeEmail: e.target.value
            })
        }

        this.closeModalWindowInvalidCurrentPasswordForChangeEmail = () => {
            this.setState({
                invalidCurrentPasswordForChangeEmail: false
            })
        }
    }

    render() {

        let modalWindowSuccessfullyEmailChangedBlock = null;
        let modalWindowNewEmailIsNullBlock = null;
        let modalWindowIdenticalEmailBlock = <div></div>;
        let inputExistentEmail = null;
        let newEmailBlock = null;
        let modalWindowSuccessfullyPasswordChange = null;
        let modalWindowInvalidPasswordMessage = null;
        let newPasswordBlock = null;
        let passwordRequirements = <div></div>;
        let passwordRequirementsCurrentChangeEmail = <div></div>
        let passwordDontMatchMessageModalWindow = null;
        let modalWindowIdenticalPasswordBlock = null;
        let modalWindowErrorInputOldPassword = null;
        let modalWindowInvalidCurrentPasswordForChangeEmail = null;

        const {
            email,
            modificationEmail,
            modificationPassword,
            newPassword,
            modalWindowSuccessfullyEmailChanged,
            modalWindowNewEmailIsNull,
            invalidPasswordMessage,
            passwordDontMatchMessage,
            modalWindowSuccessfullyPasswordChanged,
            modalWindowIdenticalEmail,
            modalWindowIdenticalPassword,
            hiddenOldPassword,
            hiddenNewPassword,
            hiddenRepiatNewPassword,
            spinner,
            errorMessageEmail,
            errorEmail,
            errorMessagePassword,
            hiddenCurrentPasswordForChangeEmail,
            currentPasswordForChangeEmail,
            errorPassword,
            invalidCurrentPasswordForChangeEmail
        } = this.state;

        if (invalidCurrentPasswordForChangeEmail) {
            setTimeout(this.closeModalWindowInvalidCurrentPasswordForChangeEmail, 2000)
        }

        if (modalWindowSuccessfullyPasswordChanged) {
            setTimeout(this.closeModalWindowSuccessfullyPaswordChange, 2000)
        }

        if (invalidPasswordMessage) {
            setTimeout(this.closeMessageInvalidPassword, 2000)
        }

        if (passwordDontMatchMessage) {
            setTimeout(this.closeMessagepasswordDontMatch, 2000)
        }

        if (modalWindowIdenticalEmail) {
            setTimeout(this.closeModalWindowEdenticalEmail, 2000)
        }

        if (modalWindowIdenticalPassword) {
            setTimeout(this.closeModalWindowIdenticalPassword, 2000)
        }

        if (errorEmail) {
            setTimeout(this.closeModalErrorModificationEmail, 2000)
        }

        if (errorPassword) {
            setTimeout(this.closeModalErrorModificationPassword, 2000)
        }

        if (invalidCurrentPasswordForChangeEmail) {
            modalWindowInvalidCurrentPasswordForChangeEmail = <div className="modification-email-and-password__warning">
                Пароль содержит не допустимые символы!
            </div>
        }

        if (modalWindowIdenticalEmail) {
            modalWindowIdenticalEmailBlock = <div className="modification-email-and-password__warning">
                Текущая почта и новая идентичны!
            </div>
        }

        if (modalWindowNewEmailIsNull === true) {
            modalWindowNewEmailIsNullBlock = <div className="modification-email-and-password__warning">
                <div>новый Email не был введен!</div>
            </div>
        }

        if (modalWindowSuccessfullyEmailChanged) {
            modalWindowSuccessfullyEmailChangedBlock = <div className="modification-email-and-password__modal-successfully">
                <div className="modification-email-and-password__modal-successfully__window">
                    <img onClick={this.closeModalWindowSuccessfullyEmailChange}
                        className="modification-email-and-password__modal-successfully__window__close"
                        src={cancel}
                        alt="cancel"
                    />
                    <div className="modification-email-and-password__modal-successfully__window__message">
                        Email успешно изменен!
                    </div>
                </div>
            </div>
        }

        if (errorMessageEmail.length > 0) {
            inputExistentEmail = <div className="modification-email-and-password__warning">
                <div>{errorMessageEmail}</div>
            </div>
        }

        if (currentPasswordForChangeEmail.length < 5) {
            passwordRequirementsCurrentChangeEmail = <div className="modification-email-and-password__warning">
                Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
            </div>
        }

        if (modificationEmail) {
            newEmailBlock = <div>
                <form autoComplete="new-password" onSubmit={this.modificationEmail}>
                    <div className="modification-email-and-password__external-block">
                        <div className="modification-email-and-password__message">
                            Текущий E-mail: <span>{email}</span>
                        </div>
                        <label className="modification-email-and-password__external-block__label">
                            Введите новый E-mail:
                        </label>
                        <input placeholder="Введите новый E-mail"
                            type="email"
                            onChange={this.valueNewEmail}
                            required
                            className="modification-email-and-password__input"
                        />
                        {modalWindowNewEmailIsNullBlock}
                        {modalWindowIdenticalEmailBlock}
                        {inputExistentEmail}
                        <div className="modification-email-and-password__external-block">
                            <label className="modification-email-and-password__external-block__label">
                                Введите текущий пароль:
                            </label>
                            <span className="modification-email-and-password__external-block__wrapper-input">
                                <input placeholder="Введите текущий пароль"
                                    autoComplete="new-password"
                                    type={hiddenCurrentPasswordForChangeEmail ? 'password' : 'text'}
                                    onChange={this.valueCurrentPasswordForChangeEmail}
                                    required
                                    className="modification-email-and-password__input_password"
                                />
                                <span onClick={this.toggleShowCurrentPasswordForChangeEmail}
                                    className="modification-email-and-password__input_show">
                                    <img src={hiddenCurrentPasswordForChangeEmail ? eye : eyeBlocked} alt="eye" />
                                </span>
                                {passwordRequirementsCurrentChangeEmail}
                                {modalWindowInvalidCurrentPasswordForChangeEmail}
                            </span>
                        </div>
                    </div>
                    <div className="modification-email-and-password__btns__wrapper">
                        <button type="submit"
                            className="modification-email-and-password__btns__item">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        }

        if (modalWindowSuccessfullyPasswordChanged) {
            modalWindowSuccessfullyPasswordChange = <div className="modification-email-and-password__modal-successfully">
                <div className="modification-email-and-password__modal-successfully__window">
                    <img onClick={this.closeModalWindowSuccessfullyPaswordChange}
                        className="modification-email-and-password__modal-successfully__window__close"
                        src={cancel}
                        alt="cancel"
                    />
                    <div className="modification-email-and-password__modal-successfully__window__message">
                        Пароль успешно изменен!
                    </div>
                </div>
            </div>
        }

        if (invalidPasswordMessage) {
            modalWindowInvalidPasswordMessage = <div className="modification-email-and-password__warning">
                Новый пароль содержит не допустимые символы!
            </div>
        }

        if (newPassword.length < 5) {
            passwordRequirements = <div className="modification-email-and-password__warning">
                Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
            </div>
        }

        if (passwordDontMatchMessage) {
            passwordDontMatchMessageModalWindow = <div className="modification-email-and-password__warning">
                Пароли не совпадают!
            </div>
        }

        if (modalWindowIdenticalPassword) {
            modalWindowIdenticalPasswordBlock = <div className="modification-email-and-password__warning">
                Старый пароль и новый идентичны!
            </div>
        }

        if (errorMessagePassword.length > 0) {
            modalWindowErrorInputOldPassword = <div className="modification-email-and-password__warning">
                {errorMessagePassword}
            </div>
        }

        if (modificationPassword) {
            newPasswordBlock = <div>
                <form onSubmit={this.modificationPassword} autoComplete="off">
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">
                            Введите старый пароль:
                        </label>
                        <span className="modification-email-and-password__external-block__wrapper-input">
                            <input placeholder="Введите старый пароль"
                                type={hiddenOldPassword ? 'password' : 'text'}
                                onChange={this.valueOldPassword}
                                autoComplete="new-password"
                                required
                                className="modification-email-and-password__input_password"
                            />
                            <span onClick={this.toggleShowOldPassword}
                                className="modification-email-and-password__input_show">
                                <img src={hiddenOldPassword ? eye : eyeBlocked} alt="eye" />
                            </span>
                            {modalWindowErrorInputOldPassword}
                        </span>
                    </div>
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">
                            Введите новый пароль:
                        </label>
                        <span className="modification-email-and-password__external-block__wrapper-input">
                            <input placeholder="Введите новый пароль"
                                type={hiddenNewPassword ? 'password' : 'text'}
                                autoComplete="new-password"
                                onChange={this.valueNewPassword}
                                required
                                className="modification-email-and-password__input_password"
                            />
                            <span onClick={this.toggleShowNewPassword}
                                className="modification-email-and-password__input_show">
                                <img src={hiddenNewPassword ? eye : eyeBlocked} alt="eye" />
                            </span>
                            {passwordRequirements}
                            {modalWindowInvalidPasswordMessage}
                            {modalWindowIdenticalPasswordBlock}
                        </span>
                    </div>
                    <div className="modification-email-and-password__external-block">
                        <label className="modification-email-and-password__external-block__label">
                            Повторите новый пароль:
                        </label>
                        <span className="modification-email-and-password__external-block__wrapper-input">
                            <input placeholder="Повторите новый пароль"
                                type={hiddenRepiatNewPassword ? 'password' : 'text'}
                                onChange={this.repiatValueNewPassword}
                                autoComplete="someRandomString"
                                required
                                className="modification-email-and-password__input_password"
                            />
                            <span onClick={this.toggleShowRepiatNewPassword}
                                className="modification-email-and-password__input_show">
                                <img src={hiddenRepiatNewPassword ? eye : eyeBlocked} alt="eye" />
                            </span>
                            {passwordDontMatchMessageModalWindow}
                        </span>
                    </div>
                    <div className="modification-email-and-password__btns__wrapper">
                        <button type="submit" className="modification-email-and-password__btns__item">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        }

        let buttonModificationEmail = <button onClick={this.openModificationEmail}
            className="modification-email-and-password__external-block__btn">
            Изменить E-mail
        </button>;

        if (this.state.modificationEmail) {
            buttonModificationEmail = <button
                onClick={this.closeModificationEmail}
                className="modification-email-and-password__external-block__btn">
                Отменить
            </button>
        }

        let buttonModificationPassword = <button
            onClick={this.openModificationPassword}
            className="modification-email-and-password__external-block__btn">
            Изменить пароль
        </button>;

        if (this.state.modificationPassword) {
            buttonModificationPassword = <button
                onClick={this.closeModificationPassword}
                className="modification-email-and-password__external-block__btn">
                Отменить
            </button>;
        }

        const contentModificationEmail = <div className="modification-email-and-password__email">
            <div className="modification-email-and-password__external-block">
                <label className="modification-email-and-password__external-block__label">
                    E-mail:
                </label>
                {buttonModificationEmail}
            </div>
            {newEmailBlock}
            {modalWindowSuccessfullyEmailChangedBlock}
        </div>

        const contentModificationPassword = <div className="modification-email-and-password__password">
            <div className="modification-email-and-password__external-block">
                <label className="modification-email-and-password__external-block__label">
                    Пароль:
                </label>
                {buttonModificationPassword}
            </div>
            {newPasswordBlock}
            {modalWindowSuccessfullyPasswordChange}
        </div>

        const allContent = <>
            {contentModificationEmail}
            {contentModificationPassword}
        </>
        const content = spinner ? <Spinner /> : allContent;

        return (
            <div className="modification-email-and-password">
                <h2 className="modification-email-and-password__title">Редактировать</h2>
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userId
    }
}

const mapDispatchToProps = {
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(ModificationEmailAndPasswordPage))
