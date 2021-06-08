import React, {Component} from 'react';
import Header from '../header/header';
import{HashRouter, Route, Switch,} from 'react-router-dom';
import MyPage from '../myPage/myPage';
import Friends from '../friends/friends';
import Messages from '../messages/messages';
import Groups from '../groups/groups';
import Modification from '../modification/modification';
import { connect } from 'react-redux';
import { withRouter } from "react-router";


class MainPage extends Component{
    render(){
        const {idUser}=this.props;
        const id=`/${idUser}`;
       
        if (this.props.location.hash === "") {
            this.props.history.push("#" + id)
        }

        return(
            <>
                <Header/>
                <HashRouter>
                    <Switch>
                        <Route path={id} component={MyPage} />
                        <Route path= "/friends" component={Friends} />
                        <Route path="/messages" component={Messages} />
                        <Route path="/groups" component={Groups} />
                        <Route path="/modification" component={Modification}/>
                    </Switch>
                </HashRouter>
            </>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        idUser: state.userId
    }
}

export default withRouter(connect(mapStateToProps)(MainPage));