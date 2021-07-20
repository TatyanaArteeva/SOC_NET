import React, { Component} from 'react';
import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';

class FriendsAndGroupsList extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            req: false,
            heightList: '',
            totalSize: '',
        }

        this.refList=React.createRef();
        const {Service} = this.props;
        let start=0;
        let end=10;

        this.getItems=()=>{
            Service.getItems(this.props.getItems(start, end))
                .then(res=>{
                    console.log(res)
                    if(this._cleanupFunction){
                        this.setState({
                            totalSize: res.data.totalSize,
                        })
                        this.props.arrItems(res.data);
                    }
                })
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.getItems()
        }

        this.goToItem=(id)=>{
            this.props.path(id)
        }

        this.componentDidUpdate=()=>{
                const heightList=this.refList.current.scrollHeight;
                if(heightList!==this.state.heightList){
                        if(this._cleanupFunction){
                            this.setState({
                                heightList: heightList
                            })
                        }
                }
                const windowHeight=document.documentElement.clientHeight;
                window.addEventListener("scroll", ()=>{
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if((scrollTop+windowHeight)>=(this.state.heightList/100*80) && !this.state.req){
                            if(this._cleanupFunction){
                                this.setState({
                                    req: true
                                })
                            }

                        start=end;
                        end=end+10;
    
                        if(start===this.state.totalSize){
                            return
                        }
    
                        if(start>this.state.totalSize){
                            return
                        }
    
                        
                        if(end>this.state.totalSize){
                            end=this.state.totalSize
                        }
    
    
                        console.log(start, end)
                        console.log("yes")
                        Service.getItems(this.props.getItems(start, end))
                        .then(res=>{
                              if(this._cleanupFunction){
                                this.setState({
                                    totalSize: res.data.totalSize,
                                    req: false
                                })
                                this.props.arrItems(res.data)
                              }
                        })
                        return false
                    }
                })

        }


        this.btnAction=(id, status)=>{
            if(status==="NONE"){
                Service.postAddGroups(`/api/group-relation/join-group/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                console.log(this.props.renderItems)
                                Service.getGroup(`/api/group/${id}/page-info`)
                                    .then(res=>{
                                        console.log(res.data.group.id)
                                        this.props.arrItemModification(res.data)
                                        })
                                    
                            }
                        })
                
            }

            if(status==="PARTICIPANT"){
                Service.postAddGroups(`/api/group-relation/leave-group/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                console.log(this.props.renderItems)
                                Service.getGroup(`/api/group/${id}/page-info`)
                                    .then(res=>{
                                        console.log(res.data.group.id)
                                        this.props.arrItemModification(res.data)
                                        })
                                    
                            }
                        })
                
            }

            if(status==="NO_RELATION"){
                let objInfo={};
                let photo=null;
                Service.postAddFriend(`/api/friend/addFriend/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=
                                            objInfo.account['photo']=photo;
                                            this.props.arrItemModification(objInfo)
                                        })
                                })
                            }
                        })
                
            }

            if(status==="OUTPUT"){
                let objInfo={};
                let photo=null;
                Service.postAddFriend(`/api/friend/removeFriend/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=
                                            objInfo.account['photo']=photo;
                                            this.props.arrItemModification(objInfo)
                                        })
                                })
                            }
                        })
                
            }

            if(status==="INPUT"){
                let objInfo={};
                let photo=null;
                Service.postAddFriend(`/api/friend/addFriend/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=
                                            objInfo.account['photo']=photo;
                                            this.props.arrItemModification(objInfo)
                                        })
                                })
                            }
                        })
                
            }

            if(status==="INPUT-REJECT"){
                let objInfo={};
                let photo=null;
                Service.postAddFriend(`/api/friend/rejectFriend/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=
                                            objInfo.account['photo']=photo;
                                            this.props.arrItemModification(objInfo)
                                        })
                                })
                            }
                        })
                
            }

            if(status==="FULL"){
                let objInfo={};
                let photo=null;
                Service.postAddFriend(`/api/friend/removeFriend/${id}`)
                        .then(res=>{
                            if(res.status===200){
                                Service.getAccountInfo(`/api/account/${id}/page-info`)
                                    .then(res=>{
                                       objInfo=res.data;
                                       Service.getAccountPhoto(`/api/account/${id}/photo`,{
                                            responseType: 'arraybuffer'
                                       })
                                        .then(res => {
                                            photo=Buffer.from(res.data, 'binary').toString('base64');
                                        })
                                        .then(res=>{
                                            photo=
                                            objInfo.account['photo']=photo;
                                            this.props.arrItemModification(objInfo)
                                        })
                                })
                            }
                        })
                
            }
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }

    }

    render(){
        let contentAndMessageNotContent=null;

        if(this.props.renderItems.length===0){
            contentAndMessageNotContent=<div>
                                        {this.props.messageNotContent}
                                      </div>
        }

        if(this.props.renderItems.length>0){
            contentAndMessageNotContent=<div>
                                            {this.props.titleItem(this.props.renderItems, this.goToItem, this.btnAction)}
                                        </div>                          
        }

         return(
            <div>
                <div>
                    <input
                        type="text"
                        placeholder={this.props.searchName}
                    />
                </div>
                <div className="myFriends" >
                    <div>Всего {this.props.nameList}: {this.state.totalSize}</div>
                    <ul className="myGroups_list" ref={this.refList}>
                        {contentAndMessageNotContent}
                    </ul>
                </div>
            </div>
        )
     }
}

export default withRouter(WithService()(FriendsAndGroupsList));