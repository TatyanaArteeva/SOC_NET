import React, {Component} from 'react';
import Header from '../header/header';
import{BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import MyPage from '../myPage/myPage';
import Friends from '../friends/friends';
import Messages from '../messages/messages';
import Groups from '../groups/groups';
import {connect} from 'react-redux';

class MainPage extends Component{
    render(){
        
        const {idUser}=this.props;
        const id=`/${idUser}`;

        return(
            <Router>
                <Header/>
                <Redirect from="" to={id}/>
                <Switch>
                    <Route path={id} exact component={MyPage}/>
                    <Route path= "/friends" exact component={Friends}/>
                    <Route path="/messages" exact component={Messages}/>
                    <Route path="/groups" exact component={Groups}/>
                    {/* <Route render={()=>MyPage}/> */}
                </Switch>
            </Router>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId
    }
}

export default connect(mapStateToProps)(MainPage);