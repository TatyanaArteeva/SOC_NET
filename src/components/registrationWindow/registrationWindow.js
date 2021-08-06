import React, {Component} from 'react';
import {connect} from 'react-redux';
import BirthDatePicker from '../birthDatePicker/birthDatePicker';
import {closeModalRegistration, loginMainPage, registrationSuccessful} from '../../actions';
import './registrationWindow.scss';
import WithService from '../hoc/hoc';
import cancel from './cancel.svg';
import eye from './eye.svg';
import eyeBlocked from './eyeBlocked.svg';



class RegistrationWindow extends Component{
    
    constructor(props){
        super(props);
        this.state={
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: null,
            invalidPassword: false,
            hiddenPassword: true,
        }

        const {Service} = this.props;

        this.valueFirstName=(event)=>{
            this.setState({
                firstName: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueLastName=(event)=>{
            this.setState({
                lastName: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
            })
        }

        this.valueEmail=(event)=>{
            this.setState({
                email: event.target.value
            })
        }

        this.valuePassword=(event)=>{
            this.setState({
                password: event.target.value
            })
        }

        this.closeModalWindowInvalidPassword=()=>{
            this.setState({
                invalidPassword: false
            })
        }

        this.postFormRegistration=(event)=>{
            event.preventDefault();

            if(this.state.password.length>=5){
                const OneInvalidSymbol = ' ';
                const twoInvalidSymbol = '    ';
                const valuePassword = this.state.password;

                const oneCheck = valuePassword.indexOf(OneInvalidSymbol);
                const twoCheck = valuePassword.indexOf(twoInvalidSymbol);
                if(oneCheck === -1 && twoCheck === -1){
                    const registationObj={
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        password: this.state.password,
                        birthDate: this.state.birthDate
                    }
                    Service.registrationPage('/api/account/registration', registationObj)
                    .then(res=>{
                        if(res.status===200){
                            console.log(res.status)
                            this.props.registrationSuccessful();
                            this.props.closeModalRegistration()
                        }else{
                            console.log("Что-то пошло не так!")
                        }
                    })
                }else{
                    this.setState({
                        invalidPassword:true
                    })
                }


              
            }
            
            
        }

        this.toggleShowPassword=()=>{
            this.setState({
                hiddenPassword: !this.state.hiddenPassword
            })
        }
      
    }
    render(){
        this.valueBirtDay=()=>{
            if(this.props.birthDay.length===0){
                this.setState({
                    birthDate: null
                })
            }else{
                this.setState({
                    birthDate: this.props.birthDay
                })
            }
        }

        if(this.state.invalidPassword){
            setTimeout(this.closeModalWindowInvalidPassword, 2000)
        }

        let passwordRequirements = <div className="passwordRequirements_null"></div>;
        if (this.state.password.length < 5) {
            passwordRequirements = <div className="passwordRequirements">
                Пароль должен содержать минимум 5 символов и не должен содержать пробелы!
            </div>
        }

        if(this.state.invalidPassword){
            passwordRequirements=<div className="passwordRequirements">
                                            <button onClick={this.closeModalWindowInvalidPassword}>Закрыть</button>
                                            Пароль содержит не допустимые символы!
                                        </div>
        }
        
        
        return(
            <div className ="registration-window">
                <form onSubmit={this.postFormRegistration} className="registration-window__modal">
                    <div>
                        <span onClick={()=> this.props.closeModalRegistration()} className="registration-window__modal__close"><img src={cancel} alt="cancel" className="registration-window__modal__close__img"/></span>
                        <h2 className="registration-window__modal__title">Регистрация</h2>
                    </div>
                    <div>
                        <input onChange={this.valueFirstName} placeholder="Укажите свое имя" type="text" name="firstName" required className="registration-window__modal__input" value={this.state.firstName}/>
                        <input onChange={this.valueLastName} placeholder="Укажите свою фамилию" type="text" name="lastName" required className="registration-window__modal__input" value={this.state.lastName}/>
                        <input onChange={this.valueEmail} placeholder="Введите свой e-mail" type="email" name="email" required className="registration-window__modal__input"/>
                        <div><BirthDatePicker/></div>
                        <div className="registration-window__modal_wrapper-password">
                            <input  onChange={this.valuePassword} 
                                    placeholder="Введите пароль" 
                                    type={this.state.hiddenPassword ? 'password' : 'text'}
                                    name="password" 
                                    required 
                                    className="registration-window__modal__input"/>
                                    <span   className="registration-window__modal__input_show" 
                                            onClick={this.toggleShowPassword}>
                                            {this.state.hiddenPassword? <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                                                            <title>Показать пароль</title>
                                                                            <path  fill="#89d8c2" d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
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
                        <button onClick={this.valueBirtDay} type = "submit" className="registration-window__modal__btn">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        birthDay: state.birth,
        mainPage: state.loginMainPage.mainPage
    }
}

const mapDispatchToProps = {
    closeModalRegistration,
    loginMainPage,
    registrationSuccessful
}

export default WithService()(connect (mapStateToProps, mapDispatchToProps)(RegistrationWindow));