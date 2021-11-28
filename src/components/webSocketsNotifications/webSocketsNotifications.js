import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { inputNotificationObj } from '../../actions';

const WebSocketsNotifications = ({ inputNotificationObj, unsubscribe }) => {

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

    const actionNotifications = (notification) => {
        const notificationParse = JSON.parse(notification.body)
        inputNotificationObj(notificationParse)
    }

    const setSubscribePrivatMessages = useCallback(() => {
        client.subscribe('/queue/notification/' + idForSubscribe, actionNotifications, { id: 'notifications' })
    }, [])

    useEffect(() => {
        if (connected) {
            setSubscribePrivatMessages()
        }
    }, [connected])

    const setUnsubscribePrivatMessages = useCallback(() => {
        if (client.connected !== undefined) {
            client.unsubscribe('notifications');
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
        unsubscribe: state.unsubscribe,
    }
}

const mapDispatchToProps = {
    inputNotificationObj
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketsNotifications)