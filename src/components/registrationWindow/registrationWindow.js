import React, {Component} from 'react';
import {connect} from 'react-redux';
import BirthDatePicker from '../birthDatePicker/birthDatePicker';
import {closeModalRegistration, loginMainPage, registrationSuccessful} from '../../actions';
import './registrationWindow.scss';
import WithService from '../hoc/hoc';

class RegistrationWindow extends Component{
    
    constructor(props){
        super(props);
        this.state={
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: null
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

        this.postFormRegistration=(event)=>{
            event.preventDefault();
            Service.registrationPage('/api/account/registration', this.state)
                .then(res=>{
                    if(res.status===200){
                        console.log(res.status)
                        this.props.registrationSuccessful();
                        this.props.closeModalRegistration()
                    }else{
                        console.log("Что-то пошло не так!")
                    }
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
        
        return(
            <div className ="registrationWindow">
                <form onSubmit={this.postFormRegistration}>
                    <h2>Регистрация</h2>
                    <div onClick={ ()=> this.props.closeModalRegistration() }>Закрыть</div>
                    <div>
                        <input onChange={this.valueFirstName} placeholder="Укажите свое имя" type="text" name="firstName" required/>
                        <input onChange={this.valueLastName} placeholder="Укажите свою фамилию" type="text" name="lastName" required/>
                        <input onChange={this.valueEmail} placeholder="Введите свой e-mail" type="email" name="email" required/>
                        <input onChange={this.valuePassword} placeholder="Введите пароль" type="password" name="password" required/>
                        Дата рождения: <br />
                        <div><BirthDatePicker/></div>
                    </div>
                    <button onClick={this.valueBirtDay} type = "submit">Зарегистрироваться</button>
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