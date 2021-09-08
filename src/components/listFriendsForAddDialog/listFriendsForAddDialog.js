import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class ListFriendsForAddDialog extends Component{

    constructor(props){
        super(props)
        this.state={
            arr: [],
        }

    }

   render(){

    return (
        <div className="listFriendsForAddDialog">
            <FriendsAndGroupsList  getItems={(start,end)=>
                                        `/api/friend/get-friends/${this.props.id}?start=${start}&end=${end}`
                                    }
                                    arrItems={(items)=>{
                                      this.setState({
                                         arr: [...this.state.arr, ...items.accounts]
                                      })
                                    }}
                                    path={(id)=>{
                                        localStorage.setItem('idForDialogFriends', id);
                                        this.props.history.push('/dialog')
                                    }
                                    }
                                    titleItem={(el, funcGoItem)=>{
                                        return el.map((item, index)=>{
                                            return  <div key={item.account.id}>
                                                        <li className="myFriends_item" onClick={()=>funcGoItem(item.account.id)}>
                                                            {index+1}
                                                            <div>
                                                                <img className="myFriends_item_img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                                <span>{item.account.firstName} {item.account.lastName}</span>
                                                            </div>
                                                        </li>
                                                    </div>
                                        })
                                    }}    
                                    renderItems={this.state.arr}
                                    searchName={"Поиск друзей"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={"У вас пока нет друзей"}
                                    nameList={"у вас друзей"}
                                    />
        </div>
    )
   }
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
    }
}



export default withRouter(connect(mapStateToProps)(WithService()(ListFriendsForAddDialog)));