import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';

class AllGroups extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: [],
            start: '',
            end: ''
        }

    }
    
     render(){
         console.log(this.state.arr)
         return(
            <div>
                <FriendsAndGroupsList getItems={(start,end)=>
                                            `/api/group/all?start=${start}&end=${end}`
                                        }
                                        arrItems={(items)=>{
                                            this.setState({
                                                arr: [...this.state.arr, ...items.groups]
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
                                        path={(id)=>{
                                            this.props.history.push(`/groups/${id}`)
                                            }
                                        }
                                        titleItem={(el, funcGoItem, btnAction)=>{
                                            return el.map((item, index)=>{

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
                                        renderItems={this.state.arr}
                                        searchName={"Поиск  из всех групп"}
                                        arrItemsSearch={(items)=>{
                                            this.setState({
                                                arr: [...items.groups]
                                            })
                                        }}
                                        messageNotContent={"У вас пока нет групп"}
                                        nameList={"групп"}
                                    />
            </div>
         )
     }
}


export default withRouter(WithService()(AllGroups));