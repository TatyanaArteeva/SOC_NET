import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import AllParticipantsGroupList from '../allParticipantsGroupList/allParticipantsGroupList';
import {connect} from 'react-redux';

class ModalWindowAllParticipantsGroup extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: []
        }
  
        
    }
    
     render(){
        const idInUrl=localStorage.getItem('idGroup');

         return(
            <div>
                <AllParticipantsGroupList getItems={(start,end)=>
                                            `/api/group-relation/get-group-accounts/${idInUrl}?start=${start}&end=${end}`
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
                                        renderItems={this.state.arr}
                                        titleItem={(el, funcGoItem)=>{
                                                return el.map((item, index)=>{
                                                    return(
                                                        <div key={item.account.id}>
                                                            {index+1}
                                                            <li className="participantsGroupList_item"
                                                                onClick={()=>funcGoItem(item.account.id)}
                                                                >
                                                                <div>
                                                                    <div className="myGroups_item_wrapper_img">
                                                                        <img className="participantsGroupList_img" src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                                    </div>
                                                                    <span>{item.account.firstName} {item.account.lastName}</span>
                                                                </div>
                                                            </li>
                                                        </div>
                                                    )
                                                })
                                            
                                        }}
                                        messageNotContent={"Нет участников группы"}
                                        nameList={"у вас участников"}
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


export default withRouter(connect(mapStateToProps)(WithService()(ModalWindowAllParticipantsGroup)));
