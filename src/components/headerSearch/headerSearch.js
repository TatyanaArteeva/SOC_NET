import React, { Component } from 'react';
import './headerSearch.scss';
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import { allSearchValue, checkingForAuthorization, unsubscribe } from '../../actions';
import { withRouter } from "react-router";
import MyPage from '../myPage/myPage';
import Group from '../group/group';
import search from './search.svg';
import Spinner from '../spinnerMini/spinnerMini';

class HeaderSearch extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchUsers: [],
            searchGroups: [],
            transition: false,
            errorUsers: false,
            errorGroups: false,
            spinner: false,
        }

        const { Service, checkingForAuthorization, allSearchValue, history, unsubscribe } = this.props;

        this.componentDidMount = () => {
            this._cleanupFunction = true;
        }

        this.componentWillUnmount = () => {
            this._cleanupFunction = false;
        }

        this.searchInput = (e) => {
            this.setState({
                searchValue: e.target.value
            })
            this.setState({
                spinner: true
            })
            Service.getResultForSearch(`/api/account/all?start=0&end=3`,
                { params: { name: e.target.value } })
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            this.setState({
                                searchUsers: res.data.accounts,
                                spinner: false,
                            })
                        }
                    }
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            errorUsers: true
                        })
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    }
                })
            Service.getResultForSearch(`/api/group/all?start=0&end=3`,
                { params: { name: e.target.value } })
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            this.setState({
                                searchGroups: res.data.groups,
                                spinner: false
                            })
                        }
                    }
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            errorGroups: true
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.saveSearchValue = (e) => {
            allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            }, () => {
                e.preventDefault();
                history.push('/search')
            });
        }

        this.goToUsersPage = (id) => {
            this.setState({
                searchValue: ''
            })
            history.push(`/account/${id}`)
            return <MyPage idInUrl={id} />
        }

        this.goToGroupPage = (id) => {
            this.setState({
                searchValue: ''
            })
            history.push(`groups/${id}`)
            return <Group idInUrl={id} />
        }

        this.keyPressEnter = (e) => {
            if (e.key === 'Enter') {
                if (e.target.value.length === 0) {
                    e.preventDefault();
                    history.push('/search')
                }
                if (e.target.value.length > 0) {
                    allSearchValue(this.state.searchValue);
                    this.setState({
                        searchValue: ''
                    }, () => {
                        if (this.state.searchValue.length === 0) {
                            e.preventDefault();
                            history.push('/search')
                        }
                    });
                }
            }
        }

        window.addEventListener("click", (e) => {
            const searchButton = document.querySelector('.header-search-form__wrapper__button');
            if (e.target !== searchButton) {
                if (this._cleanupFunction) {
                    this.setState({
                        searchValue: ''
                    })
                }
            }
        })
    }

    render() {

        let styleForSearchList = "header-search-form__wrapper__list";
        let listUsersSearch = null;
        let listGroupsSearch = null;

        const {
            searchValue,
            spinner,
            searchUsers,
            errorUsers,
            searchGroups,
            errorGroups } = this.state;

        if (searchValue.length > 0) {
            styleForSearchList += " active-header-search-list";
        }

        if (!spinner && searchUsers.length === 0) {
            listUsersSearch = <div className="header-search-form__wrapper__list__null">
                Пользователей не найдено
            </div>;
        }

        if (errorUsers && !spinner) {
            listUsersSearch = <div className="header-search-form__wrapper__list__null">
                Что-то пошло не так! Пользователи не доступны!
            </div>;
        }

        if (searchUsers.length > 0 && !spinner) {
            listUsersSearch = searchUsers.map(el => {
                return <li key={el.account.id}
                    className="header-search-form__wrapper__list__item"
                    onClick={() => this.goToUsersPage(el.account.id)}
                >
                    <div className="header-search-form__wrapper__list__item__img">
                        <img src={"data:image/jpg;base64," + el.account.photo} alt="photoUser" />
                    </div>
                    <div className="header-search-form__wrapper__list__item__name">
                        {el.account.firstName} {el.account.lastName}
                    </div>
                </li>
            })
        }

        if (!spinner && searchGroups.length === 0) {
            listGroupsSearch = <div className="header-search-form__wrapper__list__null">
                Групп не найдено
            </div>;
        }

        if (!spinner && errorGroups) {
            listGroupsSearch = <div className="header-search-form__wrapper__list__null">
                Что-то пошлоне так! Группы не найдены!
            </div>;
        }

        if (searchGroups.length > 0 && !spinner) {
            listGroupsSearch = searchGroups.map(el => {
                return <li key={el.group.id}
                    className="header-search-form__wrapper__list__item"
                    onClick={() => this.goToGroupPage(el.group.id)}
                >
                    <div className="header-search-form__wrapper__list__item__img">
                        <img src={"data:image/jpg;base64," + el.group.photo} alt="photoUser" />
                    </div>
                    <div className="header-search-form__wrapper__list__item__name">
                        {el.group.name}
                    </div>
                </li>
            })
        }

        const content = spinner ? <Spinner /> : <>
            <ul>
                <span className="header-search-form__title">Пользователи</span>
                {listUsersSearch}
            </ul>
            <ul>
                <span className="header-search-form__title">Группы</span>
                {listGroupsSearch}
            </ul>
        </>

        return (
            <form className="header-search-form">
                <div className="header-search-form__wrapper">
                    <input type="text"
                        className="header-search-form__wrapper__search"
                        placeholder="Поиск по всем группам и пользователям"
                        onChange={this.searchInput}
                        value={searchValue}
                        onKeyPress={this.keyPressEnter}
                    />
                    <span className="header-search-form__wrapper__button"
                        onClick={this.saveSearchValue}>
                        <img src={search} alt="search" />
                    </span>
                    <div className={styleForSearchList}>
                        {content}
                    </div>
                </div>
            </form>
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
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderSearch)))
