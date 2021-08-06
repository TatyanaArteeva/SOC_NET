import React, { Component} from 'react';
// import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {allSearchValue} from '../../actions';
import './AllParticipantsGroupList.scss';

class AllParticipantsGroupList extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            req: false,
            heightList: '',
            totalSize: '',
            searchValue: ''
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
            Service.getItems(this.props.getItems(start, end))
                .then(res=>{
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
                                req: true
                            })
                        }
    
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
            contentAndMessageNotContent=<div className="participantsGroupList__wrapper">
                                            {this.props.titleItem(this.props.renderItems, this.goToItem)}
                                        </div>                          
        }

         return(
            <div>
                <div className="participantsGroupList" ref={this.refList}>
                    <div>Всего {this.props.nameList}: {this.state.totalSize}</div>
                    <ul className="participantsGroupList_list">
                        {contentAndMessageNotContent}
                    </ul>
                </div>
            </div>
        )
     }
}

export default withRouter(WithService()(AllParticipantsGroupList));