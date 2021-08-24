import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { inputMessageObj } from '../../actions';




const WebSockets = ({ inputMessageObj, unsubscribe }) => {
    const idForSubscribe = localStorage.getItem("idUser")

    const[connected, setConnected]=useState();
    

    const client=useMemo(()=>{
        const connect = new Client({
            connectHeaders: {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('/messages'),
    
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

    const actionMessage=(message)=>{
        console.log(message.body)
        const messageParse=JSON.parse(message.body)
        console.log(messageParse)
        inputMessageObj(messageParse)

    }

    const setSubscribe=useCallback(()=>{
        console.log("начинем подписку")
        client.subscribe('/queue/privateMessage/' + idForSubscribe, actionMessage)
    },[])

    useEffect(()=>{
        if(connected){
            setSubscribe()
        }
    },[connected])

    const setUnsubscribe=useCallback(()=>{
        console.log("начинем отписку");
        client.unsubscribe();
        client.deactivate()
    },[])

    useEffect(()=>{
        if(unsubscribe){
            setUnsubscribe()
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
        outputMessage: state.outputMessage,
        unsubscribe: state.unsubscribe

    }
}

const mapDispatchToProps = {
    inputMessageObj
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSockets);

