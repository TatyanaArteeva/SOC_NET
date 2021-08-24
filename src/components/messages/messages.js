import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import 'moment/locale/ru';
import Moment from 'react-moment';
import './messages.scss';
import ListFriendsForAddDialog from '../listFriendsForAddDialog/listFriendsForAddDialog';

const localFormatDateByVersionLibMomentReact='lll'

class Messages extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            totalSizeDialogs: '',
            dialogs: [],
            listForAddDialog: false,
            req: false
        }
        const {Service}=this.props;
        this.refList=React.createRef();
        let start=0;
        let end=10;


        this.getDialogsAndFriends=()=>{
            Service.getMessagesAll(`/api/dialog/list?start=${start}&end=${end}`)
                .then(res=>{
                    if(res.status===200){
                        this.setState({
                            totalSizeDialogs: res.data.totalSize,
                            dialogs: res.data.dialogs
                        })
                    }
                })
        }


        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            this.getDialogsAndFriends()
        }

        this.goToDialogsWithFriend=(id)=>{
            localStorage.setItem('idForDialogFriends', id);
            this.props.history.push('/dialog')
        }

        this.componentDidUpdate=(prevProps)=>{
            const heightList=this.refList.current.scrollHeight;
            const windowHeight=document.documentElement.clientHeight;

            window.addEventListener("scroll", ()=>{
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if((scrollTop+windowHeight)>=(heightList/100*80) && !this.state.req){
                    start=end;
                    end=end+10;

                    if(start===this.state.totalSizeDialogs){
                        return
                    }

                    if(start>this.state.totalSizeDialogs){
                        return
                    }

                    
                    if(end>this.state.totalSizeDialogs){
                        end=this.state.totalSizeDialogs
                    }

                    if(this._cleanupFunction){
                        this.setState({
                            req: true
                        },()=>{
                            console.log(start, end)
                            Service.getMessagesAll(`/api/dialog/list?start=${start}&end=${end}`)
                                .then(res=>{
                                    if(res.status===200){
                                        console.log(res)
                                        this.setState({
                                            totalSizeDialogs: res.data.totalSize,
                                            dialogs: [...this.state.dialogs, ...res.data.dialogs],
                                            req: false
                                        })
                                    }
                                })
                        })
                    }


                }
            })


            if(this.props.inputMessage.length>0 && prevProps.inputMessage.length!==this.props.inputMessage.length){

                if(this.state.dialogs.length>0){
                    console.log("кол дивлогов больше 1")
                    const elWithNewMessage=this.state.dialogs.filter(el=>{
                        let elObj=null;
                        console.log(this.props.inputMessage)
                        if(el.lastMessage.sourceId===this.props.inputMessage[this.props.inputMessage.length-1].sourceId){
                            elObj=el
                        }
                        return elObj
                    })

                    console.log(elWithNewMessage)

                    const indexNewEl=this.state.dialogs.findIndex(el=>{
                        return el.lastMessage.sourceId === this.props.inputMessage[this.props.inputMessage.length-1].sourceId
                    })

                    console.log(indexNewEl)
                
                    if(indexNewEl!== -1){
                        const before=this.state.dialogs.slice(0, indexNewEl);
                        const after=this.state.dialogs.slice(indexNewEl+1);
                        const newArr=[elWithNewMessage[0], ...before, ...after];

                        this.setState({
                            dialogs: newArr
                        })
                    }else{
                        Service.getMessagesAll(`/api/dialog/${this.props.inputMessage[this.props.inputMessage.length-1].sourceId}`)
                            .then(res=>{
                                console.log(res)
                                    this.setState({
                                        dialogs: [res.data, ...this.state.dialogs]
                                    },()=>{
                                        start=start+1
                                    })

                            })
                    }
                }else{
                    console.log("кол дивлогов 0");
                    console.log(this.props.inputMessage)
                    for(let i=0; i<this.props.inputMessage.length; i++){
                        Service.getMessagesAll(`/api/dialog/${this.props.inputMessage[i].sourceId}`)
                            .then(res=>{
                                console.log(res)
                                    this.setState({
                                        dialogs: [res.data]
                                    })
                            })
                            
                    }
                }

                    
            
                }

            
        }

        this.openListUsersForAddDialog=()=>{
            this.setState({
                listForAddDialog: true
            })
        }

        this.closeListUsersForAddDialog=()=>{
            console.log("close")
            this.setState({
                listForAddDialog: false
            })
        }

    }


   render(){
    let content=this.state.dialogs.map((el, index)=>{
        let arrUnreadMessage=[];

        arrUnreadMessage=this.props.inputMessage.filter(elInputMessage=>{
            if(elInputMessage.sourceId===el.account.id){
                return el
            }
        })
        

        let addressesLastMessage="Вы"

        if(el.lastMessage.sourceId!==localStorage.getItem('idUser') || (arrUnreadMessage.length>0 && arrUnreadMessage[arrUnreadMessage.length-1].sourceId!==localStorage.getItem('idUser'))){
            addressesLastMessage="Друг"
        }

        let countUnacceptedMessages=null;
        let lastMessage=el.lastMessage.content;

        if(arrUnreadMessage.length>0){
            countUnacceptedMessages=<span>Непрочитанных сообщений: {arrUnreadMessage.length}</span>
            lastMessage=arrUnreadMessage[arrUnreadMessage.length-1].content
        }

        const dateMilliseconds=new Date(el.lastMessage.sendDate).getTime();
        const timeZone=new Date(el.lastMessage.sendDate).getTimezoneOffset()*60*1000;
        const currentDateMilliseconds=dateMilliseconds-(timeZone);
        const currentDate=new Date(currentDateMilliseconds)

        return<li key={el.account.id}>
                {index+1}
                <div onClick={()=>this.goToDialogsWithFriend(el.account.id)} className="dialogs__list__item">
                    <div>
                        <span>
                            <img className="dialogs__list__item_img" src={"data:image/jpg;base64," + el.account.photo} alt="photoDialogs"/>
                        </span>
                    </div>
                    <div className="dialogs__list__item_content">
                        <span className="dialogs__list__item_name">
                            {el.account.firstName} {el.account.lastName}
                        </span>
                        <span>
                            <Moment locale="ru"
                                            date={currentDate}
                                            format={localFormatDateByVersionLibMomentReact}
                                            
                            />
                        </span>
                        <span>
                            {addressesLastMessage}: {lastMessage} {countUnacceptedMessages}
                        </span>
                    </div>
                </div>
            </li>
    })

    if(this.state.dialogs.length===0){
        content=<div>
                    У вас пока нет диалогов!
                </div>
    }

    let listUsersForDialog=null;

    if(this.state.listForAddDialog){
        console.log("true")
        listUsersForDialog= <div>
                                <button onClick={this.closeListUsersForAddDialog}>Закрыть</button>
                                    <ListFriendsForAddDialog/>
                            </div>
    }
    
    return(
        <>
            <div onClick={this.openListUsersForAddDialog}>
                создать новый диалог
            </div>
            {listUsersForDialog}
            {this.state.totalSizeDialogs}
            <ul className="dialogs__list" ref={this.refList}>
                {
                    content
                }
            </ul>
        </>
    )
   }
}

const mapStateToProps=(state)=>{
    return{
        inputMessage:state.inputMessageObj,
    }
}

export default withRouter(WithService()(connect(mapStateToProps)(Messages)));