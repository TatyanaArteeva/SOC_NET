import React, {Component} from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import { userAccesses, userInformation} from '../../actions';

class DetailedInformationBlock extends Component{
    constructor(props){
        super(props)
        this.state={
            sex: '',
            city: '',
            phone: '',
            familyStatus: '',
            employment: '',
            description: ''
        }

        const {Service} = this.props;

        this.recepionInformation=()=>{
            Service.getUserAccountId(this.props.idForInfo)
                .then(res=>{
                    if(res.status===200){
                        this.props.userInformation(res.data)
                    }
                }).then(res=>{
                    this.setState({
                        sex: this.props.information.sex,
                        city: this.props.information.city,
                        phone: this.props.information.phone,
                        familyStatus: this.props.information.familyStatus,
                        employment: this.props.information.employment,
                        description: this.props.information.description
                    })
                })    
        }

        this.componentDidMount=()=>{
            this.recepionInformation()
        }

    }

    
    render(){

        console.log(this.state)
        
        return (
            <div>
                <div className="profile_information__sex">Пол: {this.state.sex}</div>
                <div className="profile_information__city">Город: {this.state.city}</div>
                <div className="profile_information__phone">Мой номер телефона: {this.state.phone}</div>
                <div className="profile_information__familyStatus">Семейное положение: {this.state.familyStatus}</div>
                <div className="profile_information__education">Место учебы или работы: {this.state.employment}</div>
                <div className="profile_information__personal">Обо мне: {this.state.description}</div> 
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