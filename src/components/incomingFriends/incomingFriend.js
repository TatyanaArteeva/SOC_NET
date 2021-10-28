import React, {Component} from 'react';
import { withRouter} from "react-router";
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';
import NavigationFriends from '../navigationFriends/navigationFriends';
import incomingFriends from './incomingFriends.svg';

class IncomingFriends extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
            idConfirmation:'',
            idReject: '',
            totalSize: ''
        }

    }

    render(){
        return(
            <>
                <NavigationFriends/>
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

                                            let classItem="friends-and-groups-list__list__item";

                                            if(this.state.idReject===item.account.id && this.state.idReject.length>0){
                                                classItem="friends-and-groups-list__list__item_warning"
                                            }

                                            if(this.state.idConfirmation===item.account.id && this.state.idConfirmation.length>0){
                                                classItem="friends-and-groups-list__list__item_confirmation"
                                            }


                                            if(item.info.friendRelationStatus==="INPUT"){
                                                btnActionFriend=<button onClick={()=>{
                                                                            btnAction(item.account.id, "INPUT")
                                                                            this.setState({
                                                                                idConfirmation: item.account.id,
                                                                                totalSize: this.state.totalSize - 1
                                                                            })
                                                                            }}
                                                                            className="friends-and-groups-list__list__item__content__btns_danger"
                                                                            >
                                                                    Подтвердить друга
                                                                </button>
                                                btnActionRejectFriend=<button onClick={()=>{
                                                                                btnAction(item.account.id, "INPUT-REJECT")
                                                                                this.setState({
                                                                                    idReject: item.account.id,
                                                                                    totalSize: this.state.totalSize - 1
                                                                                })
                                                                                }}
                                                                                className="friends-and-groups-list__list__item__content__btns_main"
                                                                                >
                                                                        Отклонить друга
                                                                    </button>;
                                            }
                                            return <li key={item.account.id} className={classItem}>
                                                <div onClick={()=>funcGoItem(item.account.id)}>
                                                    <img className="friends-and-groups-list__list__item__img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                </div>
                                                <div className="friends-and-groups-list__list__item__content">
                                                    <span onClick={()=>funcGoItem(item.account.id)} className="friends-and-groups-list__list__item__content_name">
                                                        {item.account.firstName} {item.account.lastName}
                                                    </span>
                                                    <div className="friends-and-groups-list__list__item__content__btns">
                                                        {btnActionFriend}
                                                        {btnActionRejectFriend}
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
                                            idConfirmation:'',
                                            idReject: ''
                                        })
                                    }}    
                                    renderItems={this.state.arr}
                                    searchName={"Поиск входящих заявках в друзья"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={<img src={incomingFriends} alt="incomingFriends"/>}
                                    nameList={"входящих заявок"}
                                    totalSize={(size)=>{
                                        this.setState({
                                            totalSize: size
                                        })
                                      }}
                                    totalSizeReturn={this.state.totalSize}
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