import React, { Component } from 'react';
import WithService from '../hoc/hoc';
import './infoUser.scss';
import './font.scss';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import {
    userInformation,
    rights,
    infoRelation,
    currentIdLocation,
    loadingInfoProfile,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import Spinner from '../spinner/spinner';
import up from './up.svg';
import down from './down.svg';

class InfoUser extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            btnDetailedInformation: false,
            firstName: '',
            lastName: '',
            spinner: true,
            error: false
        }

        const {
            Service,
            loadingInfoProfile,
            infoRelation,
            idForInfo,
            match,
            userInformation,
            currentIdLocation,
            checkingForAuthorization,
            unsubscribe,
            rights,
            history } = this.props;

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            loadingInfoProfile(false)
            infoRelation('');
            this.info()
        }

        this.componentDidUpdate = (prevProps) => {
            if (prevProps.idForInfo !== this.props.idForInfo && match.params.id) {
                this.info()
            }
        }

        this.componentWillUnmount = () => {
            this._cleanupFunction = false;
        }

        this.info = () => {
            Service.getUserAccountId(this.props.idForInfo)
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            userInformation(res.data)
                            currentIdLocation(this.props.idForInfo)
                            loadingInfoProfile(true)
                        }
                    }
                }).then(res => {
                    if (this._cleanupFunction) {
                        this.setState({
                            firstName: this.props.information.firstName,
                            lastName: this.props.information.lastName,
                            spinner: false
                        })
                    }
                }).catch(err => {
                    loadingInfoProfile(true)
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
            Service.getAccountInfo(`/api/account/${this.props.idForInfo}/page-info`)
                .then(res => {
                    rights(res.data.accesses);
                    infoRelation(res.data.info);
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            spinner: false,
                            error: true
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.detailedInformation = () => {
            this.setState(({ btnDetailedInformation }) => ({
                btnDetailedInformation: !btnDetailedInformation
            }))
        }

        this.goToModificationMyPage = () => {
            history.push('/modification')
        }
    }

    render() {

        let btnModification = null;
        let name = null;

        const { listRights, idForInfo } = this.props;

        const { btnDetailedInformation, firstName, lastName, error, spinner } = this.state;

        if (listRights.canModify) {
            btnModification = <div className="profile-information__modification-btn__wrapper">
                <button className="profile-information__modification-btn"
                    onClick={this.goToModificationMyPage}>
                    Редактировать
                </button>
            </div>
        }

        const blockDetailedInformation = btnDetailedInformation ?
            <DetailedInformationBlock idForInfo={idForInfo} /> : null;

        if (firstName.length > 0 || lastName.length > 0) {
            name = <div className="profile-information__content_name">{firstName} {lastName}</div>
        }

        let btnDetailInformationBlock = <img src={down} alt="down" />

        if (btnDetailedInformation) {
            btnDetailInformationBlock = <img src={up} alt="up" />
        }

        let contentInformation = <>
            {btnModification}
            <div className="profile-information__content__wrapper">
                {name}
            </div>
            <button onClick={this.detailedInformation}
                className="profile-information__content__btn_detailed">
                {btnDetailInformationBlock}
            </button>
        </>

        if (error) {
            contentInformation = <div>Что-то пошло не так!</div>
        }

        const content = spinner ? <Spinner /> : contentInformation

        return (
            <div className="profile-information">
                {content}
                {blockDetailedInformation}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        information: state.userInformation,
        id: state.userId,
        listRights: state.listRights,
        info: state.infoRelation
    }
}

const mapDispatchToProps = {
    userInformation,
    rights,
    infoRelation,
    currentIdLocation,
    loadingInfoProfile,
    checkingForAuthorization,
    unsubscribe
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(InfoUser)));
