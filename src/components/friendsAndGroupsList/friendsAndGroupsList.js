import React, { Component} from 'react';
import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {allSearchValue, idForDialogFriends} from '../../actions';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinner/spinner';

class FriendsAndGroupsList extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            req: false,
            heightList: '',
            totalSize: '',
            searchValue: '',
            spinner: true,
            miniSpinner: false
        }

        this.refList=React.createRef();
        const {Service} = this.props;
        let start=0;
        let end=10;

        this.getItems=()=>{
            this.setState({
                searchValue: this.props.valueSearch
            })
            start=0;
            end=10;

            if(this.props.valueSearch.length>0){
                this.setState({
                    spinner: true
                })
                Service.getItems(this.props.getItems(start, end), {params:{name: this.props.valueSearch}})
                    .then(res=>{
                        this.props.allSearchValue("")
                        if(this._cleanupFunction){
                            this.setState({
                                totalSize: res.data.totalSize,
                                spinner: false
                            })
                            this.props.arrItems(res.data);
                        }
                    })
            }else{
                Service.getItems(this.props.getItems(start, end))
                    .then(res=>{
                        if(res.status===200){
                            if(this._cleanupFunction){
                                this.setState({
                                    totalSize: res.data.totalSize,
                                    spinner: false
                                })
                                this.props.arrItems(res.data);
                            }
                        }
                    })
            }
            
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.getItems()
        }

        this.goToItem=(id)=>{
            this.props.path(id)
        }

        

        this.componentDidUpdate=()=>{
            if(this.refList.current!==null && this.refList.current!==undefined){
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
                        
                        if(this._cleanupFunction){
                            this.setState({
                                req: true,
                                miniSpinner: true
                            })
                        }
    
                        console.log(start, end)
                        console.log("yes")
                        if(this.state.searchValue.length>0){
                            Service.getResultForSearch(this.props.getItems(start,end), {params:{name: this.state.searchValue}})
                                .then(res=>{
                                    if(this._cleanupFunction){
                                        this.setState({
                                            totalSize: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        this.props.arrItems(res.data)
                                    }
                                })
                        }else{
                            Service.getItems(this.props.getItems(start, end))
                                .then(res=>{
                                    if(this._cleanupFunction){
                                        this.setState({
                                            totalSize: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        this.props.arrItems(res.data)
                                    }
                                })
                        }
                    }
                })
            }

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

        this.writeMessage=(id)=>{
            localStorage.setItem('idForDialogFriends', id);
            this.props.idForDialogFriends(id);
            this.props.history.push('/dialog')
        }

        this.postRequestByClickForSearch=(e)=>{
            start=0;
            end=10;
            this.setState({
                searchValue: e.target.value,
                spinner: true
            })
            Service.getResultForSearch(this.props.getItems(start,end), {params:{name: e.target.value}})
                .then(res=>{
                    console.log(res);
                    if(this._cleanupFunction){
                        this.setState({
                            totalSize: res.data.totalSize,
                            spinner: false
                        })
                        this.props.arrItemsSearch(res.data);
                    }
                })
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
                                            {this.props.titleItem(this.props.renderItems, this.goToItem, this.btnAction, this.writeMessage)}
                                        </div>                          
        }

        const miniSpinner=this.state.miniSpinner ? <SpinnerMini/> : null;

        const contentGroupsOrFriends=  <div>
                            <div>
                                <input
                                    type="text"
                                    placeholder={this.props.searchName}
                                    onChange={(e)=>this.postRequestByClickForSearch(e)}
                                    value={this.state.searchValue}
                                />
                            </div>
                            <div className="myFriends" ref={this.refList}>
                                <div>Всего {this.props.nameList}: {this.state.totalSize}</div>
                                <ul className="myGroups_list">
                                    {contentAndMessageNotContent}
                                    {miniSpinner}
                                </ul>
                            </div>
                        </div>

        
        const content=this.state.spinner? <Spinner/> : contentGroupsOrFriends
         return(
            <div>
               {content}
            </div>
        )
     }
}

const mapStateToProps = (state) => {
    return {
        valueSearch: state.allSearchValue
    }
}

const mapDispatchToProps = {
    allSearchValue,
    idForDialogFriends
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(FriendsAndGroupsList)));