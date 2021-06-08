import React, {Component} from 'react';
// import './myPage.scss';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import WithService from '../hoc/hoc';
import { userAccesses, userInformation} from '../../actions';

class MyPage extends Component{
    constructor(props){
        super(props)
        this.state={
            btnDetailedInformation: false,
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

        this.recepionInformation=()=>{
            Service.getCurrentUserStatus('/api/status')
                .then(res=>{
                    if(res.status===200){
                        this.props.userAccesses(res.data.accesses);
                        this.props.userInformation(res.data.currentAccount)
                    }
                }).then(res=>{
                    this.setState({
                    firstName: this.props.information.firstName,
                    lastName: this.props.information.lastName,
                    birthDate: this.props.information.birthDate
                    })
                })
                    
                    
        }

        this.componentDidMount=()=>{
            this.recepionInformation()
        }

        
    }

    
    render(){
        console.log(this.props.information)
        // const {firstName, lastName, birthDate} =this.props.userInformation
        const blockDetailedInformation=this.state.btnDetailedInformation? <DetailedInformationBlock/> : null;
    
        return(
            <div>
                <div className="profile">
                    <div className="profile_photo">Здесь будет фото</div>
                        <div className="profile_information">
                            <HashRouter>
                                <Link to="/modification"><div className="profile_editing">Редактировать</div></Link>
                            </HashRouter>
    
                            <div className="profile_name">Мое имя: {this.state.firstName} {this.state.lastName}</div>
                            <div className="profile_information_title">Основная информация</div>
                            <div className="profile_information__birthday">День рождения: {this.state.birthDate}</div>
                            <button onClick={this.detailedInformation}>Показать подробную информацию</button>
                            {blockDetailedInformation}
                        </div>
                        <div className="profile_photos">Здесь будет карусель для фото</div>
                        <div className="profile_publicMessages">Здесь будут записи со стены</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        information: state.userInformation
    }
}

const mapDispatchToProps = {
    userAccesses,
    userInformation
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(MyPage));