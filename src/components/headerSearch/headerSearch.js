import React, {Component} from 'react';
import './headerSearch.scss';
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {allSearchValue} from '../../actions';
import { withRouter } from "react-router";
import MyPage from '../myPage/myPage';
import Group from '../group/group';


class HeaderSearch extends Component{
    constructor(props){
        super(props);
        this.state={
            searchValue: '',
            searchUsers:[],
            searchGroups:[],
            transition: false
        }

        const {Service}=this.props;

        
        this.searchInput=(e)=>{
            this.setState({
                searchValue: e.target.value
            })

            Service.getResultForSearch(`/api/account/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    console.log(res)
                    if(res.status===200){
                        this.setState({
                            searchUsers: res.data.accounts
                        })
                    }
                })

            Service.getResultForSearch(`/api/group/all?start=0&end=3`, {params:{name: e.target.value}})
                .then(res=>{
                    if(res.status===200){
                        this.setState({
                            searchGroups: res.data.groups
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

        const searchButton=document.querySelector('.header__search__form__wrapper__button');

        window.addEventListener("click", (e)=>{
            if(e.target!==searchButton){
                this.setState({
                    searchValue: ''
                })
            }
        })

    }

    render(){
        
        let styleForSearchList="header__search__form__wrapper__list";
        if(this.state.searchValue.length>0){
            styleForSearchList +=" active";
        }

        let listUsersSearch=<div>
                                Пользователей не найдено
                            </div>;

        if(this.state.searchUsers.length>0){
            listUsersSearch=this.state.searchUsers.map(el=>{
                                return <li key={el.account.id} 
                                            className="header__search__form__wrapper__list__item"
                                            onClick={()=>this.goToUsersPage(el.account.id)}
                                            >
                                            <div>
                                                <img className="header__search__form__wrapper__list__item__img" src={"data:image/jpg;base64," + el.account.photo} alt="photoUser"/>
                                            </div>
                                            <div>
                                                {el.account.firstName} {el.account.lastName}
                                            </div>
                                        </li>
                            })
        }

        let listGroupsSearch=<div>
                                Групп не найдено
                            </div>;

        if(this.state.searchGroups.length>0){
            listGroupsSearch=  this.state.searchGroups.map(el=>{
                                    return <li key={el.group.id} 
                                                className="header__search__form__wrapper__list__item"
                                                onClick={()=>this.goToGroupPage(el.group.id)}
                                                >
                                                <div>
                                                    <img className="header__search__form__wrapper__list__item__img" src={"data:image/jpg;base64," + el.group.photo} alt="photoUser"/>
                                                </div>
                                                <div>
                                                    {el.group.name} 
                                                </div>
                                            </li>
                                })
        }


        

        return(
            <form className="header__search__form">
                <div className="header__search__form__wrapper">
                    <input type="text" className="header__search__form__wrapper__search" placeholder="Поиск по всем группам и пользователям" onChange={this.searchInput} value={this.state.searchValue}  onKeyPress={this.keyPressEnter}/>
                    <button className="header__search__form__wrapper__button" onClick={this.saveSearchValue}>Найти</button>
                    <div className={styleForSearchList}>
                    <ul>
                        Пользователи:
                        { listUsersSearch }
                    </ul>
                    <ul>
                        Группы:
                        { listGroupsSearch }
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
