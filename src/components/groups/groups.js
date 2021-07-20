import React, { Component} from 'react';
import './groups.scss';
import {Link, HashRouter} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';
import {connect} from 'react-redux';



class Groups extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: []
        }
  
        
    }
    
     render(){
         return(
            <div>
                <HashRouter>
                    <Link to="/createGroups"><button>Создать новую группу</button></Link>
                </HashRouter>
                <HashRouter>
                    <Link to="/groups/all"><button>Показать все группы</button></Link>
                </HashRouter>
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
                                                return el.map((item, index)=>{
                                                    console.log(item.info)

                                                    let btnActionGroup=null;

                                                    if(item.info.groupRelationStatus==="NONE"){
                                                        btnActionGroup=<button onClick={()=>btnAction(item.group.id, "NONE")}>Вступить в группу</button>;
                                                    }
                                                
                                                    if(item.info.groupRelationStatus==="PARTICIPANT"){
                                                        btnActionGroup=<button onClick={()=>btnAction(item.group.id, "PARTICIPANT")}>Выйти из группы</button>;
                                                    }

                                                    return(
                                                        <div key={item.group.id}>
                                                            {index+1}
                                                            <li className="myFriends_item"
                                                                onClick={()=>funcGoItem(item.group.id)}
                                                                >
                                                                <div>
                                                                    <img className="myFriends_item_img" src={"data:image/jpg;base64," + item.group.photo} alt="photoGroup"/>
                                                                    <span>{item.group.name}</span>
                                                                </div>
                                                            </li>
                                                            {btnActionGroup}
                                                        </div>
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
                                                arr: newArrItems
                                            })
                                        }}
                                        searchName={"Поиск групп"}
                                        messageNotContent={"У вас пока нет групп"}
                                        nameList={"у вас групп"}
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
