import React, { Component } from 'react';
import './userNotificationsList.scss';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import {
    deleteNotificationFromInputNotificationObj,
    mouseLeaveNotificationsList,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import 'moment/locale/ru';
import Moment from 'react-moment';
import SpinnerMini from '../spinnerMini/spinnerMini';
import SpinnerMiniMini from '../spinnerMiniMini/spinnerMiniMini';
import bell from './bell.svg';
const localFormatDateByVersionLibMomentReact = 'lll'

class UserNotificationsList extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            arrNotifications: [],
            date: '',
            idUser: '',
            totalSizeNotifications: '',
            renderItems: false,
            req: false,
            spinner: true,
            spinnerMini:false,
            error: false
        }

        let start = 0;
        let end = 10;
        const idUser = localStorage.getItem('idUser');
        this.refList = React.createRef();

        const {
            Service,
            checkingForAuthorization,
            unsubscribe,
            mouseLeaveNotificationsList,
            history
        } = this.props;

        this.getNotifications = () => {
            if (this.props.inputNotificationObj.length > 0) {
                if (this.props.inputNotificationObj.length < 10) {
                    const objForGetNotificationsData = {
                        end: end,
                        start: start,
                        startLoadTime: this.state.date,
                        targetId: this.state.idUser
                    }
                    Service.getAllNotifications('/api/notification/get-user-notifications',
                        objForGetNotificationsData)
                        .then(res => {
                            if (res.status === 200) {
                                res.data.notifications.forEach(el => {
                                    if (el.accepted === false) {
                                        this.props.deleteNotificationFromInputNotificationObj(el);
                                        Service.postNotificationRead('/api/notification/acceptNotifications',
                                            [el.id])
                                    }
                                })
                                if (this._cleanupFunction) {
                                    this.setState({
                                        totalSizeNotifications: res.data.totalSize,
                                        arrNotifications: [...this.state.arrNotifications,
                                        ...res.data.notifications],
                                        req: false,
                                        spinner: false,
                                        renderItems: true,
                                        spinnerMini:false
                                    })
                                }
                            }
                        }).catch(err => {
                            this.setState({
                                spinner: false,
                                error: true,
                                spinnerMini:false
                            })
                            if (err.response.status === 401) {
                                unsubscribe()
                                checkingForAuthorization();
                            }
                        })
                }else{
                    end=this.props.inputNotificationObj.length
                    const objForGetNotificationsData = {
                        end: end,
                        start: start,
                        startLoadTime: this.state.date,
                        targetId: this.state.idUser
                    }
                    Service.getAllNotifications('/api/notification/get-user-notifications',
                        objForGetNotificationsData)
                        .then(res => {
                            if (res.status === 200) {
                                res.data.notifications.forEach(el => {
                                    if (el.accepted === false) {
                                        this.props.deleteNotificationFromInputNotificationObj(el);
                                        Service.postNotificationRead('/api/notification/acceptNotifications',
                                            [el.id])
                                    }
                                })
                                if (this._cleanupFunction) {
                                    this.setState({
                                        totalSizeNotifications: res.data.totalSize,
                                        arrNotifications: [...this.state.arrNotifications,
                                        ...res.data.notifications],
                                        req: false,
                                        spinner: false,
                                        renderItems: true,
                                        spinnerMini:false
                                    })
                                }
                            }
                        }).catch(err => {
                            this.setState({
                                spinner: false,
                                error: true,
                                spinnerMini:false
                            })
                            if (err.response.status === 401) {
                                unsubscribe()
                                checkingForAuthorization();
                            }
                        })
                }
            } else {
                const objForGetNotificationsData = {
                    end: end,
                    start: start,
                    startLoadTime: this.state.date,
                    targetId: this.state.idUser
                }
                Service.getAllNotifications('/api/notification/get-user-notifications',
                    objForGetNotificationsData)
                    .then(res => {
                        if (res.status === 200) {
                            res.data.notifications.forEach(el => {
                                if (el.accepted === false) {
                                    this.props.deleteNotificationFromInputNotificationObj(el);
                                    Service.postNotificationRead('/api/notification/acceptNotifications',
                                        [el.id])
                                }
                            })
                            if (this._cleanupFunction) {
                                this.setState({
                                    totalSizeNotifications: res.data.totalSize,
                                    arrNotifications: [...this.state.arrNotifications,
                                    ...res.data.notifications],
                                    req: false,
                                    spinner: false,
                                    renderItems: true,
                                    spinnerMini:false
                                })
                            }
                        }
                    }).catch(err => {
                        this.setState({
                            spinner: false,
                            error: true,
                            spinnerMini:false
                        })
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }

        }

        this.componentDidMount = () => {
            mouseLeaveNotificationsList(false)
            this._cleanupFunction = true;
            const date = new Date().toISOString();
            this.setState({
                date: date,
                idUser: idUser
            }, () => {
                this.getNotifications()
            })
        }

        this.componentWillUnmount = () => {
            window.removeEventListener('scroll', () => { })
            this._cleanupFunction = false;
        }

        this.componentDidUpdate = () => {
            const windowNotifications = document.querySelector('.user-notifications-list');
            const windowHeight = windowNotifications.clientHeight;
            windowNotifications.addEventListener("scroll", () => {
                let heightList = this.refList.current.scrollHeight;
                let scrollTop = windowNotifications.scrollTop;
                if ((scrollTop + windowHeight) >= (heightList / 100 * 80) && !this.state.req && !this.state.error) {
                    start = end;
                    end = end + 10;
                    if (start === this.state.totalSizeNotifications) {
                        return
                    }
                    if (start > this.state.totalSizeNotifications) {
                        return
                    }
                    if (end > this.state.totalSize) {
                        end = this.state.totalSizeNotifications
                    }
                    if (this._cleanupFunction) {
                        this.setState({
                            req: true,
                            renderItems: false, 
                            spinnerMini: true
                        })
                    }
                    this.getNotifications()
                }
            })

            if (this.props.inputNotificationObj.length > 0 && this.state.renderItems && !this.state.error) {
                const renderNotifications = this.state.arrNotifications.map(el => {
                    return el.id
                });
                this.props.inputNotificationObj.forEach(el => {
                    for (let i = 0; i++; i < renderNotifications) {
                        if (el.id === renderNotifications[i]) {
                            this.props.deleteNotificationFromInputNotificationObj(el)
                        }
                    }
                })
                if (this.props.inputNotificationObj.length > 0) {
                    this.props.inputNotificationObj.forEach(el => {
                        Service.getInformationForInputMessage(`/api/account/simple-account/${el.sourceId}`)
                            .then(res => {
                                if (res.status === 200) {
                                    this.props.deleteNotificationFromInputNotificationObj(el);
                                    const newEl = {
                                        accepted: el.accepted,
                                        createDate: el.createDate,
                                        destinationId: el.destinationId,
                                        id: el.id,
                                        notificationType: el.notificationType,
                                        source: {
                                            firstName: res.data.firstName,
                                            lastName: res.data.lastName,
                                            photo: res.data.photo
                                        }
                                    }
                                    Service.postNotificationRead('/api/notification/acceptNotifications',
                                        [el.id])
                                    this.setState({
                                        arrNotifications: [newEl, ...this.state.arrNotifications],
                                        totalSizeNotifications: this.state.totalSizeNotifications + 1
                                    })
                                }
                            }).catch(err => {
                                if (err.response.status === 401) {
                                    unsubscribe()
                                    checkingForAuthorization();
                                }
                            })
                    })
                }
            }
        }

        this.mouseLeave = () => {
            this.props.mouseLeaveNotificationsList(true)
        }

        this.goToUserPage = (id) => {
            history.push({ pathname: `/${id}` })
        }

    }
    render() {

        let notificationsContent = null;

        const { inputNotificationObj } = this.props;

        const { arrNotifications, spinner, error } = this.state;

        if (arrNotifications.length === 0 && !spinner) {
            notificationsContent = <div className="user-notifications-list__not-notifications">
                <img src={bell} alt="no-bell" />
            </div>;
        }

        if (arrNotifications.length === 0 && !spinner && error) {
            notificationsContent = <div className="user-notifications-list__not-notifications">
                <span>
                    Что-то пошло не так! Уведомления не доступны!
                </span>
            </div>;
        }

        if ((arrNotifications.length > 0 && !spinner) ||
            (inputNotificationObj.length > 0 && !spinner)) {
            notificationsContent = <ul ref={this.refList} className="user-notifications-list__list">
                {
                    arrNotifications.map(el => {
                        const dateMilliseconds = new Date(el.createDate).getTime();
                        const timeZone = new Date(el.createDate).getTimezoneOffset() * 60 * 1000;
                        const currentDateMilliseconds = dateMilliseconds - (timeZone);
                        const currentDate = new Date(currentDateMilliseconds);
                        let nameUser = <span onClick={() => this.goToUserPage(el.source.id)}>
                            {el.source.firstName} {el.source.lastName}
                        </span>
                        const newFormatPhoto = "data:image/jpg;base64," + el.source.photo;
                        let messageNotification = null;
                        if (el.notificationType === "ADD_FRIEND") {
                            messageNotification = "хочет добавить Вас в друзья"
                        }
                        if (el.notificationType === "ACCEPT_FRIEND") {
                            messageNotification = "подтвердил(а), что вы его друг"
                        }
                        if (el.notificationType === "REMOVE_FRIEND") {
                            messageNotification = "удалил(а) Вас из друзей"
                        }
                        if (el.notificationType === "REJECT_FRIEND") {
                            messageNotification = "отклонил(а) вашу заявку в друзья"
                        }
                        if (el.notificationType === "CANCEL_FRIEND") {
                            messageNotification = "отменил(а) свою заявку в друзья"
                        }
                        if (el.notificationType === "ADD_PARTNER") {
                            messageNotification = "Начал(а) с Вами отношения"
                        }
                        if (el.notificationType === "REMOVE_PARTNER") {
                            messageNotification = "Прекратил(а) с Вами отношения"
                        }
                        return <li key={el.id} className="user-notifications-list__list__item">
                            <div className="user-notifications-list__list__item__content">
                                <div>
                                    <img src={newFormatPhoto}
                                        alt="photoUser"
                                        className="user-notifications-list__list__item__content__img"
                                    />
                                </div>
                                <div className="user-notifications-list__list__item__content__name">
                                    <div className="user-notifications-list__list__item__content__name_name">
                                        {nameUser}
                                    </div>
                                    <div className="user-notifications-list__list__item__content__name_message">
                                        {messageNotification}
                                    </div>
                                </div>
                            </div>
                            <div className="user-notifications-list__list__item__time">
                                <div>
                                    <Moment locale="ru"
                                        date={currentDate}
                                        format={localFormatDateByVersionLibMomentReact}
                                    />
                                </div>
                            </div>
                        </li>
                    })
                }
            </ul>
        }

        const content = spinner ?
            <div className="user-notifications-list__spinner-wrapper">
                <SpinnerMini />
            </div> : notificationsContent

        let spinnerMiniBlock=this.state.spinnerMini ? <SpinnerMiniMini/> : null;

        return (
            <div className="user-notifications-list">
                <div className="user-notifications-list__wrapper"
                    onMouseLeave={this.mouseLeave}>
                    {content}
                    {spinnerMiniBlock}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        inputNotificationObj: state.inputNotificationObj
    }
}

const mapDispatchToProps = {
    deleteNotificationFromInputNotificationObj,
    mouseLeaveNotificationsList,
    checkingForAuthorization,
    unsubscribe
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(UserNotificationsList)))
