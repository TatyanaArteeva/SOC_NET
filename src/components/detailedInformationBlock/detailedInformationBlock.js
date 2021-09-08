import React, {Component} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import { userAccesses, userInformation} from '../../actions';
import {Link} from 'react-router-dom';
import Spinner from '../spinner/spinner';

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

        const contentDetailedInformation=<div>
                                            <div className="profile_information__sex">Пол: {this.state.sex}</div>
                                            <div className="profile_information__city">Город: {this.state.city}</div>
                                            <div className="profile_information__phone">Мой номер телефона: {this.state.phone}</div>
                                            <div className="profile_information__familyStatus">Семейное положение: {this.state.familyStatus} {partnerPrefix} {partnerName}</div>
                                            <div className="profile_information__education">Место учебы или работы: {this.state.employment}</div>
                                            <div className="profile_information__personal">Обо мне: {this.state.description}</div> 
                                        </div>

        const content=this.state.spinner? <Spinner/>: contentDetailedInformation        

        return (
            <div>
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