import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import 'moment/locale/ru';
import Moment from 'react-moment';
import './messages.scss';
import ListFriendsForAddDialog from '../listFriendsForAddDialog/listFriendsForAddDialog';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinnerMini/spinnerMini';
import {openModalAllParticipantsGroup} from '../../actions';
import messages from './message.svg';

const localFormatDateByVersionLibMomentReact='lll'

class Messages extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            totalSizeDialogs: '',
            dialogs: [],
            listForAddDialog: false,
            req: false,
            spinner:true,
            miniSpinner: false,
            error:false
        }
        const {Service}=this.props;
        this.refList=React.createRef();
        let start=0;
        let end=10;


        this.getDialogsAndFriends=()=>{
            this.setState({
                req: true
            })
            Service.getMessagesAll(`/api/dialog/list?start=${start}&end=${end}`)
                .then(res=>{
                    if(res.status===200){
                        if(this._cleanupFunction){
                            this.setState({
                                dialogs: res.data.dialogs,
                                totalSizeDialogs: res.data.totalSize,
                                req: false,
                                spinner:false
                            })
                        }
                    }
                }).catch(res=>{
                    if(res.status===200){
                        this.setState({
                            req: false,
                            spinner:false,
                            error: true
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
                            req: true,
                            miniSpinner: true
                        },()=>{
                            console.log(start, end)
                            Service.getMessagesAll(`/api/dialog/list?start=${start}&end=${end}`)
                                .then(res=>{
                                    if(res.status===200){
                                        console.log(res)
                                        this.setState({
                                            totalSizeDialogs: res.data.totalSize,
                                            dialogs: [...this.state.dialogs, ...res.data.dialogs],
                                            req: false,
                                            miniSpinner: false
                                        })
                                    }
                                })
                        })
                    }


                }
            })


            if(this.props.inputMessage.length>0 && prevProps.inputMessage.length!==this.props.inputMessage.length){

                if(this.state.dialogs.length>0 && !this.state.req){
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
                        this.setState({
                            req: true
                        })
                        Service.getMessagesAll(`/api/dialog/${this.props.inputMessage[this.props.inputMessage.length-1].sourceId}`)
                            .then(res=>{
                                console.log(res)
                                    this.setState({
                                        dialogs: [res.data, ...this.state.dialogs],
                                        req: false
                                    },()=>{
                                        start=start+1
                                    })

                            })
                    }
                }else if(this.state.dialogs.length===0 && !this.state.req){
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
            this.props.openModalAllParticipantsGroup()
        }

        this.closeListUsersForAddDialog=()=>{
            console.log("close")
            this.setState({
                listForAddDialog: false
            })
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false;
        }

    }


   render(){

    let content=null;

    if(this.state.dialogs.length>0 && !this.state.spinner){
        content=this.state.dialogs.map(el=>{
            let arrUnreadMessage=[];
    
            arrUnreadMessage=this.props.inputMessage.filter(elInputMessage=>{
                if(elInputMessage.sourceId===el.account.id){
                    return el
                }
            })
            
    
            let addressesLastMessage=<span className="dialogs-list__list__item__content__last-message_my">Вы: </span>
    
            if(el.lastMessage.sourceId!==localStorage.getItem('idUser') || (arrUnreadMessage.length>0 && arrUnreadMessage[arrUnreadMessage.length-1].sourceId!==localStorage.getItem('idUser'))){
                addressesLastMessage=<span className="dialogs-list__list__item__content__last-message_friend">Друг: </span>
            }
    
            let countUnacceptedMessages=null;
            let lastMessage=<span className="dialogs-list__list__item__content__last-message_message">{el.lastMessage.content}</span>;
    
            if(arrUnreadMessage.length>0){
                countUnacceptedMessages=<div className="dialogs-list__list__item__content__new-messages">Новых сообщений: <span>{arrUnreadMessage.length}</span></div>
                lastMessage=<span className="dialogs-list__list__item__content__last-message_message">{arrUnreadMessage[arrUnreadMessage.length-1].content}</span>
            }
    
            const dateMilliseconds=new Date(el.lastMessage.sendDate).getTime();
            const timeZone=new Date(el.lastMessage.sendDate).getTimezoneOffset()*60*1000;
            const currentDateMilliseconds=dateMilliseconds-(timeZone);
            const currentDate=new Date(currentDateMilliseconds)
    
            return  <li key={el.account.id} className="dialogs-list__list__item" onClick={()=>this.goToDialogsWithFriend(el.account.id)}>
                        <div>
                            <img className="dialogs-list__list__item_img" src={"data:image/jpg;base64," + el.account.photo} alt="photoDialogs"/>
                        </div>
                        <div className="dialogs-list__list__item__content">
                            <div className="dialogs-list__list__item__content__name-and-time">
                                <span className="dialogs-list__list__item__content__name-and-time_name">
                                    {el.account.firstName} {el.account.lastName}
                                </span>
                                <span className="dialogs-list__list__item__content__name-and-time_time">
                                    <Moment locale="ru"
                                                    date={currentDate}
                                                    format={localFormatDateByVersionLibMomentReact}
                                                    
                                    />
                                </span>
                            </div>
                            <div className="dialogs-list__list__item__content__last-message">
                                <div className="dialogs-list__list__item__content__last-message__wrapper">
                                    {addressesLastMessage} {lastMessage}
                                </div>
                                {countUnacceptedMessages}
                            </div>
                        </div>
                    </li>
        })
    }

    if(this.state.dialogs.length===0 && !this.state.spinner){
        content=<div className="dialogs-list__null">
                    <img src={messages} alt="noMessages"/>
                </div>
    }

    if(!this.state.spinner && this.state.error){
        content=<div>
                    Что-то пошло не так! Диалоги не доступны!
                </div>
    }

    let listUsersForDialog=null;

    if(this.props.modalAllParticipantsGroup===true){
        listUsersForDialog=<ListFriendsForAddDialog/>
    }

    const contentDialogsList=this.state.spinner ? <Spinner/> : content;
    const miniSpinner=this.state.miniSpinner ? <SpinnerMini/> : null;

    console.log(this.state.dialogs)
    
    return(
        <div className="dialogs-list">
            <button onClick={this.openListUsersForAddDialog} className="dialogs-list__creating-dialog">
                Создать новый диалог
            </button>
            {listUsersForDialog}
            <div className="dialogs-list__total-size">Всего диалогов: <span>{this.state.totalSizeDialogs}</span></div>
            <ul className="dialogs-list__list" ref={this.refList}>
                {
                    contentDialogsList
                }
                {miniSpinner}
            </ul>
        </div>
    )
   }
}

const mapStateToProps=(state)=>{
    return{
        inputMessage:state.inputMessageObj,
        modalAllParticipantsGroup :state.openModalAllParticipantsGroup,
    }
}

const mapDispatchToProps = {
    openModalAllParticipantsGroup
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Messages)));