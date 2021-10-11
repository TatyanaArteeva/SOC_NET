import React, {Component} from 'react';
import WithService from '../hoc/hoc';
import './infoUser.scss';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import { userInformation, rights, infoRelation, currentIdLocation, loadingInfoProfile} from '../../actions';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import Spinner from '../spinner/spinner';

class InfoUser extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            btnDetailedInformation:false,
            firstName: '',
            lastName: '',
            birthDate: '',
            spinner: true
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
                        if(this._cleanupFunction){
                            this.props.userInformation(res.data)
                            this.props.currentIdLocation(this.props.idForInfo)
                            this.props.loadingInfoProfile(true)
                        }
                    }
                }).then(res=>{
                        if(this._cleanupFunction){
                            this.setState({
                                firstName: this.props.information.firstName,
                                lastName: this.props.information.lastName,
                                birthDate: this.props.information.birthDate,
                                spinner: false
                            })
                        }
                });
            Service.getAccountInfo(`/api/account/${this.props.idForInfo}/page-info`)
                .then(res=>{
                    this.props.rights(res.data.accesses);
                    this.props.infoRelation(res.data.info);
                })
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.props.loadingInfoProfile(false)
            this.props.infoRelation('');
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
            btnModification=<div className="profile-information__modification-btn__wrapper">
                                <button className="profile-information__modification-btn" onClick={this.goToModificationMyPage}>Редактировать</button>
                            </div>
        }

        const blockDetailedInformation=this.state.btnDetailedInformation? <DetailedInformationBlock idForInfo={this.props.idForInfo}/> : null;

        
        let name=null;
        let birthDate=null;

        if(this.state.firstName.length>0 || this.state.lastName.length>0){
            name=<div className="profile-information__content">Мое имя: <span>{this.state.firstName} {this.state.lastName}</span></div>
        }

        if(this.state.birthDate.length>0){
            birthDate=<div className="profile-information__content">День рождения: <span>{this.state.birthDate}</span></div>
        }

        let btnDetailInformationBlock="Показать подробную информацию"

        if(this.state.btnDetailedInformation){
            btnDetailInformationBlock="Скрыть подробную информацию"
        }

        const contentInformation=<>
                                    {btnModification}
                                    <div className="profile-information__content__wrapper">
                                        {name}
                                        {birthDate}
                                    </div>
                                    <button onClick={this.detailedInformation} className="profile-information__content__btn_detailed">{btnDetailInformationBlock}</button>
                                </>
        const content= this.state.spinner ? <Spinner/> : contentInformation

        return(
            <div className="profile-information">
                {content}
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
    currentIdLocation,
    loadingInfoProfile
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(InfoUser)));
