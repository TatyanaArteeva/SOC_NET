import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';
import NavigationGroups from '../navigationGroups/navigationGroups';
import group from './group.svg';



class Groups extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
            idInput: '',
            idExit: '',
            totalSize: ''

        }
  
        
    }
    
     render(){
         return(
            <div>
                <NavigationGroups/>
                <FriendsAndGroupsList getItems={(start,end)=>
                                            `/api/group-relation/get-account-groups/${this.props.id}?start=${start}&end=${end}`
                                        }
                                        arrItems={(items)=>{
                                            this.setState({
                                                arr: [...this.state.arr, ...items.groups]
                                            })
                                        }}
                                        path={(id)=>{
                                            this.props.history.push(`/groups/${id}`)
                                            }
                                        }
                                        renderItems={this.state.arr}
                                        titleItem={(el, funcGoItem, btnAction)=>{
                                                return el.map(item=>{
                                             
                                                    let btnActionGroup=null;

                                                    let classItem="friends-and-groups-list__list__item";

                                                    if(this.state.idInput===item.group.id && this.state.idInput.length>0){
                                                        classItem="friends-and-groups-list__list__item_confirmation"
                                                    }
            
                                                    if(this.state.idExit===item.group.id && this.state.idExit.length>0){
                                                        classItem="friends-and-groups-list__list__item_warning"
                                                    }

                                                    if(item.info.groupRelationStatus==="NONE"){
                                                        btnActionGroup=<button onClick={()=>{
                                                                                    btnAction(item.group.id, "NONE")
                                                                                    this.setState({
                                                                                        idInput: item.group.id,
                                                                                        totalSize: this.state.totalSize +1
                                                                                    })
                                                                                }}
                                                                                className="friends-and-groups-list__list__item__content__btns_main"
                                                                        >
                                                                            Вступить в группу
                                                                        </button>;
                                                    }
                                                
                                                    if(item.info.groupRelationStatus==="PARTICIPANT"){
                                                        btnActionGroup=<button onClick={()=>{
                                                                                    btnAction(item.group.id, "PARTICIPANT")
                                                                                    this.setState({
                                                                                        idExit: item.group.id,
                                                                                        totalSize: this.state.totalSize -1
                                                                                    })
                                                                                }}
                                                                                className="friends-and-groups-list__list__item__content__btns_danger"
                                                                        >
                                                                            Выйти из группы
                                                                        </button>;
                                                    }

                                                    return(
                                                        <li key={item.group.id} className={classItem}>
                                                            <div onClick={()=>funcGoItem(item.group.id)}>
                                                                <img className="friends-and-groups-list__list__item__img" src={"data:image/jpg;base64," + item.group.photo} alt="photoGroup"/>
                                                            </div>
                                                            <div className="friends-and-groups-list__list__item__content">
                                                                <span onClick={()=>funcGoItem(item.group.id)} className="friends-and-groups-list__list__item__content_name">{item.group.name}</span>
                                                                <div className="friends-and-groups-list__list__item__content__btns">
                                                                    {btnActionGroup}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            
                                        }}
                                        arrItemModification={(item)=>{
                                            const index=this.state.arr.findIndex(el=>{
                                                return el.group.id===item.group.id
                                            });
                                            const newElem=item;
                                            const newArrItems=[...this.state.arr.slice(0, index), newElem, ...this.state.arr.slice(index+1)];
                                            this.setState({
                                                arr: newArrItems,
                                                idInput: '',
                                                idExit: ''
                                            })
                                        }}
                                        searchName={"Поиск групп"}
                                        arrItemsSearch={(items)=>{
                                            console.log(items)
                                            this.setState({
                                                arr: [...items.groups]
                                            })
                                        }}
                                        messageNotContent={<img src={group} alt="myGroups"/>}
                                        nameList={"у вас групп"}
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


export default withRouter(connect(mapStateToProps)(WithService()(Groups)));
