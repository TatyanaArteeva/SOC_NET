import React, { Component } from 'react';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import { userAccesses, userInformation, checkingForAuthorization, unsubscribe } from '../../actions';
import { Link } from 'react-router-dom';
import SpinnerMini from '../spinnerMini/spinnerMini';
import './detailedInformationBlock.scss';

class DetailedInformationBlock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sex: '',
            city: '',
            phone: '',
            familyStatus: '',
            employment: '',
            description: '',
            birthDate: '',
            partner: {},
            spinner: true,
            error: false
        }

        const {
            Service,
            idForInfo,
            userInformation,
            information,
            unsubscribe,
            checkingForAuthorization } = this.props;

        this.componentDidMount = () => {
            this.recepionInformation()
        }

        this.recepionInformation = () => {
            Service.getUserAccountId(idForInfo)
                .then(res => {
                    if (res.status === 200) {
                        const objForModificationInformation = {
                            sex: res.data.sex,
                            city: res.data.city,
                            phone: res.data.phone,
                            familyStatus: res.data.familyStatus,
                            employment: res.data.employment,
                            description: res.data.description,
                            birthDate: res.data.birthDate,
                            email: res.data.email,
                            id: res.data.id,
                        }
                        userInformation(objForModificationInformation)
                        this.setState({
                            partner: res.data.partner
                        })
                    }
                }).then(res => {
                    this.setState({
                        sex: information.sex,
                        city: information.city,
                        phone: information.phone,
                        familyStatus: information.familyStatus,
                        employment: information.employment,
                        description: information.description,
                        birthDate: information.birthDate,
                        spinner: false
                    })
                }).catch(err => {
                    this.setState({
                        spinner: false,
                        error: true
                    })
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }
    }

    render() {

        let partnerName = null;
        let partnerPrefix = null;
        let birthDateBlock = null;
        let sexBlock = null;
        let cityBlock = null;
        let phoneBlock = null;
        let familyStatusBlock = null;
        let employmentBlock = null;
        let descriptionBlock = null;

        const {
            partner,
            birthDate,
            sex,
            city,
            phone,
            familyStatus,
            employment,
            description,
            error,
            spinner } = this.state;

        if (partner !== null && partner.accepted === true) {
            const linkToPartnerPage=`/account/${partner.id}`
            partnerName = <Link to={linkToPartnerPage}>
                <div className="profile-information-detailed__content__partner">{partner.firstName} {partner.lastName}</div>
            </Link>
            partnerPrefix = "c"
        }

        if (birthDate.length > 0) {
            birthDateBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    День рождения:
                </div>
                <span>
                    {birthDate}
                </span>
            </div>
        }

        if (sex.length > 0) {
            sexBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    Пол:
                </div>
                <span>
                    {sex}
                </span>
            </div>
        }

        if (city.length > 0) {
            cityBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    Город:
                </div>
                <span>
                    {city}
                </span>
            </div>
        }

        if (phone.length > 0) {
            phoneBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    Номер телефона:
                </div>
                <span>
                    {phone}
                </span>
            </div>
        }

        if (familyStatus.length > 0) {
            familyStatusBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    Семейное положение:
                </div>
                <span>
                    {familyStatus} {partnerPrefix} {partnerName}
                </span>
            </div>
        }

        if (employment.length > 0) {
            employmentBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    Деятельность:
                </div>
                <span>
                    {employment}
                </span>
            </div>
        }

        if (description.length > 0) {
            descriptionBlock = <div className="profile-information-detailed__content">
                <div className="profile-information-detailed__content__name">
                    О себе:
                </div>
                <span>
                    {description}
                </span>
            </div>
        }

        let contentDetailedInformation = <div
            className="profile-information-detailed__content__wrapper">
            {birthDateBlock}
            {sexBlock}
            {cityBlock}
            {phoneBlock}
            {familyStatusBlock}
            {employmentBlock}
            {descriptionBlock}
        </div>

        if (sex.length === 0 &&
            city.length === 0 &&
            familyStatus.length === 0 &&
            phone.length === 0 &&
            employment.length === 0 &&
            description.length === 0 &&
            birthDate.length === 0) {
            contentDetailedInformation = <div className="profile-information-detailed__content_null">
                Информация отсутствует
            </div>
        }

        if (sex.length === 0 &&
            city.length === 0 &&
            familyStatus.length === 0 &&
            phone.length === 0 &&
            employment.length === 0 &&
            description.length === 0 &&
            error) {
            contentDetailedInformation = <div className="profile-information-detailed__content_null">
                Что-то пошло не так! Информация не доступна!
            </div>
        }

        const content = spinner ? <SpinnerMini /> : contentDetailedInformation;

        return (
            <div className="profile-information-detailed">
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        information: state.userInformation,
        id: state.userId
    }
}

const mapDispatchToProps = {
    userAccesses,
    userInformation,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(DetailedInformationBlock))