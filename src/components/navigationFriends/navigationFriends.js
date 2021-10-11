import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './navigationFriends.scss';
import { withRouter } from 'react-router';

class NavigationFriends extends Component{
    constructor(props){
        super(props)
        
        this.activeMyFriends=()=>{
            this.props.history.push("/friends/")
        }

        this.activeIncpmingFriends=()=>{
            this.props.history.push("/friends/incoming")
        }

        this.activeOutputFriends=()=>{
            this.props.history.push("/friends/output")
        }

        this.activeAllFriends=()=>{
            this.props.history.push("/friends/allUsers")
        }

    }
    render(){

        
        return(
            <div className="navigation">
                <div className="navigation__wrapper">
                    <button to="/friends/" 
                          onClick={()=>this.activeMyFriends()}
                          className={this.props.location.pathname==="/friends/" ? "navigation__btn_active" : "navigation__btn"} 
                          >
                          Мои друзья
                    </button>
                    <button to="/friends/incoming" 
                          onClick={()=>this.activeIncpmingFriends()}
                          className={this.props.location.pathname==="/friends/incoming" ? "navigation__btn_active" : "navigation__btn"} 
                          >
                          Входящие заявки
                    </button>
                    <button to="/friends/output" 
                          onClick={()=>this.activeOutputFriends()}
                          className={this.props.location.pathname==="/friends/output" ? "navigation__btn_active" : "navigation__btn"} 
                          >
                          Исходящие заявки
                    </button>
                    <button to="/friends/allUsers" 
                          onClick={()=>this.activeAllFriends()}
                          className={this.props.location.pathname==="/friends/allUsers" ? "navigation__btn_active" : "navigation__btn"} 
                          >
                          Все пользователи
                    </button> 
                </div>
            </div>
        )
    }
}

export default withRouter(NavigationFriends);