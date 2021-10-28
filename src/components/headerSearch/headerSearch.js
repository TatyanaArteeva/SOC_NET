import React, {Component} from 'react';
import './headerSearch.scss';
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {allSearchValue} from '../../actions';
import { withRouter } from "react-router";
import MyPage from '../myPage/myPage';
import Group from '../group/group';
import search from './search.svg';
import Spinner from '../spinnerMini/spinnerMini';



class HeaderSearch extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            searchValue: '',
            searchUsers:[],
            searchGroups:[],
            transition: false,
            errorUsers: false,
            errorGroups: false,
            spinner: false,
            
        }

        const {Service}=this.props;

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false;
        }

        
        this.searchInput=(e)=>{
            this.setState({
                searchValue: e.target.value
            })
            this.setState({
                spinner: true
            })
            Service.getResultForSearch(`/api/account/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        if(this._cleanupFunction){
                            this.setState({
                                searchUsers: res.data.accounts,
                                spinner: false,
                            })
                        }
                    }
                }).catch(err=>{
                    if(this._cleanupFunction){
                        this.setState({
                            spinner: false,
                            errorUsers: true
                        })
                    }
                })
            Service.getResultForSearch(`/api/group/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    if(res.status===200){
                        if(this._cleanupFunction){
                            this.setState({
                                searchGroups: res.data.groups,
                                spinner:false
                            })
                        }
                    }
                }).catch(err=>{
                    if(this._cleanupFunction){
                        this.setState({
                            spinner:false,
                            errorGroups:true
                        })
                    }
                })
            
        }

        this.saveSearchValue=(e)=>{
            this.props.allSearchValue(this.state.searchValue);
            this.setState({
                searchValue: ''
            },()=>{
                e.preventDefault();
                this.props.history.push('/search')
            });
        }

        
        this.goToUsersPage=(id)=>{
            this.setState({
                searchValue: ''
            })
            this.props.history.push(`/${id}`)
            return <MyPage idInUrl={id}/>
        }

        this.goToGroupPage=(id)=>{
            this.setState({
                searchValue: ''
            })
            this.props.history.push(`groups/${id}`)
            return <Group idInUrl={id}/>
        }


        this.keyPressEnter=(e)=>{
            if(e.key==='Enter'){
                if(e.target.value.length===0){
                    e.preventDefault();
                    this.props.history.push('/search')
                }

                if(e.target.value.length>0){
                    this.props.allSearchValue(this.state.searchValue);
                    this.setState({
                        searchValue: ''
                    },()=>{
                        if(this.state.searchValue.length===0){
                            e.preventDefault();
                            this.props.history.push('/search')
                        }
                    });

                }
            }
        }

        const searchButton=document.querySelector('.header-search-form__wrapper__button');

        window.addEventListener("click", (e)=>{
            if(e.target!==searchButton){
                if(this._cleanupFunction){
                    this.setState({
                        searchValue: ''
                    })
                }
            }
        })

    }

    render(){
        
        let styleForSearchList="header-search-form__wrapper__list";
        if(this.state.searchValue.length>0){
            styleForSearchList +=" active-header-search-list";
        }

        let listUsersSearch=null;

        if(!this.state.spinner && this.state.searchUsers.length===0){
            listUsersSearch=<div className="header-search-form__wrapper__list__null">
                                Пользователей не найдено
                            </div>;
        }

        if(this.state.errorUsers && !this.state.spinner){
            listUsersSearch=<div className="header-search-form__wrapper__list__null">
                                Что-то пошло не так! Пользователи не доступны!
                            </div>;
        }

        if(this.state.searchUsers.length>0 && !this.state.spinner){
            listUsersSearch=this.state.searchUsers.map(el=>{
                                return <li key={el.account.id} 
                                            className="header-search-form__wrapper__list__item"
                                            onClick={()=>this.goToUsersPage(el.account.id)}
                                            >
                                            <div className="header-search-form__wrapper__list__item__img">
                                                <img src={"data:image/jpg;base64," + el.account.photo} alt="photoUser"/>
                                            </div>
                                            <div className="header-search-form__wrapper__list__item__name">
                                                {el.account.firstName} {el.account.lastName}
                                            </div>
                                        </li>
                            })
        }

        let listGroupsSearch=null;

        if(!this.state.spinner && this.state.searchGroups.length===0){
            listGroupsSearch=<div className="header-search-form__wrapper__list__null">
                                Групп не найдено
                            </div>;
        }

        if(!this.state.spinner && this.state.errorGroups){
            listGroupsSearch=<div className="header-search-form__wrapper__list__null">
                                Что-то пошлоне так! Группы не найдены!
                            </div>;
        }

        if(this.state.searchGroups.length>0 && !this.state.spinner){
            listGroupsSearch=  this.state.searchGroups.map(el=>{
                                    return <li key={el.group.id} 
                                                className="header-search-form__wrapper__list__item"
                                                onClick={()=>this.goToGroupPage(el.group.id)}
                                                >
                                                <div className="header-search-form__wrapper__list__item__img">
                                                    <img src={"data:image/jpg;base64," + el.group.photo} alt="photoUser"/>
                                                </div>
                                                <div className="header-search-form__wrapper__list__item__name">
                                                    {el.group.name} 
                                                </div>
                                            </li>
                                })
        }

        const content=this.state.spinner ? <Spinner/> : <>
                                                            <ul>
                                                                <span className="header-search-form__title">Пользователи</span>
                                                                    {listUsersSearch}
                                                            </ul>
                                                            <ul>
                                                                <span className="header-search-form__title">Группы</span>
                                                                    {listGroupsSearch}
                                                            </ul>
                                                        </>
        

        return(
            <form className="header-search-form">
                <div className="header-search-form__wrapper">
                    <input type="text" className="header-search-form__wrapper__search" placeholder="Поиск по всем группам и пользователям" onChange={this.searchInput} value={this.state.searchValue}  onKeyPress={this.keyPressEnter}/>
                    <span className="header-search-form__wrapper__button" onClick={this.saveSearchValue}><img src={search} alt="search"/></span>
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
    allSearchValue
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderSearch)));
