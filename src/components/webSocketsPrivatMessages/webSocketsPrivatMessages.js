import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { inputMessageObj } from '../../actions';

const WebSocketsPrivatMessages = ({ inputMessageObj, unsubscribe }) => {
    const idForSubscribe = localStorage.getItem("idUser")

    const [connected, setConnected] = useState();

    const client = useMemo(() => {
        const connect = new Client({
            connectHeaders: {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('/ws/messages'),
        });

        connect.activate()

        connect.onConnect = (frame) => {
            setConnected(false)
            if (frame.command === "CONNECTED") {
                setConnected(true)
            }
        }
        return connect
    }, [])

    client.debug = function (str) {
        console.log(str);
    };

    const actionMessage = (message) => {
        const messageParse = JSON.parse(message.body)
        inputMessageObj(messageParse)
    }

    const setSubscribePrivatMessages = useCallback(() => {
        client.subscribe('/queue/privateMessage/' + idForSubscribe, actionMessage, { id: 'privatMessages' })
    }, [])

    useEffect(() => {
        if (connected) {
            setSubscribePrivatMessages()
        }
    }, [connected])

    const setUnsubscribePrivatMessages = useCallback(() => {
        if (client.connected !== undefined) {
            client.unsubscribe('privatMessages');
        }
        client.deactivate()
    }, [])

    useEffect(() => {
        if (unsubscribe) {
            setUnsubscribePrivatMessages()
        }
    }, [unsubscribe])

    return (
        <div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
        outputMessage: state.outputMessage,
        unsubscribe: state.unsubscribe,
    }
}

const mapDispatchToProps = {
    inputMessageObj
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketsPrivatMessages)

