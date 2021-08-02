import React, {Component} from 'react';
import { withRouter} from "react-router";
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';

class IncomingFriends extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
        }

    }

    render(){
        return(
            <>
                <FriendsAndGroupsList getItems={(start,end)=>
                                        `/api/friend/get-input-friends/${this.props.id}?start=${start}&end=${end}`
                                      }
                                    arrItems={(items)=>{
                                        this.setState({
                                            arr: [...this.state.arr, ...items.accounts]
                                        })
                                    }}
                                    path={(id)=>{
                                        this.props.history.push(`/${id}`)
                                    }}
                                    titleItem={(el, funcGoItem, btnAction)=>{
                                        return el.map((item, index)=>{
                                            let btnActionFriend=null;
                                            let btnActionRejectFriend=null;
                                            if(item.info.friendRelationStatus==="INPUT"){
                                                btnActionFriend=<button onClick={()=>btnAction(item.account.id, "INPUT")}>Подтвердить друга</button>
                                                btnActionRejectFriend=<button onClick={()=>btnAction(item.account.id, "INPUT-REJECT")}>Отклонить друга</button>;
                                            }
                                            return <div key={item.account.id}>
                                                <li className="myFriends_item"onClick={()=>funcGoItem(item.account.id)}>
                                                    {index+1}
                                                    <div>
                                                        <img className="myFriends_item_img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                        <span>{item.account.firstName} {item.account.lastName}</span>
                                                    </div>
                                                </li>
                                                {btnActionFriend}
                                                {btnActionRejectFriend}
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
                                    searchName={"Поиск входящих заявках в друзья"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={"У вас пока нет входящих заявок"}
                                    nameList={"входящих заявок"}
                                    />
            </>
        )
    }
    
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
    }
}


export default withRouter(connect(mapStateToProps)(IncomingFriends));