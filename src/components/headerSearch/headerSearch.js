import React, {Component} from 'react';
import './headerSearch.scss';
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {allSearchValue} from '../../actions';
import { withRouter } from "react-router";
import MyPage from '../myPage/myPage';
import Group from '../group/group';
import search from './search.svg';
import SpinnerUsers from '../spinner/spinner';
import SpinnerGroups from '../spinner/spinner';


class HeaderSearch extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            searchValue: '',
            searchUsers:[],
            searchGroups:[],
            transition: false,
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
                spinnerUsers: true,
                spinnerGroups: true,
            })
            Service.getResultForSearch(`/api/account/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        console.log(this._cleanupFunction)
                        if(this._cleanupFunction){
                            this.setState({
                                searchUsers: res.data.accounts,
                                spinnerUsers: false
                            })
                        }
                    }
                })
            Service.getResultForSearch(`/api/group/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    if(res.status===200){
                        if(this._cleanupFunction){
                            this.setState({
                                searchGroups: res.data.groups,
                                spinnerGroups:false
                            })
                        }
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
            styleForSearchList +=" active";
        }

        let listUsersSearch=null;

        if(!this.state.spinnerUsers && this.state.searchUsers.length===0){
            listUsersSearch=<div className="header-search-form__wrapper__list__null">
                                Пользователей не найдено
                            </div>;
        }

        if(this.state.searchUsers.length>0 && !this.state.spinnerUsers){
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

        if(!this.state.spinnerGroups && this.state.searchGroups.length===0){
            listGroupsSearch=<div className="header-search-form__wrapper__list__null">
                                Групп не найдено
                            </div>;
        }

        if(this.state.searchGroups.length>0 && !this.state.spinnerGroups){
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

        const contentGroups=this.state.spinnerGroups? <SpinnerGroups/> : listUsersSearch;
        const contentUsers=this.state.spinnerUsers ? <SpinnerUsers/> : listGroupsSearch;
        

        return(
            <form className="header-search-form">
                <div className="header-search-form__wrapper">
                    <input type="text" className="header-search-form__wrapper__search" placeholder="Поиск по всем группам и пользователям" onChange={this.searchInput} value={this.state.searchValue}  onKeyPress={this.keyPressEnter}/>
                    {/* <button className="header-search-form__wrapper__button" onClick={this.saveSearchValue}>Найти</button> */}
                    <span className="header-search-form__wrapper__button" onClick={this.saveSearchValue}><img src={search} alt="search"/></span>
                    <div className={styleForSearchList}>
                    <ul>
                        <span>Пользователи</span>
                            {contentUsers}
                        {/* { listUsersSearch } */}
                    </ul>
                    <ul>
                        <span>Группы</span>
                            {contentGroups}
                        {/* { listGroupsSearch } */}
                    </ul>
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
