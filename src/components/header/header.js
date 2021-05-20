import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Header extends Component{
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
                        <Link to={id}> пункт 1: Моя страница</Link>
                        <Link to="/friends"> пункт 2: Друзья</Link>
                        <Link to="/messages"> пункт 3: Сообщения</Link>
                        <Link to="/groups"> пункт 4: Группы</Link>
                    </div>
                </div>
                <button>Настройки</button>
                <button>Выход</button>
            </header>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId
    }
}

export default connect(mapStateToProps)(Header);