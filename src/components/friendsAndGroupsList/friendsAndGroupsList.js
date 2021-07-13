import React, { Component} from 'react';
import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';

class FriendsAndGroupsList extends Component{
    constructor(props){
        super(props);
        this.state={
            req: false,
            heightList: '',
            totalSize: ''
        }

        this.refList=React.createRef();
        const {Service} = this.props;
        let start=0;
        let end=10;

        this.allFriends=()=>{
                        Service.getFriendsAll(this.props.getItems(start, end))
                            .then(res=>{
                                console.log("res")
                                this.setState({
                                    totalSize: res.data.totalSize,
                                })
                                this.props.arrItems(res.data)
                            })
                    }

        this.componentDidMount=()=>{
            this.allFriends()
        }

        this.goToItem=(id)=>{
            this.props.path(id)
        }

        this.componentDidUpdate=()=>{
                const heightList=this.refList.current.scrollHeight;
                if(heightList!==this.state.heightList){
                    this.setState({
                        heightList: heightList
                    })
                }
                const windowHeight=document.documentElement.clientHeight;
                window.addEventListener("scroll", ()=>{
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if((scrollTop+windowHeight)>=(this.state.heightList/100*80) && !this.state.req){

                        this.setState({
                            req: true
                        })
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
                        Service.getFriendsAll(this.props.getItems(start, end))
                        .then(res=>{
                            console.log(res.data)
                            this.setState({
                                totalSize: res.data.totalSize,
                                req: false
                            })
                            this.props.arrItems(res.data)
                        })
                        return false
                    }
                        
                     
                })
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
                                            {
                                                this.props.renderItems.map((el, index)=>{
                                                    const label=this.props.titleItem(el)
                                                    return <div key={el.id}>
                                                                <li className="myFriends_item" 
                                                                    onClick={()=>this.goToItem(el.id)}>
                                                                    {index+1}
                                                                    {label}
                                                                </li>
                                                            </div>
                                                })
                                            } 
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