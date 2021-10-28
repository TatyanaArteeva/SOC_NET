import React, { Component} from 'react';
// import './friendsAndGroupsList.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {closeModalAllParticipantsGroup} from '../../actions';
import './allParticipantsModal.scss';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinnerMini/spinnerMini';
import cancel from './cancel.svg';

class AllParticipantsModal extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            req: false,
            heightList: '',
            totalSize: '',
            searchValue: '',
            spinner: true,
            miniSpinner: false, 
            error: false
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
                    if(res.status===200){
                        if(this._cleanupFunction){
                            this.setState({
                                totalSize: res.data.totalSize,
                                spinner: false
                            })
                            this.props.arrItems(res.data);
                        }
                    }
                }).catch(err=>{
                    if(this._cleanupFunction){
                        this.setState({
                            error:true,
                            spinner: false
                        })
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
            if(this.refList.current!==null && this.refList.current!==undefined){

                const list=document.querySelector('.participants-list__modal');

                const windowHeight=list.clientHeight;

                list.addEventListener("scroll", ()=>{
                    let scrollTop =  list.scrollTop;

                    const heightList=this.refList.current.scrollHeight;
 
                    if(heightList!==this.state.heightList){
                            if(this._cleanupFunction){
                                this.setState({
                                    heightList: heightList
                                })
                            }
                    }

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
    
                        Service.getItems(this.props.getItems(start, end))
                            .then(res=>{
                                if(res.status===200){
                                    if(this._cleanupFunction){
                                        this.setState({
                                            totalSize: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        this.props.arrItems(res.data)
                                    }
                                }
                            }).catch(err=>{
                                if(this._cleanupFunction){
                                    this.setState({
                                        error:true,
                                        spinner: false
                                    })
                                }
                            })
                        
                    }
                })
            }

            window.addEventListener('click', (e)=>{
                const overlay=document.querySelector('.participants-list');
                if(overlay!==undefined && e.target===overlay && this.props.openModalAllParticipantsGroup){
                    console.log("click", this.props.openModalAllParticipantsGroup)
                        this.closeModalAllParticipantsGroup()
                    }
                })
                    

        }

        this.closeModalAllParticipantsGroup=()=>{
            this.props.closeModalAllParticipantsGroup()
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }

    }

    render(){

        let contentAndMessageNotContent=null;

        if(this.props.renderItems.length===0 && !this.state.spinner){
            contentAndMessageNotContent=<div className="participants-list__not-content">
                                        <span>{this.props.messageNotContent}</span>
                                      </div>
        }

        const miniSpinner=this.state.miniSpinner ? <div className="participants-list__wrapper_spinner-mini"><SpinnerMini/></div> : null;

        if(this.props.renderItems.length>0 && !this.state.spinner){
            contentAndMessageNotContent=<div>
                                            <div className="participants-list__list__wrapper">
                                                {this.props.titleItem(this.props.renderItems, this.goToItem)}
                                            </div> 
                                            {miniSpinner}
                                        </div>                         
        }

        if(this.state.error && !this.state.spinner){
            contentAndMessageNotContent=<div className="participants-list__not-content">
                                            <span>Что-то пошло не так!</span>
                                        </div>
        }
        const content=this.state.spinner? <Spinner/>: contentAndMessageNotContent

         return(
            <div className="participants-list">
                <div className="participants-list__modal" ref={this.refList}>
                    <div className="participants-list__cancel" onClick={this.closeModalAllParticipantsGroup}><img src={cancel} alt="cancel"/></div>
                    <div className="participants-list__total-size">{this.props.nameList} <span>{this.state.totalSize}</span></div>
                    <ul className="participants-list__list">
                        {content}
                    </ul>
                </div>
            </div>
        )
     }
}

const mapStateToProps = (state) => {
    return {
        openModalAllParticipantsGroup:state.openModalAllParticipantsGroup
    }
}

const mapDispatchToProps = {
    closeModalAllParticipantsGroup
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(AllParticipantsModal)));