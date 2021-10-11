import React, {Component} from 'react';
import { withRouter} from "react-router";
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';
import NavigationFriends from '../navigationFriends/navigationFriends';

class AllUsers extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
            idNoRelation: '',
            idOutput: '',
            idInput: '',
            idReject: '',
            idFull: '',
            totalSize: ''
        }

    }

    render(){
        return(
            <>
                <NavigationFriends/>
                <FriendsAndGroupsList getItems={(start,end)=>
                                        `/api/account/all?start=${start}&end=${end}`
                                    }
                                  arrItems={(items)=>{
                                      console.log(items)
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
                                        let btnActionRejectFriend=null;
                                        let writeMessage=null;
                                        let currentStatusUsers="Вы";

                                        let classItem="friends-and-groups-list__list__item";

                                        if((this.state.idOutput===item.account.id && this.state.idOutput.length>0) || (this.state.idReject===item.account.id && this.state.idReject.length>0) || (this.state.idFull===item.account.id && this.state.idFull.length>0)){
                                            classItem="friends-and-groups-list__list__item_warning"
                                        }

                                        if((this.state.idNoRelation===item.account.id && this.state.idNoRelation.length>0) || (this.state.idInput===item.account.id && this.state.idInput.length>0)){
                                            classItem="friends-and-groups-list__list__item_confirmation"
                                        }

                                        if(item.info.friendRelationStatus==="NO_RELATION"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "NO_RELATION")
                                                                        this.setState({
                                                                            idNoRelation: item.account.id
                                                                        })
                                                                    }}
                                                                    className="friends-and-groups-list__list__item__content__btns_main"
                                                            >
                                                                Добавить в друзья
                                                            </button>
                                            currentStatusUsers="Не в друзьях"
                                        }
                                
                                        if(item.info.friendRelationStatus==="OUTPUT"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "OUTPUT")
                                                                        this.setState({
                                                                            idOutput: item.account.id
                                                                        })
                                                                        }}
                                                                    className="friends-and-groups-list__list__item__content__btns_danger"
                                                            >
                                                                Отменить заявку
                                                            </button>
                                            currentStatusUsers="Хотите быть другом"
                                        }
                                
                                        if(item.info.friendRelationStatus==="INPUT"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "INPUT")
                                                                        this.setState({
                                                                            idInput: item.account.id
                                                                        })
                                                                    }}
                                                                    className="friends-and-groups-list__list__item__content__btns_main"
                                                            >
                                                                Подтвердить друга
                                                            </button>
                                            btnActionRejectFriend=<button onClick={()=>{
                                                                            btnAction(item.account.id, "INPUT-REJECT")
                                                                            this.setState({
                                                                                idReject: item.account.id
                                                                            })
                                                                          }}
                                                                          className="friends-and-groups-list__list__item__content__btns_danger"
                                                                    >
                                                                    Отклонить друга
                                                                </button>;
                                            currentStatusUsers="Хочет быть другом"
                                        }
                                        if(item.info.friendRelationStatus==="FULL"){
                                            btnActionFriend=<button onClick={()=>{
                                                                        btnAction(item.account.id, "FULL")
                                                                        this.setState({
                                                                            idFull: item.account.id
                                                                        })
                                                                    }}
                                                                    className="friends-and-groups-list__list__item__content__btns_danger"
                                                            >
                                                                Удалить из друзей
                                                            </button>
                                            writeMessage= <button onClick={()=>{
                                                                    writeMessageBtn(item.account.id)
                                                                }}
                                                                className="friends-and-groups-list__list__item__content__btns_main"
                                                            >
                                                                Написать сообщение
                                                            </button>
                                            currentStatusUsers="Друзья"
                                        }

                                        return <li key={item.account.id} className={classItem}>
                                                    <div onClick={()=>funcGoItem(item.account.id)}>
                                                        <img className="friends-and-groups-list__list__item__img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                    </div>
                                                    <div className="friends-and-groups-list__list__item__content">
                                                        <span onClick={()=>funcGoItem(item.account.id)} className="friends-and-groups-list__list__item__content_name">{item.account.firstName} {item.account.lastName}</span>
                                                        <div className="friends-and-groups-list__list__item__content_current-status"><span>{currentStatusUsers}</span></div>
                                                        <div className="friends-and-groups-list__list__item__content__btns">
                                                            {btnActionFriend}
                                                            {btnActionRejectFriend}
                                                            {writeMessage}
                                                        </div>
                                                    </div>
                                          </li>
                                      })
                                  }}
                                  arrItemModification={(item)=>{
                                    console.log(item)
                                    const index=this.state.arr.findIndex(el=>{
                                        return el.account.id===item.account.id
                                    });
                                    const newElem=item;
                                    const newArrItems=[...this.state.arr.slice(0, index), newElem, ...this.state.arr.slice(index+1)];
                                    this.setState({
                                        arr: newArrItems,
                                        idNoRelation: '',
                                        idOutput: '',
                                        idInput: '',
                                        idReject: '',
                                        idFull: ''
                                    })
                                }}
                                  renderItems={this.state.arr}
                                  searchName={"Поиск из всех пользователей"}
                                  arrItemsSearch={(items)=>{
                                    this.setState({
                                        arr: [...items.accounts]
                                    })
                                }}
                                  messageNotContent={"Пользователей пока нет"}
                                  nameList={"пользователей"}
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


export default withRouter(connect(mapStateToProps)(AllUsers));