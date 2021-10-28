import React, { Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import AllParticipantsModal from '../allParticipantsModal/allParticipantsModal';
import {closeModalAllParticipantsGroup} from '../../actions';
import friends from './friends.svg';

class ListFriendsForAddDialog extends Component{

    constructor(props){
        super(props)
        this.state={
            arr: [],
        }

    }

   render(){

    return (
        <div>
                <AllParticipantsModal getItems={(start,end)=>
                                            `/api/friend/get-friends/${this.props.id}?start=${start}&end=${end}`
                                        }
                                        arrItems={(items)=>{
                                            console.log(items)
                                            this.setState({
                                                arr: [...this.state.arr, ...items.accounts]
                                            })
                                        }}
                                        path={(id)=>{
                                            this.props.closeModalAllParticipantsGroup()
                                            localStorage.setItem('idForDialogFriends', id);
                                            this.props.history.push('/dialog')
                                            }
                                        }
                                        renderItems={this.state.arr}
                                        titleItem={(el, funcGoItem)=>{
                                            return el.map(item=>{
                                                return  <div key={item.account.id}>
                                                            <li className="participants-list__item" onClick={()=>funcGoItem(item.account.id)}>
                                                                <div className="participants-list__item__content">
                                                                    <div className="participants-list__item__content__img">
                                                                        <img src={"data:image/jpg;base64," + item.account.photo} alt="photoGroup"/>
                                                                    </div>
                                                                    <span className="participants-list__item__content__name">{item.account.firstName} {item.account.lastName}</span>
                                                                </div>
                                                            </li>
                                                        </div>
                                            })
                                            
                                        }}
                                        messageNotContent={<img src={friends} alt="friends" className=""/>}
                                        nameList={"Всего друзей:"}
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

const mapDispatchToProps = {
    closeModalAllParticipantsGroup
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithService()(ListFriendsForAddDialog)));