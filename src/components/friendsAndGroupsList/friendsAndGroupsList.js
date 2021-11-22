import React, { Component } from 'react';
import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import { allSearchValue, idForDialogFriends, checkingForAuthorization, unsubscribe } from '../../actions';
import Spinner from '../spinnerMini/spinnerMini';
import SpinnerMini from '../spinnerMini/spinnerMini';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
import cancel from './cancel.svg';

class FriendsAndGroupsList extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            req: false,
            heightList: '',
            totalSize: '',
            searchValue: '',
            spinner: true,
            miniSpinner: false,
            errorAction: false,
            errorMessageWithActions: '',
            inBlockErrorMessage: false,
            error: false
        }

        this.refList = React.createRef();

        const {
            Service,
            valueSearch,
            getItems,
            allSearchValue,
            arrItems,
            totalSize,
            checkingForAuthorization,
            path,
            titleItem,
            renderItems,
            arrItemModification,
            idForDialogFriends,
            history,
            arrItemsSearch,
            unsubscribe } = this.props;

        let start = 0;
        let end = 10;

        this.getItemsFunc = () => {
            this.setState({
                searchValue: valueSearch
            })
            start = 0;
            end = 10;
            if (valueSearch.length > 0) {
                this.setState({
                    spinner: true
                })
                Service.getItems(getItems(start, end), { params: { name: valueSearch } })
                    .then(res => {
                        allSearchValue("")
                        if (this._cleanupFunction) {
                            this.setState({
                                totalSizeState: res.data.totalSize,
                                spinner: false
                            })
                            arrItems(res.data);
                            totalSize(res.data.totalSize)
                        }
                    }).catch(err => {
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                error: true
                            })
                        }
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            } else {
                Service.getItems(getItems(start, end))
                    .then(res => {
                        if (res.status === 200) {
                            if (this._cleanupFunction) {
                                this.setState({
                                    totalSizeState: res.data.totalSize,
                                    spinner: false
                                })
                                arrItems(res.data);
                                totalSize(res.data.totalSize)
                            }
                        }
                    }).catch(err => {
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                error: true
                            })
                        }
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
        }

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            this.getItemsFunc()
        }

        this.componentDidUpdate = () => {
            if (this.refList.current !== null && this.refList.current !== undefined & !this.state.error) {
                const heightList = this.refList.current.scrollHeight;
                if (heightList !== this.state.heightList) {
                    if (this._cleanupFunction) {
                        this.setState({
                            heightList: heightList
                        })
                    }
                }
                const windowHeight = document.documentElement.clientHeight;
                window.addEventListener("scroll", () => {
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if ((scrollTop + windowHeight) >= (this.state.heightList / 100 * 80) && !this.state.req) {
                        start = end;
                        end = end + 10;
                        if (start === this.state.totalSizeState) {
                            return
                        }
                        if (start > this.state.totalSizeState) {
                            return
                        }
                        if (end > this.state.totalSizeState) {
                            end = this.state.totalSizeState
                        }
                        if (this._cleanupFunction) {
                            this.setState({
                                req: true,
                                miniSpinner: true
                            })
                        }
                        if (this.state.searchValue.length > 0) {
                            Service.getResultForSearch(getItems(start, end),
                                { params: { name: this.state.searchValue } })
                                .then(res => {
                                    if (this._cleanupFunction) {
                                        this.setState({
                                            totalSizeState: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        arrItems(res.data)
                                        totalSize(res.data.totalSize)
                                    }
                                }).catch(err => {
                                    if (this._cleanupFunction) {
                                        this.setState({
                                            spinner: false,
                                            error: true
                                        })
                                    }
                                    if (err.response.status === 401) {
                                        unsubscribe()
                                        checkingForAuthorization();
                                    }
                                })
                        } else {
                            Service.getItems(getItems(start, end))
                                .then(res => {
                                    if (this._cleanupFunction) {
                                        this.setState({
                                            totalSizeState: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        arrItems(res.data)
                                        totalSize(res.data.totalSize)
                                    }
                                }).catch(err => {
                                    if (this._cleanupFunction) {
                                        this.setState({
                                            spinner: false,
                                            error: true
                                        })
                                    }
                                    if (err.response.status === 401) {
                                        unsubscribe()
                                        checkingForAuthorization();
                                    }
                                })
                        }
                    }
                })
            }
        }

        this.componentWillUnmount = () => {
            window.removeEventListener('scroll', () => { })
            this._cleanupFunction = false
        }

        this.getAccountInfoGroupFunc = (id) => {
            Service.getGroup(`/api/group/${id}/page-info`)
                .then(res => {
                    arrItemModification(res.data)
                })
        }

        this.requestGroup = (path, id) => {
            titleItem(renderItems, this.goToItem, this.btnAction, this.writeMessage)
            Service.postActionsGroups(path)
                .then(res => {
                    if (res.status === 200) {
                        this.getAccountInfoGroupFunc(id)
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                error: true
                            })
                        }
                        unsubscribe()
                        checkingForAuthorization();
                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        this.getAccountInfoGroupFunc(id)
                        if (this._cleanupFunction) {
                            this.setState({
                                errorAction: true,
                                errorMessageWithActions: error
                            })
                        }
                    }
                })
        }

        this.noneRelationStatusFunc = (id) => {
            this.requestGroup(`/api/group-relation/join-group/${id}`, id)
        }

        this.participantRelationStatus = (id) => {
            this.requestGroup(`/api/group-relation/leave-group/${id}`, id)
        }

        this.getAccountInfoFunc = (id) => {
            let objInfo = {};
            let photo = null;
            Service.getAccountInfo(`/api/account/${id}/page-info`)
                .then(res => {
                    objInfo = res.data;
                    Service.getAccountPhoto(`/api/account/${id}/photo`, {
                        responseType: 'arraybuffer'
                    })
                        .then(res => {
                            photo = Buffer.from(res.data, 'binary').toString('base64');
                        })
                        .then(res => {
                            photo = objInfo.account['photo'] = photo;
                            arrItemModification(objInfo)
                        })
                })
        }

        this.requestUser = (path, id) => {
            titleItem(renderItems, this.goToItem, this.btnAction, this.writeMessage);
            Service.postActionsFriends(path)
                .then(res => {
                    if (res.status === 200) {
                        this.getAccountInfoFunc(id)
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        if (this._cleanupFunction) {
                            this.setState({
                                spinner: false,
                                error: true
                            })
                        }
                        unsubscribe()
                        checkingForAuthorization()
                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        if (this._cleanupFunction) {
                            this.setState({
                                errorAction: true,
                                errorMessageWithActions: error
                            })
                        }
                        this.getAccountInfoFunc(id)
                    }
                })
        }

        this.noRelationStatus = (id) => {
            this.requestUser(`/api/friend/addFriend/${id}`, id)
        }

        this.outputRelationStatus = (id) => {
            this.requestUser(`/api/friend/removeFriend/${id}`, id)
        }

        this.inputRelationStatus = (id) => {
            this.requestUser(`/api/friend/addFriend/${id}`, id)
        }

        this.inputRejectRelationStatus = (id) => {
            this.requestUser(`/api/friend/rejectFriend/${id}`, id)
        }

        this.fullRelationStatus = (id) => {
            this.requestUser(`/api/friend/removeFriend/${id}`, id)
        }

        this.btnAction = (id, status) => {
            if (status === "NONE") {
                this.noneRelationStatusFunc(id)
            }
            if (status === "PARTICIPANT") {
                this.participantRelationStatus(id)
            }
            if (status === "NO_RELATION") {
                this.noRelationStatus(id)
            }
            if (status === "OUTPUT") {
                this.outputRelationStatus(id)
            }
            if (status === "INPUT") {
                this.inputRelationStatus(id)
            }
            if (status === "INPUT-REJECT") {
                this.inputRejectRelationStatus(id)
            }
            if (status === "FULL") {
                this.fullRelationStatus(id)
            }
        }

        this.writeMessage = (id) => {
            localStorage.setItem('idForDialogFriends', id);
            idForDialogFriends(id);
            history.push('/dialog')
        }

        this.postRequestByClickForSearch = (e) => {
            start = 0;
            end = 10;
            this.setState({
                searchValue: e.target.value,
                spinner: true
            })
            Service.getResultForSearch(getItems(start, end), { params: { name: e.target.value } })
                .then(res => {
                    if (this._cleanupFunction) {
                        this.setState({
                            totalSizeState: res.data.totalSize,
                            spinner: false
                        })
                        arrItemsSearch(res.data);
                        totalSize(res.data.totalSize)
                    }
                }).catch(err => {
                    this.setState({
                        spinner: false,
                        error: true
                    })
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization()
                    }
                })
        }

        this.closeModalWindowErrorActions = () => {
            this.setState({
                errorAction: false,
                errorMessageWithActions: ''
            })
        }

        this.inBlockErrorMessageTrue = () => {
            this.setState({
                inBlockErrorMessage: true
            })
        }

        this.inBlockErrorMessageFalse = () => {
            this.setState({
                inBlockErrorMessage: false
            })
        }

        this.closeModalWindowErrorActionsOverlay = () => {
            if (this.state.inBlockErrorMessage === false) {
                this.closeModalWindowErrorActions()
            }
        }

        this.goToItem = (id) => {
            path(id)
        }

        this.keyPressEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                return
            }
        }

    }

    render() {

        let contentAndMessageNotContent = null;
        let modalWindowErrorMessageActions = null;

        const {
            errorAction,
            errorMessageWithActions,
            error,
            miniSpinner,
            spinner,
            searchValue } = this.state;

        const {
            renderItems,
            messageNotContent,
            titleItem,
            nameList,
            totalSizeReturn,
            searchName } = this.props;

        if (errorAction) {
            modalWindowErrorMessageActions = <div className="friends-and-groups-list__overlay"
                onClick={() => this.closeModalWindowErrorActionsOverlay()}>
                <div className="friends-and-groups-list__modal"
                    onMouseEnter={this.inBlockErrorMessageTrue}
                    onMouseLeave={this.inBlockErrorMessageFalse}>
                    <div className="friends-and-groups-list__modal_close">
                        <img src={cancel}
                            alt="cancel"
                            onClick={() => this.closeModalWindowErrorActions()}
                        />
                    </div>
                    <div className="friends-and-groups-list__modal_message">
                        {errorMessageWithActions}
                    </div>
                </div>
            </div>
        }

        if (errorAction) {
            setTimeout(this.closeModalWindowErrorActions, 2000)
        }

        if (renderItems.length === 0) {
            contentAndMessageNotContent = <div className="friends-and-groups-list__not-content">
                {messageNotContent}
            </div>
        }

        if (renderItems.length === 0 && error) {
            contentAndMessageNotContent = <div className="friends-and-groups-list__not-content">
                Что-то пошло не так! Контент не доступен!
            </div>
        }

        if (renderItems.length > 0) {
            contentAndMessageNotContent = <div>
                {titleItem(renderItems, this.goToItem, this.btnAction, this.writeMessage)}
            </div>
        }

        const miniSpinnerBlock = miniSpinner ? <SpinnerMini /> : null;

        const contentGroupsOrFriends = <div className="friends-and-groups-list__wrapper-content"
            ref={this.refList}>
            <div className="friends-and-groups-list__total-size">
                <span className="friends-and-groups-list__total-size_title">Всего {nameList}: </span>
                <span className="friends-and-groups-list__total-size_size">{totalSizeReturn}</span>
            </div>
            <ul className="friends-and-groups-list__list">
                {contentAndMessageNotContent}
                {miniSpinnerBlock}
            </ul>
        </div>

        const content = spinner ? <Spinner /> : contentGroupsOrFriends;

        return (
            <div className="friends-and-groups-list">
                <div className="friends-and-groups-list__wrapper-search">
                    <input
                        type="text"
                        placeholder={searchName}
                        onChange={(e) => this.postRequestByClickForSearch(e)}
                        value={searchValue}
                        className="friends-and-groups-list__search"
                        onKeyPress={this.keyPressEnter}
                    />
                </div>
                {content}
                {modalWindowErrorMessageActions}
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

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(FriendsAndGroupsList)))