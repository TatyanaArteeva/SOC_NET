import React, { Component } from 'react';
import './navigationFriends.scss';
import { withRouter } from 'react-router';

class NavigationFriends extends Component {
    constructor(props) {
        super(props)

        const { history } = this.props;

        this.activeMyFriends = () => {
            history.push("/friends/")
        }

        this.activeIncpmingFriends = () => {
            history.push("/friends/incoming")
        }

        this.activeOutputFriends = () => {
            history.push("/friends/output")
        }

        this.activeAllFriends = () => {
            history.push("/friends/allUsers")
        }

    }
    render() {

        const { location } = this.props;

        return (
            <div className="navigation">
                <div className="navigation__wrapper">
                    <button to="/friends/"
                        onClick={() => this.activeMyFriends()}
                        className={location.pathname === "/friends/" ?
                            "navigation__btn_active" : "navigation__btn"}>
                        Мои друзья
                    </button>
                    <button to="/friends/incoming"
                        onClick={() => this.activeIncpmingFriends()}
                        className={location.pathname === "/friends/incoming" ?
                            "navigation__btn_active" : "navigation__btn"}>
                        Входящие заявки
                    </button>
                    <button to="/friends/output"
                        onClick={() => this.activeOutputFriends()}
                        className={location.pathname === "/friends/output" ?
                            "navigation__btn_active" : "navigation__btn"}>
                        Исходящие заявки
                    </button>
                    <button to="/friends/allUsers"
                        onClick={() => this.activeAllFriends()}
                        className={location.pathname === "/friends/allUsers" ?
                            "navigation__btn_active" : "navigation__btn"}>
                        Все пользователи
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(NavigationFriends)