import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import {Client} from '@stomp/stompjs';
import {inputMessageObj} from '../../actions';
import { useLocation } from "react-router-dom";



const WebSockets = ({ idUser, outputMessage, inputMessageObj }) => {

    const location = useLocation();
    const currentLocation=location.pathname;


    useEffect(() => {
        const client = new Client({
            connectHeaders: {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('/messages'),
            })

            client.onConnect = function (frame) {
                if(frame.command==="CONNECTED"){
                
                    if(outputMessage.content!==undefined){
                        const outputMessageJSON=JSON.stringify(outputMessage);
                        console.log(outputMessageJSON)

                        // client.publish({
                        //     destination: '/message/sendMessage',
                        //     body: outputMessageJSON
                        // });
                    }

                }

                

                const actionMessage=(message)=>{
                    console.log(message.body)
                    const messageParse=JSON.parse(message.body)
                    
                    inputMessageObj(messageParse)
        
                }

                client.subscribe('/queue/privateMessage/' + idUser, actionMessage)

            };

            
            
            client.onStompError = function (frame) {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
            };
            
            client.debug = function (str) {
            console.log(str);
            };

            client.activate()
            
            client.debug = function (str) {
            console.log(str);
            };

    }, [])

    

    return (
        <div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        outputMessage: state.outputMessage
    }
}

const mapDispatchToProps={
    inputMessageObj
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSockets);

