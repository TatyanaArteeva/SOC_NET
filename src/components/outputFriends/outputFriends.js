import React, {Component} from 'react';
import { withRouter} from "react-router";
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';


class OutputFriends extends Component{
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
                                        `/api/friend/get-output-friends/${this.props.id}?start=${start}&end=${end}`
                                    }
                                  arrItems={(items)=>{
                                    this.setState({
                                        arr: [...this.state.arr, ...items.accounts]
                                    })
                                  }}
                                  path={(id)=>{
                                    this.props.history.push(`/${id}`)
                                    }
                                  }
                                  titleItem={(el, funcGoItem, btnAction)=>{
                                    return el.map((item, index)=>{
                                        let btnActionFriend=null;

                                        if(item.info.friendRelationStatus==="OUTPUT"){
                                            btnActionFriend=<button onClick={()=>btnAction(item.account.id, "OUTPUT")}>Отменить заявку</button>
                                        }

                                        if(item.info.friendRelationStatus==="NO_RELATION"){
                                            btnActionFriend=<button onClick={()=>btnAction(item.account.id, "NO_RELATION")}>Добавить в друзья</button>
                                        }

                                        return <div key={item.account.id}>
                                            <li className="myFriends_item"
                                                onClick={()=>funcGoItem(item.account.id)}
                                                >
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
                                        const newElem=item;
                                        const newArrItems=[...this.state.arr.slice(0, index), newElem, ...this.state.arr.slice(index+1)];
                                        this.setState({
                                            arr: newArrItems
                                        })
                                    }}
                                    renderItems={this.state.arr}
                                    searchName={"Поиск из исходящих заявок в друзья"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={"У вас пока нет исходящих заявок"}
                                    nameList={"исходящих заявок"}
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


export default withRouter(connect(mapStateToProps)(OutputFriends));