import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { inputNotificationObj } from '../../actions';





const WebSocketsNotifications= ({ inputNotificationObj, unsubscribe}) => {
    const idForSubscribe = localStorage.getItem("idUser")
    
    const[connected, setConnected]=useState();
  
    const client=useMemo(()=>{
        const connect = new Client({
            connectHeaders: {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('/ws/messages'),
        });

        
        connect.activate()
        
        connect.onConnect = (frame) => {
            if(frame.command==="CONNECTED"){
                setConnected(true)
            }
            
        }

        return connect
    },[])

    

    client.debug = function (str) {
        console.log(str);
    };

    const actionNotifications=(notification)=>{
        console.log(notification.body)
        const notificationParse=JSON.parse(notification.body)
        console.log(notificationParse)
        inputNotificationObj(notificationParse)

    }

  
    const setSubscribePrivatMessages=useCallback(()=>{
        console.log("начинем подписку к уведомлениям")
        client.subscribe('/queue/notification/' + idForSubscribe, actionNotifications)
    },[])

    useEffect(()=>{
        if(connected){
            setSubscribePrivatMessages()
           
        }
    },[connected])

    

    const setUnsubscribePrivatMessages=useCallback(()=>{
        console.log("начинем отписку от уведомлений");
        client.unsubscribe();
        client.deactivate()
    },[])

    

    useEffect(()=>{
        if(unsubscribe){
            setUnsubscribePrivatMessages()
        }
    },[unsubscribe])

    
   
    return (
        <div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        // outputMessage: state.outputMessage,
        unsubscribe: state.unsubscribe,
    }
}

const mapDispatchToProps = {
    inputNotificationObj
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketsNotifications);