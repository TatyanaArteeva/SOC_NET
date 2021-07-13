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
import PageFriends from '../pageFriends/pageFriends';

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
                        <Route path="/groups" exact component={Groups} />
                        <Route path="/modification" component={Modification}/>
                        <Route path="/createGroups" component={CreatingGroup}/>
                        <Route path="/modificationGroups" component={ModificationGroup}/>
                        <Route path="/groups/:id" component={({match})=>{
                            const id=match.params.id;
                            return <Group idInUrl={id}/>
                        }}/>
                        <Route path="/:id" component={({match})=>{
                            const id=match.params.id
                            return <PageFriends idInUrl={id}/>
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