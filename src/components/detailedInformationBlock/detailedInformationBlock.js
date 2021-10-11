import React, {Component} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import { userAccesses, userInformation} from '../../actions';
import {Link} from 'react-router-dom';
import SpinnerMini from '../spinnerMini/spinnerMini';
import './detailedInformationBlock.scss';

class DetailedInformationBlock extends Component{
    constructor(props){
        super(props)
        this.state={
            sex: '',
            city: '',
            phone: '',
            familyStatus: '',
            employment: '',
            description: '',
            partner:{},
            spinner: true
        }

        const {Service} = this.props;

        this.recepionInformation=()=>{
            Service.getUserAccountId(this.props.idForInfo)
                .then(res=>{
                    if(res.status===200){
                        console.log(res)
                        const objForModificationInformation={
                            sex: res.data.sex,
                            city: res.data.city,
                            phone: res.data.phone,
                            familyStatus: res.data.familyStatus,
                            employment: res.data.employment,
                            description: res.data.description,
                            birthDate: res.data.birthDate,
                            email: res.data.email,
                            id: res.data.id,

                        }
                        console.log(objForModificationInformation)
                        this.props.userInformation(objForModificationInformation)
                        this.setState({
                            partner: res.data.partner
                        })
                    }
                }).then(res=>{
                    this.setState({
                        sex: this.props.information.sex,
                        city: this.props.information.city,
                        phone: this.props.information.phone,
                        familyStatus: this.props.information.familyStatus,
                        employment: this.props.information.employment,
                        description: this.props.information.description,
                        spinner: false
                    })
                })    
        }

        this.componentDidMount=()=>{
            this.recepionInformation()
        }

    }

    
    render(){

        console.log(this.state)
        let partnerName=null;
        let partnerPrefix=null;
        
        if(this.state.partner!==null && this.state.partner.accepted===true ){
            partnerName= <Link to={this.state.partner.id}>{this.state.partner.firstName} {this.state.partner.lastName}</Link>
            partnerPrefix="c"
        }

        let sex=null;
        let city=null;
        let phone=null;
        let familyStatus=null;
        let employment=null;
        let description=null;

        if(this.state.sex.length>0){
            sex=<div className="profile-information-detailed__content">Пол: <span>{this.state.sex}</span></div>
        }
        
        if(this.state.city.length>0){
            city=<div className="profile-information-detailed__content">Город: <span>{this.state.city}</span></div>
        }

        if(this.state.phone.length>0){
            phone=<div className="profile-information-detailed__content">Мой номер телефона: <span>{this.state.phone}</span></div>
        }

        if(this.state.familyStatus.length>0){
            familyStatus=<div className="profile-information-detailed__content">Семейное положение: <span>{this.state.familyStatus} {partnerPrefix} {partnerName}</span></div>
        }

        if(this.state.employment.length>0){
            employment=<div className="profile-information-detailed__content_employment"><div>Место учебы или работы:</div> <span>{this.state.employment}</span></div>
        }

        if(this.state.description.length>0){
            description=<div className="profile-information-detailed__content_description"><div>Обо мне:</div> <span>{this.state.description}</span></div> 
        }

        let contentDetailedInformation=<div className="profile-information-detailed__content__wrapper">
                                            {sex}
                                            {city}
                                            {phone}
                                            {familyStatus}
                                            {employment}
                                            {description}
                                        </div>
        if(this.state.sex.length===0 && this.state.city.length===0 && this.state.familyStatus.length===0 && this.state.phone.length===0 && this.state.employment.length===0 && this.state.description.length===0){
            contentDetailedInformation=<div className="profile-information-detailed__content_null">Информация отсутствует</div>
        }

        const content=this.state.spinner? <SpinnerMini/>: contentDetailedInformation        

        return (
            <div className="profile-information-detailed">
                {content}
            </div>
        )
    }
    
}

const mapStateToProps=(state)=>{
    return{
        information: state.userInformation,
        id: state.userId
    }
}

const mapDispatchToProps = {
    userAccesses,
    userInformation
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(DetailedInformationBlock));