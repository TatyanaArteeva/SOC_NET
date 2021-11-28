import React, { Component } from 'react';
import Header from '../header/header';
import { Route, Switch } from 'react-router-dom';
import MyPage from '../myPage/myPage';
import Friends from '../friends/friends';
import AllDialogsPage from '../allDialogsPage/allDialogsPage'
import Groups from '../groups/groups';
import Modification from '../modification/modification';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import CreatingGroup from '../creatingGroup/creatingGroup';
import Group from '../group/group';
import { groupId } from '../../actions';
import ModificationGroup from '../modificationGroup/modificationGroup';
import IncomingFriends from '../incomingFriends/incomingFriend';
import OutputFriends from '../outputFriends/outputFriends';
import AllUsers from '../allUsers/allUsers';
import AllGroups from '../allGroups/allGroups';
import AllSearchPage from '../allSearchPage/allSearchPage';
import ModificationEmailAndPasswordPage from '../modificationEmailAnsPassword/modificationEmailAndPassword';
import WebSocketsPrivatMessages from '../webSocketsPrivatMessages/webSocketsPrivatMessages';
import WebSocketsPosts from '../webSocketsPosts/webSocketsPosts';
import WebSocketsNotifications from '../webSocketsNotifications/webSocketsNotifications';
import DialogPage from '../dialogPage/dialogPage';
import DevizLabel from '../devizLabel/devixLabel';
import ErrorPage from '../errorPage/errorPage';

class MainPage extends Component {
    constructor(props) {
        super(props);

        const { idUser, location, history } = this.props;

        this.componentDidMount = () => {
            const id = `account/${idUser}`;
            if (location.pathname === "/") {
                history.push(id)
            }
        }
    }

    render() {

        const { idUser, location } = this.props;

        // if (location.pathname === "/") {
        //     const id = `${idUser}`;
        //     return <MyPage idInUrl={id} />
        // }

        return (
            <>
                <Header />
                <DevizLabel />
                <WebSocketsPrivatMessages />
                <WebSocketsPosts />
                <WebSocketsNotifications />
                <Switch>
                    <Route exact path="/friends/" component={Friends} />
                    <Route path="/friends/incoming" component={IncomingFriends} />
                    <Route path="/friends/output" component={OutputFriends} />
                    <Route path="/friends/allUsers" component={AllUsers} />
                    <Route path="/dialogs/" component={AllDialogsPage} />
                    <Route exact path="/groups/" component={Groups} />
                    <Route path="/groups/all" component={AllGroups} />
                    <Route path="/modification" component={Modification} />
                    <Route path="/search" component={AllSearchPage} />
                    <Route path="/createGroups" component={CreatingGroup} />
                    <Route path="/modificationGroups" component={ModificationGroup} />
                    <Route path="/dialog" component={DialogPage} />
                    <Route path="/modificationEmailAndPassword" component={ModificationEmailAndPasswordPage} />
                    <Route path="/groups/:id" component={({ match }) => {
                        const id = match.params.id;
                        return <Group idInUrl={id} />
                    }} />
                    <Route path="/account/:id" component={({ match }) => {
                        const id = match.params.id;
                        return <MyPage idInUrl={id} />
                    }} />
                    <Route path="/*" component={() => {
                        return <ErrorPage />
                    }} />
                </Switch>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        idGroup: state.groupId
    }
}

const mapDispatchToProps = {
    groupId
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage))



