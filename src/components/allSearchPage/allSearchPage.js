import React, { Component } from 'react';
import { connect } from 'react-redux';
import { allSearchValue, idForDialogFriends, checkingForAuthorization, unsubscribe } from '../../actions';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import SpinnerMini from '../spinnerMini/spinnerMini';
import './allSearchPage.scss';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import cancel from './cancel.svg';

class AllSearchPage extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchUsers: [],
            searchGroups: [],
            spinner: true,
            errorUsersSearch: false,
            errorGroupsSearch: false,
            errorActions: false,
            errorActionsMessage: '',
            inErrorModalWindowMouse: false,
            idActionsAdd: '',
            idActionsRemove: '',
            idActionJoinGroup: '',
            idActionsLeaveGroup: ''
        }

        const { Service,
            valueSearch,
            allSearchValue,
            checkingForAuthorization,
            unsubscribe,
            history,
            idForDialogFriends } = this.props;

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            this.setState({
                searchValue: valueSearch
            }, () => {
                Service.getResultForSearch(`/api/account/all?start=0&end=5`,
                    { params: { name: this.state.searchValue } })
                    .then(res => {
                        allSearchValue("")
                        if (res.status === 200) {
                            if (this._cleanupFunction) {
                                this.setState({
                                    searchUsers: res.data.accounts,
                                    spinner: false
                                })
                            }
                        }
                    }).catch(err => {
                        allSearchValue("")
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                errorUsersSearch: true
                            })
                        }
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
                Service.getResultForSearch(`/api/group/all?start=0&end=5`,
                    { params: { name: this.state.searchValue } })
                    .then(res => {
                        allSearchValue("")
                        if (res.status === 200) {
                            if (this._cleanupFunction) {
                                this.setState({
                                    searchGroups: res.data.groups,
                                    spinner: false
                                })
                            }
                        }
                    }).catch(err => {
                        allSearchValue("")
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                errorGroupsSearch: true
                            })
                        }
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            })
        }

        this.componentWillUnmount = () => {
            allSearchValue("")
            this._cleanupFunction = false
        }

        this.componentDidUpdate = (prevProps) => {
            if ((this.props.valueSearch !== this.state.searchValue) && (this.props.valueSearch.length !== 0) &&
                (prevProps.valueSearch !== this.props.valueSearch)) {
                if (this._cleanupFunction) {
                    this.setState({
                        searchValue: this.props.valueSearch,
                        spinner: true
                    })
                }
                Service.getResultForSearch(`/api/account/all?start=0&end=5`,
                    { params: { name: this.props.valueSearch } })
                    .then(res => {
                        if (res.status === 200) {
                            this.props.allSearchValue("")
                            if (this._cleanupFunction) {
                                this.setState({
                                    searchUsers: res.data.accounts,
                                    spinner: false
                                })
                            }
                        }
                    }).catch(err => {
                        this.setState({
                            spinner: false,
                            errorUsersSearch: true
                        })
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
                Service.getResultForSearch(`/api/group/all?start=0&end=5`,
                    { params: { name: this.props.valueSearch } })
                    .then(res => {
                        if (res.status === 200) {
                            this.props.allSearchValue("")
                            if (this._cleanupFunction) {
                                this.setState({
                                    searchGroups: res.data.groups,
                                    spinner: false,
                                })
                            }
                        }
                    }).catch(err => {
                        this.setState({
                            spinner: false,
                            errorGroupsSearch: true
                        })
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
        }

        this.searchValue = (e) => {
            if (this._cleanupFunction) {
                this.setState({
                    searchValue: e.target.value,
                    spinner: true
                })
            }
            Service.getResultForSearch(`/api/account/all?start=0&end=5`,
                { params: { name: e.target.value } })
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            this.setState({
                                searchUsers: res.data.accounts,
                                spinner: false
                            })
                        }
                    }
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            errorUsersSearch: true
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
            Service.getResultForSearch(`/api/group/all?start=0&end=5`,
                { params: { name: e.target.value } })
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            this.setState({
                                searchGroups: res.data.groups,
                                spinner: false,
                            })
                        }
                    }
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            errorGroupsSearch: true
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.addFriendsFinalAction = (newArrItems) => {
            this.setState({
                idActionsAdd: '',
                searchUsers: newArrItems
            })
        }

        this.deviationFriendFinalAction = (newArrItems) => {
            this.setState({
                idActionsRemove: '',
                searchUsers: newArrItems
            })
        }

        this.actionsUser = (path, id, finalAction) => {
            let objInfo = {};
            let photo = null;
            Service.postActionsFriends(path)
                .then(res => {
                    if (res.status === 200) {
                        Service.getAccountInfo(`/api/account/${id}/page-info`)
                            .then(res => {
                                objInfo = res.data;
                                Service.getAccountPhoto(`/api/account/${id}/photo`,
                                    { responseType: 'arraybuffer' })
                                    .then(res => {
                                        photo = Buffer.from(res.data, 'binary')
                                            .toString('base64');
                                    })
                                    .then(res => {
                                        photo = objInfo.account['photo'] = photo;
                                        const index = this.state.searchUsers
                                            .findIndex(el => {
                                                return el.account.id === objInfo.account.id
                                            });
                                        const newElem = objInfo;
                                        const newArrItems = [...this.state.searchUsers.slice(0, index),
                                            newElem, ...this.state.searchUsers.slice(index + 1)];
                                        finalAction(newArrItems)
                                    })
                            })
                    }
                }).catch(err => {
                    const error = errorMessageForUser(err.response.data.code);
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                    this.setState({
                        errorActions: true,
                        errorActionsMessage: error
                    })
                    Service.getAccountInfo(`/api/account/${id}/page-info`)
                        .then(res => {
                            objInfo = res.data;
                            Service.getAccountPhoto(`/api/account/${id}/photo`,
                                { responseType: 'arraybuffer' })
                                .then(res => {
                                    photo = Buffer.from(res.data, 'binary')
                                        .toString('base64');
                                })
                                .then(res => {
                                    photo = objInfo.account['photo'] = photo;
                                    const index = this.state.searchUsers
                                        .findIndex(el => {
                                            return el.account.id === objInfo.account.id
                                        });
                                    const newElem = objInfo;
                                    const newArrItems = [...this.state.searchUsers.slice(0, index),
                                        newElem, ...this.state.searchUsers.slice(index + 1)];
                                    this.setState({
                                        searchUsers: newArrItems
                                    })
                                })
                        })
                })
        }

        this.addFriends = (id) => {
            this.setState({
                idActionsAdd: id,
                searchUsers: this.state.searchUsers
            });
            this.actionsUser(`/api/friend/addFriend/${id}`, id, this.addFriendsFinalAction)
        }

        this.cancelAddFriends = (id) => {
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
            this.actionsUser(`/api/friend/removeFriend/${id}`, id, this.deviationFriendFinalAction)
        }

        this.rejectFriends = (id) => {
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
            this.actionsUser(`/api/friend/rejectFriend/${id}`, id, this.deviationFriendFinalAction)
        }

        this.deleteFriends = (id) => {
            this.setState({
                idActionsRemove: id,
                searchUsers: this.state.searchUsers
            });
            this.actionsUser(`/api/friend/removeFriend/${id}`, id, this.deviationFriendFinalAction)
        }

        this.joinGroupFialActions = (newArrItems) => {
            this.setState({
                idActionJoinGroup: '',
                searchGroups: newArrItems
            })
        }

        this.exitGroupFinalActions = (newArrItems) => {
            this.setState({
                idActionsLeaveGroup: '',
                searchGroups: newArrItems
            })
        }

        this.actionGroup = (path, id, finalAction) => {
            Service.postActionsGroups(path)
                .then(res => {
                    if (res.status === 200) {
                        Service.getGroup(`/api/group/${id}/page-info`)
                            .then(res => {
                                const index = this.state.searchGroups
                                    .findIndex(el => {
                                        return el.group.id === res.data.group.id
                                    });
                                const newElem = res.data;
                                const newArrItems = [...this.state.searchGroups.slice(0, index),
                                    newElem,
                                ...this.state.searchGroups.slice(index + 1)];
                                finalAction(newArrItems)
                            })
                    }
                }).catch(err => {
                    const error = errorMessageForUser(err.response.data.code);
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                    this.setState({
                        errorActions: true,
                        errorActionsMessage: error
                    })
                    Service.getGroup(`/api/group/${id}/page-info`)
                        .then(res => {
                            const index = this.state.searchGroups
                                .findIndex(el => {
                                    return el.group.id === res.data.group.id
                                });
                            const newElem = res.data;
                            const newArrItems = [...this.state.searchGroups.slice(0, index),
                                newElem,
                            ...this.state.searchGroups.slice(index + 1)];
                            this.setState({
                                searchGroups: newArrItems
                            })
                        })
                })
        }

        this.joinGroup = (id) => {
            this.setState({
                idActionJoinGroup: id,
                searchGroups: this.state.searchGroups
            })
            this.actionGroup(`/api/group-relation/join-group/${id}`, id, this.joinGroupFialActions,)
        }

        this.goOutGroup = (id) => {
            this.setState({
                idActionsLeaveGroup: id,
                searchGroups: this.state.searchGroups
            })
            this.actionGroup(`/api/group-relation/leave-group/${id}`, id, this.exitGroupFinalActions)
        }

        this.writeMessage = (id) => {
            localStorage.setItem('idForDialogFriends', id);
            idForDialogFriends(id);
            history.push('/dialog')
        }

        this.goToAllGroups = () => {
            allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            });
            history.push('/groups/all')
        }

        this.goToAllUsers = () => {
            allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            });
            history.push('/friends/allUsers')
        }

        this.goToUserPage = (id) => {
            history.push(`/account/${id}`)
        }

        this.goToGroupsPage = (id) => {
            history.push(`/groups/${id}`)
        }

        this.closeModalWindowErrorActions = () => {
            this.setState({
                errorActionsMessage: '',
                errorActions: false
            })
        }

        this.inModalWindowErrorBlockTrue = () => {
            this.setState({
                inErrorModalWindowMouse: true
            })
        }

        this.inModalWindowErrorBlockFalse = () => {
            this.setState({
                inErrorModalWindowMouse: false
            })
        }

        this.closeModalWindowErrorActionsOverlay = () => {
            if (!this.state.inErrorModalWindowMouse) {
                this.closeModalWindowErrorActions()
            }
        }

        this.keyPressEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                return
            }
        }
    }

    render() {

        const { errorActions,
            searchUsers,
            idActionsAdd,
            idActionsRemove,
            errorUsersSearch,
            searchGroups,
            idActionJoinGroup,
            idActionsLeaveGroup,
            errorGroupsSearch,
            errorActionsMessage,
            spinner,
            searchValue } = this.state;

        if (errorActions) {
            setTimeout(this.closeModalWindowErrorActions, 2000)
        }

        let listUsersSearch = null;

        if (searchUsers.length === 0) {
            listUsersSearch = <div>
                Пользователей не найдено
            </div>;
        }

        if (searchUsers.length > 0) {
            listUsersSearch = searchUsers.map(el => {
                let buttonForActionRelationships = null;
                let btnActionRejectFriend = null;
                let btnActionWriteMessage = null;
                let currentStatusUsers = "Вы";
                const btnAddFriends = <button
                    onClick={() => this.addFriends(el.account.id)}
                    className="search-page__list__content__item__btns_main">
                    Добавить в друзья
                </button>;
                const btnCancelAddFriends = <button
                    onClick={() => this.cancelAddFriends(el.account.id)}
                    className="search-page__list__content__item__btns_warning">
                    Отменить заявку
                </button>;
                const btnConfirmAddFriends = <button
                    onClick={() => this.addFriends(el.account.id)}
                    className="search-page__list__content__item__btns_main">
                    Подтвердить друга
                </button>;
                const btnRejectFriend = <button
                    onClick={() => this.rejectFriends(el.account.id)}
                    className="search-page__list__content__item__btns_warning">
                    Отклонить друга
                </button>;
                const btnDeleteFriends = <button
                    onClick={() => this.deleteFriends(el.account.id)}
                    className="search-page__list__content__item__btns_warning">
                    Удалить из друзей
                </button>;
                const btnWriteMessage = <button
                    onClick={() => this.writeMessage(el.account.id)}
                    className="search-page__list__content__item__btns_main">
                    Написать сообщение
                </button>;

                if (el.info.friendRelationStatus === "NO_RELATION") {
                    buttonForActionRelationships = btnAddFriends;
                    currentStatusUsers = "Не в друзьях"
                }

                if (el.info.friendRelationStatus === "OUTPUT") {
                    buttonForActionRelationships = btnCancelAddFriends;
                    currentStatusUsers = "Хотите быть другом"
                }

                if (el.info.friendRelationStatus === "INPUT") {
                    buttonForActionRelationships = btnConfirmAddFriends;
                    btnActionRejectFriend = btnRejectFriend
                    currentStatusUsers = "Хочет быть другом"
                }

                if (el.info.friendRelationStatus === "FULL") {
                    buttonForActionRelationships = btnDeleteFriends;
                    btnActionWriteMessage = btnWriteMessage;
                    currentStatusUsers = "Друзья"
                }

                let classListItem = "search-page__list__content__item"

                if (idActionsAdd === el.account.id && idActionsAdd.length > 0) {
                    classListItem = "search-page__list__content__item_warning"
                }

                if (idActionsRemove === el.account.id && idActionsRemove.length > 0) {
                    classListItem = "search-page__list__content__item_danger"
                }

                return <li key={el.account.id} className={classListItem}>
                    <div onClick={() => this.goToUserPage(el.account.id)}>
                        <img src={"data:image/jpg;base64," + el.account.photo}
                            alt="photoUser"
                            className="search-page__list__content__item_img"
                        />
                    </div>
                    <div className="search-page__list__content__item__wrapper-content">
                        <span onClick={() => this.goToUserPage(el.account.id)}
                            className="search-page__list__content__item_name">
                            {el.account.firstName} {el.account.lastName}
                        </span>
                        <div className="search-page__list__content__item_current-status">
                            <span>
                                {currentStatusUsers}
                            </span>
                        </div>
                        <div className="search-page__list__content__item__btns">
                            {buttonForActionRelationships}
                            {btnActionRejectFriend}
                            {btnActionWriteMessage}
                        </div>
                    </div>
                </li>
            })
        }

        if (errorUsersSearch) {
            listUsersSearch = <div>
                Что-то пошло не так!
            </div>;
        }

        let listGroupsSearch = null;

        if (searchGroups.length === 0) {
            listGroupsSearch = <div>
                Групп не найдено
            </div>;
        }

        if (searchGroups.length > 0) {
            listGroupsSearch = searchGroups.map(el => {
                let buttonForActionGroup = null;
                let currentStatusGroup = "Создатель группы"
                const joinGroup = <button
                    onClick={() => this.joinGroup(el.group.id)}
                    className="search-page__list__content__item__btns_main">
                    Вступить в группу
                </button>
                const goOutGroup = <button onClick={() => this.goOutGroup(el.group.id)}
                    className="search-page__list__content__item__btns_warning">
                    Выйти из группы
                </button>

                if (el.info.groupRelationStatus === "NONE") {
                    buttonForActionGroup = joinGroup;
                    currentStatusGroup = "Не состоите в группе";
                }

                if (el.info.groupRelationStatus === "PARTICIPANT") {
                    buttonForActionGroup = goOutGroup;
                    currentStatusGroup = "Состоите в группе";
                }

                let classListItem = "search-page__list__content__item"

                if (idActionJoinGroup === el.group.id && idActionJoinGroup.length > 0) {
                    classListItem = "search-page__list__content__item_warning"
                }

                if (idActionsLeaveGroup === el.group.id && idActionsLeaveGroup.length > 0) {
                    classListItem = "search-page__list__content__item_danger"
                }

                return <li key={el.group.id} className={classListItem}>
                    <div onClick={() => this.goToGroupsPage(el.group.id)}>
                        <img src={"data:image/jpg;base64," + el.group.photo}
                            alt="photoUser"
                            className="search-page__list__content__item_img"
                        />
                    </div>
                    <div className="search-page__list__content__item__wrapper-content">
                        <span onClick={() => this.goToGroupsPage(el.group.id)}
                            className="search-page__list__content__item_name">
                            {el.group.name}
                        </span>
                        <div className="search-page__list__content__item_current-status">
                            <span>
                                {currentStatusGroup}
                            </span>
                        </div>
                        <div className="search-page__list__content__item__btns">
                            {buttonForActionGroup}
                        </div>
                    </div>
                </li>
            })
        }

        if (errorGroupsSearch) {
            listGroupsSearch = <div>
                Что-то пошло не так!
            </div>;
        }

        let modalWindowErrorActionsUsersAndGroups = null;

        if (errorActions) {
            modalWindowErrorActionsUsersAndGroups = <div className="search-page__overlay"
                onClick={this.closeModalWindowErrorActionsOverlay}>
                <div className="search-page__modal"
                    onMouseEnter={this.inModalWindowErrorBlockTrue}
                    onMouseLeave={this.inModalWindowErrorBlockFalse}>
                    <div className="search-page__modal_close">
                        <img src={cancel} alt="cancel"
                            onClick={this.closeModalWindowErrorActions} />
                    </div>
                    <div className="search-page__modal_message">
                        {errorActionsMessage}
                    </div>
                </div>
            </div>
        }

        const content = spinner ? <SpinnerMini /> : <div>
            <ul className="search-page__list">
                <div className="search-page__list__wrapper">
                    <span className="search-page__list__title">Пользователи:</span>
                    <button onClick={this.goToAllUsers}
                        className="search-page__list__btn-show-all">
                        Показать больше
                    </button>
                </div>
                <div className="search-page__list__content">
                    {listUsersSearch}
                </div>
            </ul>
            <ul className="search-page__list">
                <div className="search-page__list__wrapper">
                    <span className="search-page__list__title">Группы:</span>
                    <button onClick={this.goToAllGroups}
                        className="search-page__list__btn-show-all">
                        Показать больше
                    </button>
                </div>
                <div className="search-page__list__content">
                    {listGroupsSearch}
                </div>
            </ul>
        </div>

        return (
            <div className="search-page">
                <div>
                    <form>
                        <input placeholder="Поиск всех групп и пользователей"
                            value={searchValue}
                            onChange={this.searchValue}
                            className='search-page__search'
                            onKeyPress={this.keyPressEnter}
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
    idForDialogFriends,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSearchPage)));