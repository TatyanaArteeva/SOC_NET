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
import CreatingGroup from '../creatingGroup/creatingGroup';
import Group from '../group/group';
import {groupId} from '../../actions';
import ModificationGroup from '../modificationGroup/modificationGroup';
import IncomingFriends from '../incomingFriends/incomingFriend';
import OutputFriends from '../outputFriends/outputFriends';
import AllUsers from '../allUsers/allUsers';
import AllGroups from '../allGroup/allGroup';
import AllSearchPage from '../allSearchPage/allSearchPage';
import ModificationEmailAndPasswordPage from '../modificationEmailAnsPassword/modificationEmailAndPassword';

class MainPage extends Component{
    
    render(){

        const {idUser}=this.props;
        const id=`/${idUser}`;

        if (this.props.location.hash === "") {
            this.props.history.push("#" + id)
        }

        console.log(this.props.location)

        return(
            <>
                <HashRouter>
                    <Header/>
                    <Switch>
                        <Route path= "/friends" exact component={Friends} />
                        <Route path= "/friends/incoming" component={IncomingFriends} />
                        <Route path= "/friends/output" component={OutputFriends} />
                        <Route path= "/friends/allUsers" component={AllUsers} />
                        <Route path="/messages" component={Messages} />
                        <Route path="/groups" exact component={Groups} />
                        <Route path="/groups/all" component={AllGroups} />
                        <Route path="/modification" component={Modification}/>
                        <Route path="/search" component={AllSearchPage}/>
                        <Route path="/createGroups" component={CreatingGroup}/>
                        <Route path="/modificationGroups" component={ModificationGroup}/>
                        <Route path="/modificationEmailAndPassword" component={ModificationEmailAndPasswordPage}/>
                        <Route path="/groups/:id" component={({match})=>{
                            const id=match.params.id;
                            return <Group idInUrl={id}/>
                        }}/>
                        <Route path="/:id" exact component={({match})=>{
                            const id=match.params.id;
                            console.log(id)
                            return <MyPage idInUrl={id}/>
                        }}/>
                    </Switch>
                </HashRouter>
            </>
        )
    }
}


const mapStateToProps=(state)=>{
    return {
        idUser: state.userId,
        idGroup: state.groupId
    }
}

const mapDispatchToProps = {
    groupId
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage));