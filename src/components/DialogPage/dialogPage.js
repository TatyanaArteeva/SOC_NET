import React, { Component } from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import './dialogPage.scss';
import { withRouter } from "react-router-dom";
import {outputMessage} from '../../actions';

class DialogPage extends Component{
    _cleanupFunction=false;
    constructor(props){
        super(props);
        this.state={
            idFriends: '',
            firstNameFriends: '',
            lastNameFriends: '',
            photoFriends: '',
            allAndOutputMessage: [],
            newMessage: '',
            inputMessage: '',
            heightList: '',
            req: false,
            date: ''
        }
        this.refListMessage=React.createRef();
        let start=0;
        let end=50;
        const idFriends=localStorage.getItem('idForDialogFriends');
        const {Service}=this.props;

        this.getInfoFriends=()=>{
            Service.getAccountInfo(`/api/account/${idFriends}/page-info`)
            .then(res=>{
                if(res.status===200){
                    this.setState({
                        firstNameFriends: res.data.account.firstName,
                        lastNameFriends:  res.data.account.lastName
                    })
                }
            })
            Service.getAccountPhoto(`/api/account/${idFriends}/photo`, {
                responseType: 'arraybuffer'
                })
                .then(res=>{
                    let photo=Buffer.from(res.data, 'binary').toString('base64');
                    const newFormatPhoto="data:image/jpg;base64," + photo;
                    this.setState({
                        photoFriends: newFormatPhoto
                    })
                })
        }


        this.getOldMessages=()=>{
            const objDataForMessages={
                end: end,
                start: start,
                startLoadTime: this.state.date,
                targetAccountId: idFriends
            }
            Service.getMessageAll('/api/message/get-private-messages', objDataForMessages)
                .then(res=>{
                    if(res.status===200){
                        console.log(res)
                        const arrReverse=res.data.messages.reverse();
                        this.setState({
                            allAndOutputMessage:  arrReverse
                        })
                    }
                })
                .then(res=>{
                    const windowMessage=document.querySelector('.wrapperListMessage');
                    console.log(windowMessage)
                    windowMessage.scrollTop = windowMessage.scrollHeight;
                })
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            const date=new Date().toISOString();
            this.setState({
                idFriends: idFriends,
                date: date
            },()=>{
                this.getInfoFriends();
                this.getOldMessages();
            })
        }

        this.goToPageFriends=()=>{
            this.props.history.push(this.state.idFriends)
        }

        this.postMessage=(e)=>{
            e.preventDefault();
            const OneInvalidSymbol = ' ';
    
            const oneCheck = this.state.newMessage.indexOf(OneInvalidSymbol);
    
            if(this.state.newMessage.length>0){
                if(oneCheck!==0){
                    const sendDate=new Date().toISOString()
    
                    const outputMessage= {
                        content: this.state.newMessage,
                        sourceId: this.props.id,
                        destinationId: this.state.idFriends,
                        sendDate: sendDate
                    }
    
                    Service.postMessage('/api/message/sendMessage', outputMessage)
                        .then(res=>{
                            if(res.status===200){
                                console.log(res)
                                this.setState({
                                    newMessage: '',
                                    allAndOutputMessage:[...this.state.allAndOutputMessage, res.data]
                                },()=>{
                                    const windowMessage=document.querySelector('.wrapperListMessage');
                                    windowMessage.scrollTop = windowMessage.scrollHeight;
                                })
                                
                            }
                        })
                }
            }
        }

        this.valueMessage=(e)=>{
            this.setState({
                newMessage: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            })
        }

        this.componentDidUpdate=(prevProps)=>{
            const heightList=this.refListMessage.current.scrollHeight;
            const windowMessage=document.querySelector('.wrapperListMessage');

            if(this.props.inputMessage.content!==undefined && prevProps.inputMessage.id!==this.props.inputMessage.id){
                let scrollInBottom=false;
                if(heightList===(windowMessage.scrollTop+windowMessage.clientHeight)){
                    scrollInBottom=true;
                }
                this.setState({
                    allAndOutputMessage: [...this.state.allAndOutputMessage, this.props.inputMessage]
                },()=>{
                    if (scrollInBottom) {
                        windowMessage.scrollTop = windowMessage.scrollHeight;
                    }
                })
            }

            windowMessage.addEventListener('scroll', ()=>{
                if((windowMessage.scrollTop)<= heightList/100*20 && !this.state.req){
                    console.log(windowMessage.scrollTop+windowMessage.clientHeight)
                    start=end;
                    end=end+50;

                    if(this._cleanupFunction){
                        this.setState({
                            req: true
                        },()=>{
                            console.log("подгружаем новый контент")
                            const objDataForMessages={
                                end: end,
                                start: start,
                                startLoadTime: this.state.date,
                                targetAccountId: idFriends
                            }
                            Service.getMessageAll('/api/message/get-private-messages', objDataForMessages)
                                .then(res=>{
                                    if(res.status===200 && this._cleanupFunction){
                                        console.log(res)
                                        const arrReverse=res.data.messages.reverse();
                                        this.setState({
                                            allAndOutputMessage:  [...arrReverse ,...this.state.allAndOutputMessage],
                                            req: false
                                        })
                                    }
                                })
                        })
                    }

                }
            })

            

        }


    }

    render(){

        return(
            <div className="dialog">
            <div className="dialog__wrapper">
                <div className="dialog__header" onClick={this.goToPageFriends}>
                    <div className="dialog__header__img">
                        <img src={this.state.photoFriends} alt="photoFriends"/>
                    </div>
                    <div>{this.state.firstNameFriends} {this.state.lastNameFriends}</div>
                </div>
            </div>
            <div className="dialog__list"> 
                <div ref={this.refListMessage} className="wrapperListMessage">
                    <ul>
                        {
                            this.state.allAndOutputMessage.map(el=>{
                                let classMessage="user";

                                if(el.destinationId===this.props.id){
                                    classMessage="friend"
                                }

                                return  <li key={el.id} className={classMessage}>
                                            {el.content}
                                        </li>
                            })
                        }  
                    </ul>
                </div>
            </div>
            <div className="dialog__inputMessage">
                <form onSubmit={this.postMessage} className="dialog__inputMessage__form">
                    <textarea   className="dialog__inputMessage__form__input" 
                                type="text" placeholder="Введите текст сообщения" 
                                value={this.state.newMessage}
                                required
                                onChange={this.valueMessage}/>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        </div>
        )
    }

   
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId,
        idForDialogFriends: state.idForDialogFriends,
        messageObj: state.outputMessage,
        inputMessage:state.inputMessageObj
    }
}

const mapDispatchToProps={
    outputMessage
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(DialogPage)));