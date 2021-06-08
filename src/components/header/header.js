import React, {Component} from 'react';
import { HashRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import App from '../app/App';
import {logout, displayingLoginAndRegistrationPage} from '../../actions';
import { withRouter } from "react-router";

class Header extends Component{

    constructor(props){
        super(props);

        const {Service} = this.props;

        this.exit=()=>{
            Service.logoutRequest('api/logout')
                .then(res=>{
                    if(res.status===200){
                        this.props.logout();
                    }
                }).then(res=>{
                    if(this.props.logoutStatus) {
                        return <App/>
                    }
                })
                .catch(res=>{
                    return 
                    // Здесь будет ошибка
                })
        }

    }
    
    render(){

        const {idUser}=this.props;
        const id=`/${idUser}`;

        return (
            <header>
                <div>Логотип</div>
                <input type="text" />
                <div>
                    <button>Меню</button>
                    <div>
                       <HashRouter>
                            <Link to={id}> пункт 1: Моя страница</Link>
                            <Link to="/friends"> пункт 2: Друзья</Link>
                            <Link to="/messages"> пункт 3: Сообщения</Link>
                            <Link to="/groups"> пункт 4: Группы</Link>
                       </HashRouter>
                    </div>
                </div>
                <button>Настройки</button>
                <button onClick={()=>this.exit()}>Выход</button>
            </header>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId,
        logoutStatus: state.logout
    }
}

const mapDispatchToProps={
        logout,
        displayingLoginAndRegistrationPage
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Header)));