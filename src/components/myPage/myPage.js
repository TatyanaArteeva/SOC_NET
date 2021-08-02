import React, {Component} from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import WithService from '../hoc/hoc';
import { userInformation, rights, infoRelation} from '../../actions';
import PhotoUser from '../photoUser/photoUser';
import SliderCarusel from '../sliderCarusel/sliderCarusel';
import { withRouter } from "react-router";


class MyPage extends Component{
    _cleanupFunction = false;
    constructor(props){
        super(props)
        this.refImgGallery=React.createRef();
        this.state={
            btnDetailedInformation: false,
            firstName: '',
            lastName: '',
            birthDate: '',
            actualId: ''
        }
        const {Service} = this.props;
        
        this.detailedInformation=()=>{
            this.setState(({btnDetailedInformation})=>({
                btnDetailedInformation: !btnDetailedInformation
            }))
        }

        this.recepionInformation=()=>{
            Service.getUserAccountId(this.props.idInUrl)
                .then(res=>{
                    if(res.status===200){
                        this.props.userInformation(res.data)
                    }
                }).then(res=>{
                   if(this._cleanupFunction){
                    this.setState({
                        firstName: this.props.information.firstName,
                        lastName: this.props.information.lastName,
                        birthDate: this.props.information.birthDate,
                        actualId: this.props.information
                        })
                   }
                });
            Service.getAccountInfo(`/api/account/${this.props.idInUrl}/page-info`)
                .then(res=>{
                    this.props.rights(res.data.accesses);
                    this.props.infoRelation(res.data.info);
                });
    
        }

        this.componentDidMount=()=>{
            this._cleanupFunction = true;
            this.recepionInformation()
        }

        
        
        this.componentDidUpdate=(prevProps)=>{
            if(prevProps.idInUrl!==this.props.idInUrl && this._cleanupFunction){
                this.recepionInformation()
            }

        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }

        

    }

    
    render(){

        // console.log(this.props.location.pathname);
        // console.log(this.props.history);

        let btnModification=null;

        if(this.props.listRights.canModify){
            btnModification=<HashRouter>
                                <Link to="/modification"><div className="profile_editing">Редактировать</div></Link>
                            </HashRouter>
        }

        const blockDetailedInformation=this.state.btnDetailedInformation? <DetailedInformationBlock/> : null;
        return(
            <div>
                <div className="profile">
                    <div className="profile_photo"><PhotoUser idForPhoto={this.props.idInUrl}/> 
                    </div>
                        <div className="profile_information">
                            {btnModification}
                            <div className="profile_name">Мое имя: {this.state.firstName} {this.state.lastName}</div>
                            <div className="profile_information_title">Основная информация</div>
                            <div className="profile_information__birthday">День рождения: {this.state.birthDate}</div>
                            <button onClick={this.detailedInformation}>Показать подробную информацию</button>
                            {blockDetailedInformation}
                        </div>
                        <div className="profile_photos">
                            <SliderCarusel idForPhotos={this.props.idInUrl}/>
                        </div>
                        <div className="profile_publicMessages">Здесь будут записи со стены</div>
                </div>
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
    infoRelation
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(MyPage)));