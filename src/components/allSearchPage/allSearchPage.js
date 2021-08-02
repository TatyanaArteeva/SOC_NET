import React, {Component} from 'react';
import {connect} from 'react-redux';
import {allSearchValue} from '../../actions';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";

class AllSearchPage extends Component{
    constructor(props){
        super(props);
        this.state={
            searchValue: '',
            searchUsers: [],
            searchGroups: []
        }

        const {Service}=this.props;

        this.componentDidMount=()=>{
            this.setState({
                searchValue: this.props.valueSearch
            },()=>{
                Service.getResultForSearch(`/api/account/all?start=0&end=5`, {params:{name: this.state.searchValue}})
                    .then(res=>{
                        console.log(res)
                        this.props.allSearchValue("")
                        if(res.status===200){
                            this.setState({
                                searchUsers: res.data.accounts
                            })
                        }
                    })

                Service.getResultForSearch(`/api/group/all?start=0&end=5`, {params:{name: this.state.searchValue}})
                    .then(res=>{
                        console.log(res)
                        this.props.allSearchValue("")
                        if(res.status===200){
                            this.setState({
                                searchGroups: res.data.groups
                            })
                        }
                    })
                })

        }

        this.searchValue=(e)=>{
            this.setState({
                searchValue: e.target.value
            })

            Service.getResultForSearch(`/api/account/all?start=0&end=5`, {params:{name: e.target.value}})
            .then(res=>{
                console.log(res)
                if(res.status===200){
                    this.setState({
                        searchUsers: res.data.accounts
                    })
                }
            })

            Service.getResultForSearch(`/api/group/all?start=0&end=5`, {params:{name: e.target.value}})
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        this.setState({
                            searchGroups: res.data.groups
                        })
                    }
                })
        }

        this.goToAllGroups=()=>{
            this.props.allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            });
            this.props.history.push('/groups/all')
        }

        this.goToAllUsers=()=>{
            this.props.allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            });
            this.props.history.push('/friends/allUsers')
        }

        this.goToUserPage=(id)=>{
            this.props.history.push(`/${id}`)
        }

        this.goToGroupsPage=(id)=>{
            this.props.history.push(`/groups/${id}`)
        }

        this.addFriends=(id)=>{
            let objInfo={};
            let photo=null;
            console.log("add")
            Service.postAddFriend(`/api/friend/addFriend/${id}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=objInfo.account['photo']=photo;
                                            const index=this.state.searchUsers.findIndex(el=>{
                                                return el.account.id===objInfo.account.id
                                            });
                                            const newElem=objInfo;
                                            const newArrItems=[...this.state.searchUsers.slice(0, index), newElem, ...this.state.searchUsers.slice(index+1)];
                                            this.setState({
                                                searchUsers: newArrItems
                                            })
                                        })
                                })
                    }
                })
        }

        this.cancelAddFriends=(id)=>{
            let objInfo={};
            let photo=null;
            Service.postCancelAddFriend(`/api/friend/removeFriend/${id}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getAccountInfo(`/api/account/${id}/page-info`)
                        .then(res=>{
                           objInfo=res.data;
                           Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                responseType: 'arraybuffer'
                           })
                            .then(res => {
                                photo=Buffer.from(res.data, 'binary').toString('base64');
                            })
                            .then(res=>{
                                photo=objInfo.account['photo']=photo;
                                const index=this.state.searchUsers.findIndex(el=>{
                                    return el.account.id===objInfo.account.id
                                });
                                const newElem=objInfo;
                                const newArrItems=[...this.state.searchUsers.slice(0, index), newElem, ...this.state.searchUsers.slice(index+1)];
                                this.setState({
                                    searchUsers: newArrItems
                                })
                            })
                        })
                    }
                })
        }

        this.rejectFriends=(id)=>{
            let objInfo={};
            let photo=null;
            Service.postDeleteFriend(`/api/friend/rejectFriend/${id}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${id}/page-info`)
                        .then(res=>{
                           objInfo=res.data;
                           Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                responseType: 'arraybuffer'
                           })
                            .then(res => {
                                photo=Buffer.from(res.data, 'binary').toString('base64');
                            })
                            .then(res=>{
                                photo=objInfo.account['photo']=photo;
                                const index=this.state.searchUsers.findIndex(el=>{
                                    return el.account.id===objInfo.account.id
                                });
                                const newElem=objInfo;
                                const newArrItems=[...this.state.searchUsers.slice(0, index), newElem, ...this.state.searchUsers.slice(index+1)];
                                this.setState({
                                    searchUsers: newArrItems
                                })
                            })
                        })
                }
            })
        }

        this.deleteFriends=(id)=>{
            let objInfo={};
            let photo=null;
            Service.postDeleteFriend(`/api/friend/removeFriend/${id}`)
            .then(res=>{
                if(res.status===200){
                    Service.getAccountInfo(`/api/account/${id}/page-info`)
                        .then(res=>{
                           objInfo=res.data;
                           Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                responseType: 'arraybuffer'
                           })
                            .then(res => {
                                photo=Buffer.from(res.data, 'binary').toString('base64');
                            })
                            .then(res=>{
                                photo=objInfo.account['photo']=photo;
                                const index=this.state.searchUsers.findIndex(el=>{
                                    return el.account.id===objInfo.account.id
                                });
                                const newElem=objInfo;
                                const newArrItems=[...this.state.searchUsers.slice(0, index), newElem, ...this.state.searchUsers.slice(index+1)];
                                this.setState({
                                    searchUsers: newArrItems
                                })
                            })
                        })
                }
            })
        }

        this.joinGroup=(id)=>{
            Service.postAddGroups(`/api/group-relation/join-group/${id}`)
                .then(res=>{
                    if(res.status===200){
                        Service.getGroup(`/api/group/${id}/page-info`)
                            .then(res=>{
                                const index=this.state.searchGroups.findIndex(el=>{
                                    return el.group.id===res.data.group.id
                                });
                                const newElem=res.data;
                                const newArrItems=[...this.state.searchGroups.slice(0, index), newElem, ...this.state.searchGroups.slice(index+1)];
                                this.setState({
                                    searchGroups: newArrItems
                                })
                            })
                                    
                    }
                })
        }

        this.goOutGroup=(id)=>{
            Service.postAddGroups(`/api/group-relation/leave-group/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getGroup(`/api/group/${id}/page-info`)
                                    .then(res=>{
                                        const index=this.state.searchGroups.findIndex(el=>{
                                            return el.group.id===res.data.group.id
                                        });
                                        const newElem=res.data;
                                        const newArrItems=[...this.state.searchGroups.slice(0, index), newElem, ...this.state.searchGroups.slice(index+1)];
                                        this.setState({
                                            searchGroups: newArrItems
                                        })
                                    }) 
                            }
                        })
        }


    }

    render(){

        let listUsersSearch=<div>
                                Пользователей не найдено
                            </div>;

        
        if(this.state.searchUsers.length>0){
            listUsersSearch=this.state.searchUsers.map(el=>{
                                let buttonForActionRelationships=null;
                                let btnActionRejectFriend=null;
                                const btnAddFriends=<button onClick={()=>this.addFriends(el.account.id)} className="add_photo">Добавить в друзья</button>;
                                const btnCancelAddFriends=<button onClick={()=>this.cancelAddFriends(el.account.id)} className="add_photo">Отменить заявку</button>;
                                const btnConfirmAddFriends=<button onClick={()=>this.addFriends(el.account.id)} className="add_photo">Подтвердить друга</button>;
                                const btnRejectFriend=<button onClick={()=>this.rejectFriends(el.account.id)} className="add_photo">Отклонить друга</button>;
                                const btnDeleteFriends= <button onClick={()=>this.deleteFriends(el.account.id)} className="add_photo">Удалить из друзей</button>;

                                if(el.info.friendRelationStatus==="NO_RELATION"){
                                    buttonForActionRelationships=btnAddFriends;
                                }
                        
                                if(el.info.friendRelationStatus==="OUTPUT"){
                                    buttonForActionRelationships=btnCancelAddFriends;
                                }
                        
                                if(el.info.friendRelationStatus==="INPUT"){
                                    buttonForActionRelationships=btnConfirmAddFriends;
                                    btnActionRejectFriend=btnRejectFriend
                                }
                                if(el.info.friendRelationStatus==="FULL"){
                                    buttonForActionRelationships=btnDeleteFriends;
                                }

                                return <div>
                                            <li key={el.account.id} onClick={()=>this.goToUserPage(el.account.id)}>
                                                <div>
                                                    <img src={"data:image/jpg;base64," + el.account.photo} alt="photoUser"/>
                                                </div>
                                                <div>
                                                    {el.account.firstName} {el.account.lastName}
                                                </div>
                                            </li>
                                            {buttonForActionRelationships}
                                        </div>
                            })
        }

        let listGroupsSearch=<div>
                                Групп не найдено
                            </div>;

        if(this.state.searchGroups.length>0){
            listGroupsSearch=  this.state.searchGroups.map(el=>{
                                    let buttonForActionGroup=null;
                                    const joinGroup=<button onClick={()=>this.joinGroup(el.group.id)}>Вступить в группу</button>
                                    const goOutGroup=<button onClick={()=>this.goOutGroup(el.group.id)}>Выйти из группы</button>
                                    if(el.info.groupRelationStatus==="NONE"){
                                        buttonForActionGroup=joinGroup;
                                    }
                                
                                    if(el.info.groupRelationStatus==="PARTICIPANT"){
                                        buttonForActionGroup=goOutGroup;
                                    }
                                    return <div>
                                                <li key={el.group.id} onClick={()=>this.goToGroupsPage(el.group.id)}>
                                                    <div>
                                                        <img src={"data:image/jpg;base64," + el.group.photo} alt="photoUser"/>
                                                    </div>
                                                    <div>
                                                        {el.group.name} 
                                                    </div>
                                                </li>
                                                {buttonForActionGroup}
                                            </div>
                                })
        }
         
        return(
            <div>
                <div>
                    <form>
                        <input placeholder="Поиск всех групп и пользователей" 
                                value={this.state.searchValue}
                                onChange={this.searchValue}
                        />
                    </form>
                </div>

                <div>
                    <ul>
                        Пользователи:
                        <button onClick={this.goToAllUsers}>Показать всех</button>
                        { listUsersSearch }
                    </ul>
                    <ul>
                        Группы:
                        <button onClick={this.goToAllGroups}>Показать всех</button>
                        { listGroupsSearch }
                    </ul>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        valueSearch: state.allSearchValue
    }
}

const mapDispatchToProps = {
    allSearchValue
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSearchPage)));