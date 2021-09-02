import React, {Component} from 'react';
import WithService from '../hoc/hoc';
import './infoUser.scss';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import { userInformation, rights, infoRelation, currentIdLocation} from '../../actions';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';

class InfoUser extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            btnDetailedInformation:false,
            firstName: '',
            lastName: '',
            birthDate: ''
        }
        const {Service} = this.props;

        this.detailedInformation=()=>{
            this.setState(({btnDetailedInformation})=>({
                btnDetailedInformation: !btnDetailedInformation
            }))
        }

        this.info=()=>{
            Service.getUserAccountId(this.props.idForInfo)
                .then(res=>{
                    if(res.status===200){
                        this.props.userInformation(res.data)
                        this.props.currentIdLocation(this.props.idForInfo)
                    }
                }).then(res=>{
                        if(this._cleanupFunction){
                            this.setState({
                                firstName: this.props.information.firstName,
                                lastName: this.props.information.lastName,
                                birthDate: this.props.information.birthDate,
                                })
                        }
                });
            Service.getAccountInfo(`/api/account/${this.props.idForInfo}/page-info`)
                .then(res=>{
                    this.props.rights(res.data.accesses);
                    this.props.infoRelation(res.data.info);
                });
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.info()
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false;
        }

        this.componentDidUpdate=(prevProps)=>{
            if(prevProps.idForInfo!==this.props.idForInfo && "#" + this.props.match.params.id){
                this.info()
            }
        }

        this.goToModificationMyPage=()=>{
            this.props.history.push('/modification')
        }
    }

    render(){

        let btnModification=null;

        if(this.props.listRights.canModify){
            btnModification=<button className="profile_editing" onClick={this.goToModificationMyPage}>Редактировать</button>
        }

        const blockDetailedInformation=this.state.btnDetailedInformation? <DetailedInformationBlock idForInfo={this.props.idForInfo}/> : null;

        return(
            <div>
                {btnModification}
                <div className="profile_name">Мое имя: {this.state.firstName} {this.state.lastName}</div>
                <div className="profile_information_title">Основная информация</div>
                <div className="profile_information__birthday">День рождения: {this.state.birthDate}</div>
                <button onClick={this.detailedInformation}>Показать подробную информацию</button>
                {blockDetailedInformation}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        information: state.userInformation,
        id: state.userId,
        listRights: state.listRights,
        info: state.infoRelation
    }
}

const mapDispatchToProps = {
    userInformation,
    rights,
    infoRelation,
    currentIdLocation
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(InfoUser)));
