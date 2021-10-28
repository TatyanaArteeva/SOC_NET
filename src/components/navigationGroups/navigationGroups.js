import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './navigationGroups.scss';
import { withRouter } from 'react-router';

class NavigationGroups extends Component{
    constructor(props){
        super(props);
        this.activeMyGroups=()=>{
            this.props.history.push("/groups/")
        }

        this.activeAllGroups=()=>{
            this.props.history.push("/groups/all")
        }

        this.goToCreateGroup=()=>{
            this.props.history.push("/createGroups")
        }
    }
    render(){

        return(
            <div className="navigation-group">
                <div className="navigation-group__wrapper">
                    <button 
                        className={this.props.location.pathname==="/groups/" ? "navigation-group__btn_active" : "navigation-group__btn"}
                        onClick={()=>this.activeMyGroups()}>
                        Мои группы
                    </button>
                    <button 
                        className={this.props.location.pathname==="/groups/all" ? "navigation-group__btn_active" : "navigation-group__btn"}
                        onClick={()=>this.activeAllGroups()}>
                        Показать все группы
                    </button>
                    <button 
                        className="navigation-group__btn"
                        onClick={()=>this.goToCreateGroup()}>
                        Создать группу
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(NavigationGroups);