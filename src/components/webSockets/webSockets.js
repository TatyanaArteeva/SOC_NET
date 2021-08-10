import React, { useEffect, useState, } from 'react';
// import SockJS from 'sockjs-client';
import { connect } from 'react-redux';
// var Stomp = require("stompjs/lib/stomp.js").Stomp;



const WebSockets = ({ idUser }) => {
    useEffect(() => {
        // const sockJs=new SockJS('/messages');
        // console.log(sockJs)
        // sockJs.onopen=()=>{
        //     console.log("open")
        // }


        const ws=new WebSocket('ws://localhost:9000/messages');
        console.log(ws)
        ws.onopen=()=>{
            console.log('open')
        }

    }, [])

    return (
        <div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        idUser: state.userId,
    }
}

export default connect(mapStateToProps)(WebSockets);

