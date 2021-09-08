import React, {Component} from 'react';
import './userNotificationsList.scss';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import { deleteNotificationFromInputNotificationObj} from '../../actions';
import 'moment/locale/ru';
import Moment from 'react-moment';
import Spinner from '../spinner/spinner';

const localFormatDateByVersionLibMomentReact='lll'

class UserNotificationsList extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            arrNotifications: [],
            date:'',
            idUser:'',
            totalSizeNotifications: '',
            renderItems:false,
            req: false,
            spinner:true
        }

        let start=0;
        let end=10;

        const idUser=localStorage.getItem('idUser');

        const {Service}=this.props;

        this.refList=React.createRef();

        this.getNotifications=()=>{
            const objForGetNotificationsData={
                end: end,
                start: start,
                startLoadTime: this.state.date,
                targetId: this.state.idUser
            }
            Service.getAllNotifications('/api/notification/get-user-notifications', objForGetNotificationsData)
                .then(res=>{
                    if(res.status===200){
                        res.data.notifications.forEach(el=>{
                            if(el.accepted===false){
                                // console.log(el)
                                this.props.deleteNotificationFromInputNotificationObj(el);
                                Service.postNotificationRead('/api/notification/acceptNotifications', [el.id])
                                    .then(res=>{
                                        // console.log(res)
                                        // console.log("оповещение принято и прочитано")
                                    })
                            }
                        })

                        if(this._cleanupFunction){
                            this.setState({
                                totalSizeNotifications: res.data.totalSize,
                                arrNotifications:[...this.state.arrNotifications, ...res.data.notifications],
                                renderItems: true,
                                req: false,
                                spinner: false
                            })
                        }

                    }
                })
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            const date=new Date().toISOString();
            this.setState({
                date: date,
                idUser:idUser
            },()=>{
                this.getNotifications()
            })
            
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false;
        }

        this.goToUserPage=(id)=>{
            this.props.history.push(id)
        }

        
        this.componentDidUpdate=()=>{
                const windowNotifications=document.querySelector('.user-notifications-list');
                const windowHeight=windowNotifications.clientHeight;
                windowNotifications.addEventListener("scroll", ()=>{
                    let heightList=this.refList.current.scrollHeight;
                    let scrollTop = windowNotifications.scrollTop;

                    if((scrollTop+windowHeight)>=(heightList/100*80) && !this.state.req){
                        start=end;
                        end=end+10;
                        if(start===this.state.totalSizeNotifications){
                            return
                        }

                        if(start>this.state.totalSizeNotifications){
                            return
                        }

                        
                        if(end>this.state.totalSize){
                            end=this.state.totalSizeNotifications
                        }
                        
                        if(this._cleanupFunction){
                            this.setState({
                                req: true,
                                renderItems:false
                            })
                        }

                        console.log(start, end)
                        // console.log("yes")
                        this.getNotifications()

                    }
                })

            
            if(this.props.inputNotificationObj.length>0 && this.state.renderItems){
                // console.log("зашли в условие")
                const renderNotifications=this.state.arrNotifications.map(el=>{
                    return el.id
                });
                console.log(renderNotifications)
                this.props.inputNotificationObj.forEach(el=>{
                    console.log(el)
                    for(let i=0; i++; i<renderNotifications){
                        // console.log("зашли в поиск повторяющихся уведомлений")
                        if(el.id===renderNotifications[i]){
                            // console.log(el.id, "delete elem")
                            this.props.deleteNotificationFromInputNotificationObj(el)
                        }
                    }
                })

                if(this.props.inputNotificationObj.length>0){
                this.props.inputNotificationObj.forEach(el=>{
                    Service.getInformationForInputMessage(`/api/account/simple-account/${el.sourceId}`)
                                .then(res=>{
                                    // console.log(res)
                                    if(res.status===200){
                                        // console.log(res)
                                        this.props.deleteNotificationFromInputNotificationObj(el);
                                        const newEl={
                                            accepted: el.accepted,
                                            createDate: el.createDate,
                                            destinationId: el.destinationId,
                                            id: el.id,
                                            notificationType: el.notificationType,
                                            source: {
                                                firstName: res.data.firstName,
                                                lastName: res.data.lastName,
                                                photo:res.data.photo
                                            }
                                        }
        
                                        Service.postNotificationRead('/api/notification/acceptNotifications', [el.id])
                                            .then(res=>{
                                                // console.log(res)
                                                // console.log("оповещение принято и прочитано из новых")
                                            })
        
                                        this.setState({
                                            arrNotifications: [newEl, ...this.state.arrNotifications],
                                            totalSizeNotifications: this.state.totalSizeNotifications + 1
                                        })
        
                                    }
                                })
                            })
                }
            }

        }

                
                   
               


    }
    render(){
        console.log(this.state.arrNotifications)

        let notificationsContent=null;

        if(this.state.arrNotifications.length===0 && !this.state.spinner){
            notificationsContent=<div>У Вас нет уведомлений!</div>;
        }

        if((this.state.arrNotifications.length>0 && !this.state.spinner) || (this.props.inputNotificationObj.length>0 && !this.state.spinner)){
            notificationsContent= <ul ref={this.refList}>
                                        {
                                            this.state.arrNotifications.map((el,index)=>{
                                                const dateMilliseconds=new Date(el.createDate).getTime();
                                                const timeZone=new Date(el.createDate).getTimezoneOffset()*60*1000;
                                                const currentDateMilliseconds=dateMilliseconds-(timeZone);
                                                const currentDate=new Date(currentDateMilliseconds);

                                                let nameUser=<span 
                                                onClick={()=>this.goToUserPage(el.source.id)}>{el.source.firstName} {el.source.lastName}</span>

                                                const newFormatPhoto="data:image/jpg;base64," + el.source.photo;

                                                let messageNotification=null;

                                                if(el.notificationType==="ADD_FRIEND"){
                                                    messageNotification="хочет добавить Вас в друзья"
                                                }

                                                if(el.notificationType==="ACCEPT_FRIEND"){
                                                    messageNotification="подтвердил, что вы его друг"
                                                }

                                                if(el.notificationType==="REMOVE_FRIEND"){
                                                    messageNotification="удалил Вас из друзей"
                                                }

                                                if(el.notificationType==="REJECT_FRIEND"){
                                                    messageNotification="отклонил вашу заявку в друзья"
                                                }

                                                if(el.notificationType==="CANCEL_FRIEND"){
                                                    messageNotification="отменил свою заявку в друзья"
                                                }

                                                if(el.notificationType==="ADD_PARTNER"){
                                                    messageNotification="Начал с Вами отношения"
                                                }

                                                if(el.notificationType==="REMOVE_PARTNER"){
                                                    messageNotification="Прекратил с Вами отношения"
                                                }


                                                return <li key={el.id}>
                                                            <div>{index+1}</div>
                                                            <img src={newFormatPhoto} alt="photoUser" className="user-notifications-list__img"/>
                                                            <span>Пользователь {nameUser} {messageNotification}</span>

                                                            <Moment locale="ru"
                                                                            date={currentDate}
                                                                            format={localFormatDateByVersionLibMomentReact}
                                                                            
                                                                    />
                                                        </li>
                                            })
                                        }
                                    </ul>
        }

        const content=this.state.spinner ? <Spinner/> : notificationsContent

        return (
            <div className="user-notifications-list">
                <div>{this.state.totalSizeNotifications}</div>
                {content}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        inputNotificationObj: state.inputNotificationObj
    }
}

const mapDispatchToProps={
    deleteNotificationFromInputNotificationObj
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(UserNotificationsList)));
