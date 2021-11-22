import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { newPost } from '../../actions';
import { useLocation } from 'react-router-dom';

const WebSocketsPrivatMessages = ({ unsubscribe, currentIdLocation, newPost }) => {

    const location = useLocation();

    const [connected, setConnected] = useState();

    const posts = useMemo(() => {
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

    posts.debug = function (str) {
        console.log(str);
    };

    const actionPost = (post) => {
        const postParse = JSON.parse(post.body);
        newPost(postParse)
    }

    const setSubscribePostsMessages = useCallback(() => {
        if ((location.pathname === `/${currentIdLocation}` && connected) ||
            (location.pathname === `/groups/${currentIdLocation}` && connected)) {
            posts.unsubscribe()
            posts.subscribe('/topic/messageOnWall/' + currentIdLocation, actionPost)
        }
    }, [currentIdLocation, connected])

    useEffect(() => {
        if (connected) {
            setSubscribePostsMessages()
        }
    }, [connected, currentIdLocation])

    const setUnsubscribePrivatMessages = useCallback(() => {
        if (posts.connected !== undefined) {
            posts.unsubscribe();
        }
        posts.deactivate()
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
        currentIdLocation: state.currentIdLocation
    }
}

const mapDispatchToProps = {
    newPost
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketsPrivatMessages)

