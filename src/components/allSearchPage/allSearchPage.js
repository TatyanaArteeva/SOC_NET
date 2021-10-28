import React, {Component} from 'react';
import {connect} from 'react-redux';
import {allSearchValue, idForDialogFriends} from '../../actions';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import SpinnerMini from '../spinnerMini/spinnerMini';
import './allSearchPage.scss';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import cancel from './cancel.svg';

class AllSearchPage extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            searchValue: '',
            searchUsers: [],
            searchGroups: [],
            spinner: true,
            errorUsersSearch: false,
            errorGroupsSearch: false,
            errorActions: false,
            errorActionsMessage:'',
            inErrorModalWindowMouse:false,
            idActionsAdd: '',
            idActionsRemove: '',
            idActionJoinGroup: '',
            idActionsLeaveGroup: ''
        }

        const {Service}=this.props;

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.setState({
                searchValue: this.props.valueSearch
            },()=>{
                Service.getResultForSearch(`/api/account/all?start=0&end=5`, {params:{name: this.state.searchValue}})
                    .then(res=>{
                        console.log(res)
                        this.props.allSearchValue("")
                        if(res.status===200){
                            if(this._cleanupFunction){
                                this.setState({
                                    searchUsers: res.data.accounts,
                                    spinner: false
                                })
                            }
                        }
                    }).catch(err=>{
                        this.props.allSearchValue("")
                        if(this._cleanupFunction){
                            this.setState({
                                spinner: false,
                                errorUsersSearch: true
                            })
                        }
                    })

                Service.getResultForSearch(`/api/group/all?start=0&end=5`, {params:{name: this.state.searchValue}})
                    .then(res=>{
                        console.log(res)
                        this.props.allSearchValue("")
                        if(res.status===200){
                            if(this._cleanupFunction){
                                this.setState({
                                    searchGroups: res.data.groups,
                                    spinner: false
                                })
                            }
                        }
                    }).catch(err=>{
                        this.props.allSearchValue("")
                        if(this._cleanupFunction){
                            this.setState({
                                spinner: false,
                                errorGroupsSearch: true
                            })
                        }
                    })
                })

        }

        this.searchValue=(e)=>{
            this.setState({
                searchValue: e.target.value,
                spinner: true
            })

            Service.getResultForSearch(`/api/account/all?start=0&end=5`, {params:{name: e.target.value}})
            .then(res=>{
                if(res.status===200){
                    this.setState({
                        searchUsers: res.data.accounts,
                        spinner: false
                    })
                }
            }).catch(err=>{
                this.setState({
                    spinner: false,
                    errorUsersSearch: true
                })
            })

            Service.getResultForSearch(`/api/group/all?start=0&end=5`, {params:{name: e.target.value}})
                .then(res=>{
                    if(res.status===200){
                        this.setState({
                            searchGroups: res.data.groups,
                            spinner: false,
                        })
                    }
                }).catch(err=>{
                    this.setState({
                        spinner: false,
                        errorGroupsSearch: true
                    })
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
            this.setState({
                idActionsAdd: id,
                searchUsers: this.state.searchUsers
            });
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
                                                idActionsAdd: '',
                                                searchUsers: newArrItems,
                                            })
                                        })
                                })
                    }
                }).catch(err=>{
                    const error=errorMessageForUser(err.response.data.code);
                    this.setState({
                        errorActions: true,
                        errorActionsMessage: error
                    })
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
                })
        }

        this.cancelAddFriends=(id)=>{
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
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
                                    idActionsRemove: '',
                                    searchUsers: newArrItems
                                })
                            })
                        })
                    }
                }).catch(err=>{
                    const error=errorMessageForUser(err.response.data.code);
                    this.setState({
                        errorActions: true,
                        errorActionsMessage: error
                    })
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
                                    searchUsers: newArrItems,
                                })
                            })
                        })
                })
        }

        this.rejectFriends=(id)=>{
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
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
                                    idActionsRemove: '',
                                    searchUsers: newArrItems,
                                })
                            })
                        })
                }
            }).catch(err=>{
                const error=errorMessageForUser(err.response.data.code);
                this.setState({
                    errorActions: true,
                    errorActionsMessage: error
                })
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
            })
        }

        this.deleteFriends=(id)=>{
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
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
                                    idActionsRemove: '',
                                    searchUsers: newArrItems,
                                })
                            })
                        })
                }
            }).catch(err=>{
                const error=errorMessageForUser(err.response.data.code);
                this.setState({
                    errorActions: true,
                    errorActionsMessage: error
                })
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
            })
        }

        this.writeMessage=(id)=>{
            localStorage.setItem('idForDialogFriends', id);
            this.props.idForDialogFriends(id);
            this.props.history.push('/dialog')
        }

        this.joinGroup=(id)=>{
            this.setState({
                idActionJoinGroup: id,
                searchGroups: this.state.searchGroups
            })
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
                                    idActionJoinGroup: '',
                                    searchGroups: newArrItems
                                })
                            })
                                    
                    }
                }).catch(err=>{
                    const error=errorMessageForUser(err.response.data.code);
                    this.setState({
                        errorActions: true,
                        errorActionsMessage: error
                    })
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
                })
        }

        this.goOutGroup=(id)=>{
            this.setState({
                idActionsLeaveGroup: id,
                searchGroups: this.state.searchGroups
            })
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
                                            idActionsLeaveGroup: '',
                                            searchGroups: newArrItems
                                        })
                                    }) 
                            }
                        }).catch(err=>{
                            const error=errorMessageForUser(err.response.data.code);
                            this.setState({
                                errorActions: true,
                                errorActionsMessage: error
                            })
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
                        })
        }

        this.closeModalWindowErrorActions=()=>{
            this.setState({
                errorActionsMessage: '',
                errorActions: false
            })
        }

        this.inModalWindowErrorBlockTrue=()=>{
            this.setState({
                inErrorModalWindowMouse:true
            })
        }

        this.inModalWindowErrorBlockFalse=()=>{
            this.setState({
                inErrorModalWindowMouse:false
            })
        }

        this.closeModalWindowErrorActionsOverlay=()=>{
            if(!this.state.inErrorModalWindowMouse){
                this.closeModalWindowErrorActions()
            }
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }


    }

    render(){

        if(this.state.errorActions){
            setTimeout(this.closeModalWindowErrorActions, 2000)
        }
        
        let listUsersSearch=null;

        if(this.state.searchUsers.length===0){
            listUsersSearch=<div>
                                Пользователей не найдено
                            </div>;
        }
        if(this.state.searchUsers.length>0){
            listUsersSearch=this.state.searchUsers.map(el=>{
                                let buttonForActionRelationships=null;
                                let btnActionRejectFriend=null;
                                let btnActionWriteMessage=null;
                                let currentStatusUsers="Вы";
                                const btnAddFriends=<button onClick={()=>this.addFriends(el.account.id)} className="search-page__list__content__item__btns_main">Добавить в друзья</button>;
                                const btnCancelAddFriends=<button onClick={()=>this.cancelAddFriends(el.account.id)} className="search-page__list__content__item__btns_warning">Отменить заявку</button>;
                                const btnConfirmAddFriends=<button onClick={()=>this.addFriends(el.account.id)} className="search-page__list__content__item__btns_main">Подтвердить друга</button>;
                                const btnRejectFriend=<button onClick={()=>this.rejectFriends(el.account.id)} className="search-page__list__content__item__btns_warning">Отклонить друга</button>;
                                const btnDeleteFriends= <button onClick={()=>this.deleteFriends(el.account.id)} className="search-page__list__content__item__btns_warning">Удалить из друзей</button>;
                                const btnWriteMessage= <button onClick={()=>this.writeMessage(el.account.id)} className="search-page__list__content__item__btns_main">Написать сообщение</button>;

                                if(el.info.friendRelationStatus==="NO_RELATION"){
                                    buttonForActionRelationships=btnAddFriends;
                                    currentStatusUsers="Не в друзьях"
                                }
                        
                                if(el.info.friendRelationStatus==="OUTPUT"){
                                    buttonForActionRelationships=btnCancelAddFriends;
                                    currentStatusUsers="Хотите быть другом"
                                }
                        
                                if(el.info.friendRelationStatus==="INPUT"){
                                    buttonForActionRelationships=btnConfirmAddFriends;
                                    btnActionRejectFriend=btnRejectFriend
                                    currentStatusUsers="Хочет быть другом"
                                }
                                if(el.info.friendRelationStatus==="FULL"){
                                    buttonForActionRelationships=btnDeleteFriends;
                                    btnActionWriteMessage=btnWriteMessage;
                                    currentStatusUsers="Друзья"
                                }

                                let classListItem="search-page__list__content__item"

                                if(this.state.idActionsAdd===el.account.id && this.state.idActionsAdd.length>0){
                                    classListItem="search-page__list__content__item_warning"
                                }

                                if(this.state.idActionsRemove===el.account.id && this.state.idActionsRemove.length>0){
                                    classListItem="search-page__list__content__item_danger"
                                }

                                return <li key={el.account.id} className={classListItem}>
                                            <div onClick={()=>this.goToUserPage(el.account.id)}>
                                                <img src={"data:image/jpg;base64," + el.account.photo} alt="photoUser" className="search-page__list__content__item_img"/>
                                            </div>
                                            <div className="search-page__list__content__item__wrapper-content">
                                                <span onClick={()=>this.goToUserPage(el.account.id)} className="search-page__list__content__item_name">
                                                    {el.account.firstName} {el.account.lastName}
                                                </span>
                                                <div className="search-page__list__content__item_current-status"><span>{currentStatusUsers}</span></div>
                                                <div className="search-page__list__content__item__btns">
                                                    {buttonForActionRelationships}
                                                    {btnActionRejectFriend}
                                                    {btnActionWriteMessage}
                                                </div>
                                            </div>
                                        </li>
                            })
        }

        if(this.state.errorUsersSearch){
            listUsersSearch=<div>
                                Что-то пошло не так!
                            </div>;
        }


        let listGroupsSearch=null;

        if(this.state.searchGroups.length===0){
            listGroupsSearch=<div>
                            Групп не найдено
                        </div>;
        }

        if(this.state.searchGroups.length>0){
            listGroupsSearch=  this.state.searchGroups.map(el=>{
                                    let buttonForActionGroup=null;
                                    let currentStatusGroup="Создатель группы"
                                    const joinGroup=<button onClick={()=>this.joinGroup(el.group.id)} className="search-page__list__content__item__btns_main">Вступить в группу</button>
                                    const goOutGroup=<button onClick={()=>this.goOutGroup(el.group.id)} className="search-page__list__content__item__btns_warning">Выйти из группы</button>
                                    if(el.info.groupRelationStatus==="NONE"){
                                        buttonForActionGroup=joinGroup;
                                        currentStatusGroup="Не состоите в группе";
                                    }
                                
                                    if(el.info.groupRelationStatus==="PARTICIPANT"){
                                        buttonForActionGroup=goOutGroup;
                                        currentStatusGroup="Состоите в группе";
                                    }

                                    let classListItem="search-page__list__content__item"

                                    if(this.state.idActionJoinGroup===el.group.id && this.state.idActionJoinGroup.length>0){
                                        classListItem="search-page__list__content__item_warning"
                                    }
    
                                    if(this.state.idActionsLeaveGroup===el.group.id && this.state.idActionsLeaveGroup.length>0){
                                        classListItem="search-page__list__content__item_danger"
                                    }

                                    return <li key={el.group.id} className={classListItem}>
                                                <div onClick={()=>this.goToGroupsPage(el.group.id)}>
                                                    <img src={"data:image/jpg;base64," + el.group.photo} alt="photoUser" className="search-page__list__content__item_img"/>
                                                </div>
                                                <div className="search-page__list__content__item__wrapper-content">
                                                    <span onClick={()=>this.goToGroupsPage(el.group.id)} className="search-page__list__content__item_name">
                                                        {el.group.name} 
                                                    </span>
                                                    <div className="search-page__list__content__item_current-status"><span>{currentStatusGroup}</span></div>
                                                    <div className="search-page__list__content__item__btns">
                                                        {buttonForActionGroup}
                                                    </div>
                                                </div>
                                            </li>
                                })
        }

        if(this.state.errorGroupsSearch){
            listGroupsSearch=<div>
                                Что-то пошло не так!
                            </div>;
        }

        let modalWindowErrorActionsUsersAndGroups=null;

        if(this.state.errorActions){
            modalWindowErrorActionsUsersAndGroups=<div className="search-page__overlay" onClick={this.closeModalWindowErrorActionsOverlay}>
                                                        <div className="search-page__modal" onMouseEnter={this.inModalWindowErrorBlockTrue} onMouseLeave={this.inModalWindowErrorBlockFalse}>
                                                            <div className="search-page__modal_close">
                                                                <img src={cancel} alt="cancel" onClick={this.closeModalWindowErrorActions} />
                                                            </div>
                                                            <div className="search-page__modal_message">
                                                                {this.state.errorActionsMessage}
                                                            </div>
                                                        </div>
                                                    </div>
        }


        const content=this.state.spinner ? <SpinnerMini/> : <div>
                                                                <ul className="search-page__list">
                                                                    <div className="search-page__list__wrapper">
                                                                        <span className="search-page__list__title">Пользователи:</span>
                                                                        <button onClick={this.goToAllUsers} className="search-page__list__btn-show-all">Показать больше</button>
                                                                    </div>
                                                                    <div className="search-page__list__content">
                                                                        {/* {contentUsers} */}
                                                                        {listUsersSearch}
                                                                    </div>
                                                                </ul>
                                                                <ul className="search-page__list">
                                                                    <div className="search-page__list__wrapper">
                                                                        <span className="search-page__list__title">Группы:</span>
                                                                        <button onClick={this.goToAllGroups} className="search-page__list__btn-show-all">Показать больше</button>
                                                                    </div>
                                                                    <div className="search-page__list__content">
                                                                        {/* {contentGroups} */}
                                                                        {listGroupsSearch}
                                                                    </div>
                                                                </ul>
                                                            </div>
         
        return(
            <div className="search-page">
                <div>
                    <form>
                        <input placeholder="Поиск всех групп и пользователей" 
                                value={this.state.searchValue}
                                onChange={this.searchValue}
                                className='search-page__search'
                        />
                    </form>
                </div>
                {content}
                {modalWindowErrorActionsUsersAndGroups}
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
    allSearchValue,
    idForDialogFriends
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSearchPage)));