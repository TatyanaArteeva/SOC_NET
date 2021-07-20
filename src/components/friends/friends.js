
import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';


class Friends extends Component{

    constructor(props){
        super(props)
        this.state={
            arr: [],
        }

    }

   render(){

    return (
        <div>
            <div>
                <HashRouter>
                    <Link to="/friends/incoming"><button>Входящие заявки в друзья</button></Link>
                </HashRouter>
                <HashRouter>
                    <Link to="/friends/output"><button>Исходящие заявки в друзья</button></Link>
                </HashRouter>
                <HashRouter>
                    <Link to="/friends/allUsers"><button>Все пользователи</button></Link>
                </HashRouter>
            </div>
            <FriendsAndGroupsList  getItems={(start,end)=>
                                        `/api/friend/get-friends/${this.props.id}?start=${start}&end=${end}`
                                    }
                                    arrItems={(items)=>{
                                      this.setState({
                                         arr: [...this.state.arr, ...items.accounts]
                                      })
                                    }}
                                    path={(id)=>{
                                      this.props.history.push(id)
                                    }
                                    }
                                    titleItem={(el, funcGoItem, btnAction)=>{
                                        return el.map((item, index)=>{
                                            let btnActionFriend=null;

                                            if(item.info.friendRelationStatus==="FULL"){
                                                btnActionFriend=<button onClick={()=>btnAction(item.account.id, "FULL")}>Удалить из друзей</button>
                                            }

                                           

                                            return  <div key={item.account.id}>
                                                        <li className="myFriends_item" onClick={()=>funcGoItem(item.account.id)}>
                                                            {index+1}
                                                            <div>
                                                                <img className="myFriends_item_img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                                <span>{item.account.firstName} {item.account.lastName}</span>
                                                            </div>
                                                        </li>
                                                        {btnActionFriend}
                                                    </div>
                                        })
                                    }}
                                    arrItemModification={(item)=>{
                                        const index=this.state.arr.findIndex(el=>{
                                            return el.account.id===item.account.id
                                        });
                                        const before=this.state.arr.slice(0, index);
                                        const after=this.state.arr.slice(index+1);
                                        const newArr=[...before, ...after]
                                        this.setState({
                                            arr: newArr
                                        })
                                    }}    
                                    renderItems={this.state.arr}
                                    searchName={"Поиск друзей"}
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



export default withRouter(connect(mapStateToProps)(WithService()(Friends)));