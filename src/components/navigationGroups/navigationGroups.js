import React, { Component } from 'react';
import './navigationGroups.scss';
import { withRouter } from 'react-router';

class NavigationGroups extends Component {
    constructor(props) {
        super(props);

        const { history } = this.props;

        this.activeMyGroups = () => {
            history.push("/groups/")
        }

        this.activeAllGroups = () => {
            history.push("/groups/all")
        }

        this.goToCreateGroup = () => {
            history.push("/createGroups")
        }

    }
    render() {

        const { location } = this.props;

        return (
            <div className="navigation-group">
                <div className="navigation-group__wrapper">
                    <button
                        className={location.pathname === "/groups/" ?
                            "navigation-group__btn_active" : "navigation-group__btn"}
                        onClick={() => this.activeMyGroups()}>
                        Мои группы
                    </button>
                    <button
                        className={location.pathname === "/groups/all" ?
                            "navigation-group__btn_active" : "navigation-group__btn"}
                        onClick={() => this.activeAllGroups()}>
                        Показать все группы
                    </button>
                    <button
                        className="navigation-group__btn"
                        onClick={() => this.goToCreateGroup()}>
                        Создать группу
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(NavigationGroups)