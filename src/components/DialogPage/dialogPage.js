import React, { Component } from 'react';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import './dialogPage.scss';
import { withRouter } from "react-router-dom";
import {outputMessage, deleteMessageFromInputMessageObj} from '../../actions';
import 'moment/locale/ru';
import Moment from 'react-moment';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinner/spinner';

const localFormatDateByVersionLibMomentReact='lll'


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
            date: '',
            firstNameUser: '',
            lastNameUser: '', 
            totalSizeMessage: '',
            spinner: true,
            spinnerMini: false
        }

        this.refListMessage=React.createRef();
        let start=0;
        let end=50;

        const idFriends=localStorage.getItem('idForDialogFriends');
        const idUser=localStorage.getItem('idUser');

        const {Service}=this.props;

        this.getInfoUsers=()=>{
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
            Service.getAccountInfo(`/api/account/${idUser}/page-info`)
                .then(res=>{
                    if(res.status===200){
                        this.setState({
                            firstNameUser: res.data.account.firstName,
                            lastNameUser: res.data.account.lastName
                        })
                    }
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
                        const arrReverse=res.data.messages.reverse();
                        this.setState({
                            allAndOutputMessage:  arrReverse,
                            totalSizeMessage: res.data.totalSize,
                            spinner:false
                        })
                    }
                })
                .then(res=>{
                    const windowMessage=document.querySelector('.wrapperListMessage');
                    windowMessage.scrollTop = windowMessage.scrollHeight;
                    windowMessage.pageYOffset=windowMessage.scrollHeight;
                })
        }

        this.componentDidMount=()=>{
            this._cleanupFunction=true;
            const date=new Date().toISOString();
            this.setState({
                idFriends: idFriends,
                date: date
            },()=>{
                this.getInfoUsers();
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
                                console.log("послали сообщение")
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

        this.componentDidUpdate=()=>{
            const heightList=this.refListMessage.current.scrollHeight;
            const windowMessage=document.querySelector('.wrapperListMessage');
            windowMessage.scrollTop = windowMessage.scrollHeight;
                this.props.inputMessage.map(el=>{
                    if(el.sourceId===localStorage.getItem("idForDialogFriends")){
                        this.props.deleteMessageFromInputMessageObj(el)
                        let scrollInBottom=false;
                        if(heightList===(windowMessage.scrollTop+windowMessage.clientHeight)){
                            scrollInBottom=true;
                        }
                        this.setState({
                            allAndOutputMessage: [...this.state.allAndOutputMessage, el]
                        },()=>{
                            if (scrollInBottom) {
                                windowMessage.scrollTop = windowMessage.scrollHeight;
                                Service.postMessageRead('/api/message/acceptMessages', [el.id])
                                    .then(res=>{
                                        console.log(res)
                                        console.log("элемент принят и прочитан")
                                    })
                            }
                        })
                    }
                })

            windowMessage.addEventListener('scroll', ()=>{
                if((windowMessage.scrollTop)<= heightList/100*20 && !this.state.req){
        
                    start=end;
                    end=end+50;


                    if(start===this.state.totalSizeMessage){
                        return
                    }

                    if(start>this.state.totalSizeMessage){
                        return
                    }

                    
                    if(end>this.state.totalSizeMessage){
                        end=this.state.totalSizeMessage
                    }

                    if(this._cleanupFunction){
                        this.setState({
                            req: true,
                            spinnerMini: true
                        },()=>{
                            const objDataForMessages={
                                end: end,
                                start: start,
                                startLoadTime: this.state.date,
                                targetAccountId: idFriends
                            }
                            Service.getMessageAll('/api/message/get-private-messages', objDataForMessages)
                                .then(res=>{
                                    console.log("подгружаем новый контент")
                                    if(res.status===200 && this._cleanupFunction){
                                        const arrReverse=res.data.messages.reverse();
                                        this.setState({
                                            allAndOutputMessage:  [...arrReverse ,...this.state.allAndOutputMessage],
                                            req: false,
                                            spinnerMini: false,
                                        })
                                    }
                                })
                        })
                    }

                }
            })
        }

        this.keyPressEnter=(e)=>{
            if(e.key==='Enter'){
                this.postMessage(e)
            }
                
        }

        this.componentWillUnmount=()=>{
            this._cleanupFunction=false
        }


    }

    render(){

        const messages= this.state.allAndOutputMessage.map(el=>{
                            const dateMilliseconds=new Date(el.sendDate).getTime();
                            const timeZone=new Date(el.sendDate).getTimezoneOffset()*60*1000;
                            const currentDateMilliseconds=dateMilliseconds-(timeZone);
                            const currentDate=new Date(currentDateMilliseconds)

                            let classMessage="user";
                            let nameUser=<span>{this.state.firstNameUser} {this.state.lastNameUser}</span>

                            if(el.destinationId===this.props.id){
                                classMessage="friend"
                                nameUser=<span>{this.state.firstNameFriends} {this.state.firstNameFriends}</span>
                            }

                            return  <li key={el.id} className={classMessage}>
                                            {nameUser}
                                            {el.content}
                                            <Moment locale="ru"
                                                    date={currentDate}
                                                    format={localFormatDateByVersionLibMomentReact}
                                                    
                                            />
                                            
                                    </li>
                        })


        const content=this.state.spinner? <Spinner/>: messages

        const miniSpinner=this.state.spinnerMini ? <SpinnerMini/> : null;

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
                        {miniSpinner}
                        {
                          content
                        }
                    </ul>
                </div>
            </div>
            <div className="dialog__inputMessage">
                <form onSubmit={this.postMessage} className="dialog__inputMessage__form" onKeyPress={this.keyPressEnter}>
                    <textarea   className="dialog__inputMessage__form__input" 
                                type="text" placeholder="Введите текст сообщения" 
                                value={this.state.newMessage}
                                required
                                onChange={this.valueMessage}/>
                    <button type="submit" className="dialog__inputMessage__form__button">Отправить</button>
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
        // messageObj: state.outputMessage,
        inputMessage:state.inputMessageObj,
    }
}

const mapDispatchToProps={
    outputMessage,
    deleteMessageFromInputMessageObj
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(DialogPage)));