import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';
import NavigationFriends from '../navigationFriends/navigationFriends';
import friends from './friends.svg';


class Friends extends Component{

    constructor(props){
        super(props)
        this.state={
            arr: [],
            id: '',
            totalSize: ''
            
        }

    }

   render(){
    
    return (
        <div>
            <NavigationFriends/>
            <FriendsAndGroupsList  getItems={(start,end)=>
                                        `/api/friend/get-friends/${this.props.id}?start=${start}&end=${end}`
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
                                    titleItem={(el, funcGoItem, btnAction, writeMessageBtn)=>{
                                        return el.map(item=>{
                                            let btnActionFriend=null;

                                            let writeMessage=null;

                                            let classItem="friends-and-groups-list__list__item";

                                            if(this.state.id===item.account.id && this.state.id.length>0){
                                                classItem="friends-and-groups-list__list__item_warning"
                                            }

                                            if(item.info.friendRelationStatus==="FULL"){
                                                btnActionFriend=<button onClick={()=>{
                                                                                btnAction(item.account.id, "FULL"); 
                                                                                this.setState({
                                                                                    id: item.account.id,
                                                                                    totalSize: this.state.totalSize-1
                                                                                })
                                                                                
                                                                        }}
                                                                        className="friends-and-groups-list__list__item__content__btns_danger">
                                                                    Удалить из друзей
                                                                </button>
                                                writeMessage=   <button onClick={()=>writeMessageBtn(item.account.id)}
                                                                        className="friends-and-groups-list__list__item__content__btns_main">
                                                                    Написать сообщение
                                                                </button>
                                            }
                                            
                                            return  <li key={item.account.id} className={classItem}>
                                                        <div onClick={()=>funcGoItem(item.account.id)}>
                                                            <img className="friends-and-groups-list__list__item__img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                        </div>
                                                        <div className="friends-and-groups-list__list__item__content">
                                                            <span onClick={()=>funcGoItem(item.account.id)} className="friends-and-groups-list__list__item__content_name">{item.account.firstName} {item.account.lastName}</span>
                                                            <div className="friends-and-groups-list__list__item__content__btns">
                                                                {writeMessage}
                                                                {btnActionFriend}
                                                            </div>
                                                        </div>
                                                    </li>
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
                                            arr: newArr,
                                            id:''
                                        })
                                    }}    
                                    renderItems={this.state.arr}
                                    searchName={"Поиск друзей"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={<img src={friends} alt="noFriends"/>}
                                    nameList={"у вас друзей"}
                                    totalSize={(size)=>{
                                        this.setState({
                                            totalSize: size
                                        })
                                      }}
                                      totalSizeReturn={this.state.totalSize}
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