import React, {Component} from 'react';
import { withRouter} from "react-router";
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';
import NavigationFriends from '../navigationFriends/navigationFriends';
import outputFriends from './outputFriends.svg';


class OutputFriends extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
            idOutput: '',
            idNoRelation: '',
            totalSize: ''
        }

    }

    render(){
        return(
            <>
                <NavigationFriends/>
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
                                    return el.map(item=>{
                                        let btnActionFriend=null;

                                        let classItem="friends-and-groups-list__list__item";

                                        if(this.state.idOutput===item.account.id && this.state.idOutput.length>0){
                                            classItem="friends-and-groups-list__list__item_warning"
                                        }

                                        if(this.state.idNoRelation===item.account.id && this.state.idNoRelation.length>0){
                                            classItem="friends-and-groups-list__list__item_confirmation"
                                        }

                                        if(item.info.friendRelationStatus==="OUTPUT"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "OUTPUT")
                                                                        this.setState({
                                                                            idOutput: item.account.id,
                                                                            totalSize: this.state.totalSize -1
                                                                        })
                                                                    }}
                                                                    className="friends-and-groups-list__list__item__content__btns_danger"
                                                            >
                                                                Отменить заявку
                                                            </button>
                                        }

                                        if(item.info.friendRelationStatus==="NO_RELATION"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "NO_RELATION")
                                                                        this.setState({
                                                                            idNoRelation: item.account.id,
                                                                            totalSize: this.state.totalSize +1
                                                                        })
                                                                    }}
                                                                    className="friends-and-groups-list__list__item__content__btns_main"
                                                            >
                                                                Добавить в друзья
                                                            </button>
                                        }

                                        return <li key={item.account.id} className={classItem}>
                                            <div  onClick={()=>funcGoItem(item.account.id)}>
                                                <img className="friends-and-groups-list__list__item__img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                            </div>
                                            <div className="friends-and-groups-list__list__item__content">
                                                <span onClick={()=>funcGoItem(item.account.id)} className="friends-and-groups-list__list__item__content_name">
                                                    {item.account.firstName} {item.account.lastName}
                                                </span>
                                                <div className="friends-and-groups-list__list__item__content__btns">
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
                                        const newElem=item;
                                        const newArrItems=[...this.state.arr.slice(0, index), newElem, ...this.state.arr.slice(index+1)];
                                        this.setState({
                                            arr: newArrItems,
                                            idOutput: '',
                                            idNoRelation: ''
                                        })
                                    }}
                                    renderItems={this.state.arr}
                                    searchName={"Поиск из исходящих заявок в друзья"}
                                    arrItemsSearch={(items)=>{
                                        this.setState({
                                            arr: [...items.accounts]
                                        })
                                    }}
                                    messageNotContent={<img src={outputFriends} alt="incomingFriends"/>}
                                    nameList={"исходящих заявок"}
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


export default withRouter(connect(mapStateToProps)(OutputFriends));