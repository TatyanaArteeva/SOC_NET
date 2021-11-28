import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import {
    userInformation,
    modalWindowForUserNotificationOpen,
    modalWindowForUserNotificationClose,
    pathLink, returnFromModificationPage,
    actionTransitionModification,
    popstate,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import parseISO from 'date-fns/parseISO';
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { useHistory } from "react-router-dom";
import ModalWindow from '../modalWindowForMessageUser/modalWindowForMessageUser';
import './modification.scss';
import PromptNav from '../promptNav/promptNav';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinnerMini/spinnerMini';
import SpinnerMiniMini from '../spinnerMiniMini/spinnerMiniMini';
import deletee from './delete.svg';
let req = false;
let listClass = "modification-account__family__list";

const Modification = (
    {
        Service,
        userInformation,
        id,
        modalWindowForUserNotificationOpen,
        modalWindowForUserNotificationClose,
        modalWindowUserNotificationTrue,
        popstate,
        checkingForAuthorization,
        unsubscribe
    }
) => {
    const idLink = `/account/${id}`;
    const { push } = useHistory();
    registerLocale("ru", ru);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState('');
    const [city, setCity] = useState('');
    const [familyStatus, setFamilyStatus] = useState('');
    const [phone, setPhone] = useState('')
    const [employment, setEmployment] = useState('');
    const [description, setDescription] = useState('');
    const [birthDate, setBirthtDate] = useState('');
    const [email, setEmail] = useState('');
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [accountsPartners, setAccountsPartners] = useState([]);
    const [totalSizePartners, setTotalSizePartners] = useState('');
    const [searchSelectPartner, setSearchSelectPartner] = useState('');
    const [selectPartner, setSelectPartner] = useState('');
    const [searchPartner, setSearchPartner] = useState(false);
    const [calcIndex, setCalcIndex] = useState(false);
    const [loadingPartners, setLoadingPartners] = useState(false);
    const [modalWindowSelectPartner, setModalWindowSelectPartner] = useState(false);
    const [listPartnerStyle, setListPartnerStyle] = useState("modification-account__family__selection-partner__modification__wrapper__select-partner__list");
    const [selectElem, setSelectElem] = useState({});
    const [nav, setNav] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [spinnerMini, setSpinnerMini] = useState(false);
    const [spinnerMiniMini, setSpinnerMiniMini] = useState(false);
    const [listClassActiveFamilyStatus, setListClassActiveFamilyStatus] = useState(false);
    const [familyStatusText, setFamilyStatusText] = useState('');
    const [errorLoadingContent, setErrorLoadingContent] = useState(false);
    const [errorModificitation, setErrorModification] = useState(false);
    const [errorLoadingPartnersList, setErrorLoadingPartnersList] = useState(false);
    const partnersListRef = useRef();
    let newFormatDate = null;
    let accountsPartnersList = null;
    let selectionPartner = null;
    let selectPartnerBtn = null;
    let messageSelectPartner = null;
    let windowHeight = null;

    useEffect(() => {
        let cleanupFunction = false;
        const information = async () => {
            try {
                const res = await Service.getUserAccountId(id);
                if (!cleanupFunction) {
                    if (res.data.partner !== null) {
                        setSelectElem(res.data.partner)
                        setSelectPartner(res.data.partner.id)
                    } else {
                        setSelectElem('')
                        setSelectPartner('')
                    }
                    const objModification = {
                        city: res.data.city,
                        description: res.data.description,
                        email: res.data.email,
                        employment: res.data.employment,
                        familyStatus: res.data.familyStatus,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        phone: res.data.phone,
                        sex: res.data.sex,
                    }
                    for (let key in objModification) {
                        if (objModification[key] === null ||
                            objModification[key] === undefined ||
                            objModification[key] === "Информация отсутствует") {
                            objModification[key] = ""
                        }
                    }
                    if (objModification.familyStatus.length === 0) {
                        setFamilyStatusText("Не выбрано")
                    } else if (objModification.familyStatus === "RELATION") {
                        setFamilyStatusText("В отношениях")
                    } else if (objModification.familyStatus === "NO_RELATION") {
                        setFamilyStatusText("Не в отношениях")
                    } else if (objModification.familyStatus === "ACTIVE_SEARCH") {
                        setFamilyStatusText("В активном поиске")
                    }
                    setFirstName(objModification.firstName)
                    setLastName(objModification.lastName)
                    setSex(objModification.sex)
                    setCity(objModification.city)
                    setFamilyStatus(objModification.familyStatus)
                    setPhone(objModification.phone)
                    setEmployment(objModification.employment)
                    setDescription(objModification.description)
                    setEmail(res.data.email)
                    setNav(false)
                    setSpinner(false)
                    let newDate = null;
                    if (res.data.birthDate !== undefined &&
                        res.data.birthDate !== null &&
                        res.data.birthDate !== "Информация отсутствует") {
                        const dateTime = new Date(res.data.birthDate).getTime();
                        const dateTimeZone = new Date(res.data.birthDate).getTimezoneOffset() * 60 * 1000;
                        const dateNewTimeZone = new Date(dateTime + dateTimeZone).toISOString();
                        const dateBirth = parseISO(dateNewTimeZone);
                        newDate = dateBirth
                    }
                    setBirthtDate(newDate)
                    userInformation(res.data)
                }
            } catch (err) {
                setSpinner(false)
                setErrorLoadingContent(true)
                if (err.response.status === 401) {
                    unsubscribe()
                    checkingForAuthorization();
                }
            }
        }
        information()
        return () => cleanupFunction = true;
    }, [Service, id, userInformation])

    useEffect(() => {
        if (!nav) {
            window.addEventListener('popstate', () => goToBack())
        }
    }, [nav])

    useEffect(() => {
        if (searchSelectPartner.length === 0 && searchPartner === true) {
            setListPartnerStyle("activeList")
            setSelectPartner('')
            setSpinnerMini(true)
            Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`,
                { params: { name: searchSelectPartner } })
                .then(res => {
                    if (res.status === 200) {
                        const accountArr = res.data.accounts.map(el => {
                            return el.account
                        })
                        setSpinnerMini(false)
                        setAccountsPartners(accountArr)
                        setTotalSizePartners(res.data.totalSize);
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }
    }, [searchSelectPartner, searchPartner])

    useEffect(() => {
        if (searchSelectPartner.length > 0 && searchPartner === true) {
            if (start === 0) {
                setSpinnerMini(true)
                Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`,
                    { params: { name: searchSelectPartner } })
                    .then(res => {
                        if (res.status === 200) {
                            const accountArr = res.data.accounts.map(el => {
                                return el.account
                            })
                            setSpinnerMini(false)
                            setAccountsPartners(accountArr)
                            setTotalSizePartners(res.data.totalSize);
                        }
                    }).catch(err => {
                        setSpinnerMini(false);
                        setErrorLoadingPartnersList(true)
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
        }
    }, [searchSelectPartner, searchPartner])

    if ((partnersListRef.current !== undefined && end < totalSizePartners)) {
        if (partnersListRef.current !== null) {
            partnersListRef.current.addEventListener("scroll", () => {
                windowHeight = partnersListRef.current.clientHeight;
                let scrollTop = partnersListRef.current.scrollTop;
                if (partnersListRef.current !== null && partnersListRef.current !== undefined) {
                    let heghtList = partnersListRef.current.scrollHeight;
                    let heghtListOffsetTop = partnersListRef.current.offsetTop
                    if ((scrollTop + windowHeight - heghtListOffsetTop) >= (heghtList / 100 * 50) &&
                        req === false &&
                        totalSizePartners !== undefined) {
                        setCalcIndex(true)
                    }
                }
            })
        }
    }

    useEffect(() => {
        if (calcIndex) {
            if (start + 10 === totalSizePartners) {
                setCalcIndex(false)
                return
            } else if (start + 10 > totalSizePartners) {
                setCalcIndex(false)
                return
            } else if (end + 10 > totalSizePartners) {
                setStart(end)
                setEnd(totalSizePartners)
                req = true;
                setLoadingPartners(true)
                setCalcIndex(false)
            } else {
                setStart(end)
                setEnd(end + 10)
                req = true
                setLoadingPartners(true)
                setCalcIndex(false)
            }
        }
    }, [req, start, end, calcIndex])

    useEffect(() => {
        let cleanupFunction = false;
        if (loadingPartners && start >= 10) {
            const inf = async () => {
                setSpinnerMiniMini(true)
                try {
                    const res = await Service.getAllPossiblePartners(`/api/friend/get-friends/${id}?start=${start}&end=${end}`,
                        { params: { name: searchSelectPartner } })
                    if (!cleanupFunction) {
                        const accountArr = res.data.accounts.map(el => {
                            return el.account
                        })
                        setSpinnerMiniMini(false)
                        setAccountsPartners([...accountsPartners, ...accountArr])
                        setTotalSizePartners(res.data.totalSize)
                        req = false;
                        setLoadingPartners(false)
                    }
                } catch (err) {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                }
            }
            inf()
        }
        return () => cleanupFunction = true;
    }, [loadingPartners])

    useEffect(() => {
        if (!searchPartner) {
            setListPartnerStyle("modification-account__family__selection-partner__modification__wrapper__select-partner__list")
            setErrorLoadingPartnersList(false)
        }
    }, [searchPartner])


    function postModificationForm(event) {
        setSpinner(true)
        if (birthDate !== null && birthDate !== undefined) {
            newFormatDate = new Date(
                birthDate.getTime() - birthDate.getTimezoneOffset() * 60 * 1000
            ).toISOString().split('T')[0]
        }

        event.preventDefault();
        const modificationAccount = {
            birthDate: newFormatDate,
            city: city,
            description: description,
            email: email,
            employment: employment,
            familyStatus: familyStatus,
            firstName: firstName,
            id: id,
            lastName: lastName,
            phone: phone,
            sex: sex,
            partnerId: selectPartner
        }
        for (let key in modificationAccount) {
            if (modificationAccount[key] === null ||
                modificationAccount[key] === undefined ||
                modificationAccount[key].length === 0) {
                modificationAccount[key] = null
            }
        }
        function closeModalWindowAndTransitionMyPage() {
            modalWindowForUserNotificationClose()
            push({
                pathname: `${idLink}`
            });
        }
        Service.postModificationUser('api/account', modificationAccount)
            .then(res => {
                if (res.status === 200) {
                    modalWindowForUserNotificationOpen();
                    setSpinner(false)
                    setNav(true)
                }
            }).then(res => {
                setTimeout(closeModalWindowAndTransitionMyPage, 1000)
            }).catch(err => {
                setSpinner(false);
                setErrorModification(true)
                if (err.response.status === 401) {
                    unsubscribe()
                    checkingForAuthorization();
                }
            })
    }

    useEffect(() => {
        if (searchPartner === false) {
            setStart(0);
            setEnd(10);
            setAccountsPartners([]);
            setTotalSizePartners('');
        }
    }, [searchPartner])

    useEffect(() => {
        if (familyStatus === "NO_RELATION" ||
            familyStatus === "ACTIVE_SEARCH" ||
            familyStatus.length === 0) {
            deleteSelectPartner()
        }
    }, [familyStatus])

    useEffect(() => {
        if (selectPartner.length > 0 && selectElem.id.length > 0) {
            setSearchPartner(false)
            setModalWindowSelectPartner(false);
            setSearchSelectPartner('');
        }
    }, [selectElem])

    function goToBack() {
        popstate(true)
    }

    const futureDays = date => {
        return date <= new Date();
    };

    function valueFirstName(event) {
        setFirstName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    function valueLastName(event) {
        setLastName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    function valueSex(event) {
        setSex(event.target.value)
    }

    function valueCity(event) {
        setCity(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    function valueDescription(event) {
        setDescription(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
    }

    function valueEmployment(event) {
        setEmployment(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))
    }

    function valueSearchPartner(event) {
        setSearchSelectPartner(event.target.value)
        setStart(0);
        setEnd(10)
    }

    function searchPartnerTrue() {
        setSearchPartner(true)
    }

    function openModalSelectPartner() {
        setModalWindowSelectPartner(true)
    }

    function mouseLeavePartnersList() {
        setSearchPartner(false)
    }

    function closeModalSelectPartner() {
        setSearchPartner(false)
        setModalWindowSelectPartner(false);
        setSearchSelectPartner('');
    }

    function deleteSelectPartner() {
        setSelectElem({})
        setSelectPartner('');
        closeModalSelectPartner();
    }

    const miniSpinner = spinnerMini ? <SpinnerMini /> : null;
    const miniMiniSpinner = spinnerMiniMini ? <SpinnerMiniMini /> : null;

    if (accountsPartners.length === 0 && !spinnerMini) {
        accountsPartnersList = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner__list__item_null">
            Партнеров нет, так как список друзей пуст
        </div>
    }

    if (accountsPartners.length > 0 && !spinnerMini) {
        accountsPartnersList = accountsPartners.map(el => {
            return <li key={el.id}
                className="modification-account__family__selection-partner__modification__wrapper__select-partner__list__item"
                onClick={() => {
                    setSelectElem(el)
                    setSelectPartner(el.id)
                }}>
                <img src={"data:image/jpg;base64," + el.photo}
                    alt="photoName"
                    className="modification-account__family__selection-partner__modification__wrapper__select-partner__list__item_img"
                />
                <span className="modification-account__family__selection-partner__modification__wrapper__select-partner__list__item_name">
                    {el.firstName} {el.lastName}
                </span>
            </li>
        })
    }

    if (errorLoadingPartnersList) {
        accountsPartnersList = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner__list__item_null">
            Что-то пошло не так! Партнеры не доступны!
        </div>
    }

    const partner = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner">
        <label className="modification-account__label">
            <button className="modification-account__family__selection-partner__btn"
                onClick={closeModalSelectPartner}>
                Закрыть
            </button>
        </label>
        <div>
            <input placeholder="Введите имя партнера"
                type="text"
                name="selectPartner"
                value={searchSelectPartner}
                onChange={valueSearchPartner}
                onClick={searchPartnerTrue}
                className="modification-account__family__selection-partner__input"
                autoComplete="off"
            />
            <ul className={listPartnerStyle}
                ref={partnersListRef}
                onMouseLeave={mouseLeavePartnersList}>
                {accountsPartnersList}
                {miniSpinner}
                {miniMiniSpinner}
            </ul>
        </div>
    </div>

    if (familyStatus === "RELATION") {
        selectPartnerBtn = <label className="modification-account__label">
            <button className="modification-account__family__selection-partner__btn"
                onClick={openModalSelectPartner}>
                Выбрать партнера
            </button>
        </label>
    }

    if (selectPartner.length > 0 &&
        !searchPartner &&
        !modalWindowSelectPartner &&
        searchSelectPartner.length === 0 &&
        familyStatus === "RELATION") {
        selectPartnerBtn = null;
        let informationAboutConfirmationRelationships = null;
        if (selectElem.accepted === true) {
            informationAboutConfirmationRelationships = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner__select__warning">
                Партнер подтвердил отношения!
            </div>
        } else if (selectElem.accepted === false) {
            informationAboutConfirmationRelationships = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner__select__warning">
                Партнер еще не подтвердил отношения!
            </div>
        } else if (selectElem.accepted === undefined) {
            informationAboutConfirmationRelationships = null
        }
        messageSelectPartner = <div className="modification-account__family__selection-partner__modification__wrapper__select-partner__select">
            <label className="modification-account__label">Партнер:</label>
            <span>
                <span>
                    {selectElem.firstName} {selectElem.lastName}
                    <img onClick={deleteSelectPartner} src={deletee} alt="delete" />
                </span>
                {informationAboutConfirmationRelationships}
            </span>
        </div>
    }

    if (modalWindowSelectPartner) {
        selectPartnerBtn = null;
        selectionPartner = partner
    }

    function toggleBtnFamilyStatusList() {
        setListClassActiveFamilyStatus(!listClassActiveFamilyStatus)
    }

    if (listClassActiveFamilyStatus === true) {
        listClass = "activeListFamily"
    } else {
        listClass = "modification-account__family__list"
    }

    useEffect(() => {
        if (listClassActiveFamilyStatus === true) {
            setSearchPartner(false)
        }
    }, [listClassActiveFamilyStatus])

    function selectFamilyStatus(e) {
        setFamilyStatus(e.target.dataset.value)
        setFamilyStatusText(e.target.innerText)
        setListClassActiveFamilyStatus(false)
    }

    function closeModalWindowErrorModification() {
        setErrorModification(false)
    }

    const modalWindowUserNotification = modalWindowUserNotificationTrue ?
        <ModalWindow message={"Изменения успешно сохранены!"} /> : null;
    const modalWindowUserNotificationError = errorModificitation ?
        <ModalWindow message={"Что-то пошло не так! Изменения не сохранены!"} /> : null;

    if (errorModificitation) {
        setTimeout(closeModalWindowErrorModification, 2000)
    }

    function mouseLeaveFamilyStatus() {
        setListClassActiveFamilyStatus(false)
    }

    let contentModification = <form onSubmit={postModificationForm} className="modification-account">
        <h2 className="modification-account__title">Редактирование:</h2>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">Имя:</label>
            <input
                onChange={valueFirstName}
                type="text"
                name="firstName"
                placeholder="Укажите свое имя"
                value={firstName}
                className="modification-account__label_input"
                required />
        </div>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">Фамилия: </label>
            <input
                onChange={valueLastName}
                type="text"
                name="lastName"
                placeholder="Укажите свою фамилию"
                className="modification-account__label_input"
                value={lastName} />
        </div>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">Пол:</label>
            <div className="modification-account__wrapper-sex">
                <input value="FEMALE"
                    onChange={valueSex}
                    checked={sex === "FEMALE" ? true : false}
                    type="radio"
                    name="sex"
                    id="female"
                    className="modification-account__wrapper-sex_input-radio" />
                <label htmlFor="female" className="modification-account__wrapper-sex_label">
                    Женский
                </label>
            </div>
            <div className="modification-account__wrapper-sex">
                <input value="MALE"
                    onChange={valueSex}
                    checked={sex === "MALE" ? true : false}
                    type="radio"
                    name="sex"
                    id="male"
                    className="modification-account__wrapper-sex_input-radio" />
                <label htmlFor="male" className="modification-account__wrapper-sex_label">
                    Мужской
                </label>
            </div>
            <div className="modification-account__wrapper-sex">
                <input value=""
                    onChange={valueSex}
                    checked={sex === "" ? true : false}
                    type="radio"
                    name="sex"
                    id="not-selected"
                    className="modification-account__wrapper-sex_input-radio" />
                <label htmlFor="not-selected" className="modification-account__wrapper-sex_label">
                    Не выбрано
                </label>
            </div>
        </div>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">День рождения:  </label>
            <DatePicker dateFormat="dd.MM.yyyy"
                filterDate={futureDays}
                selected={birthDate}
                onChange={(date) => {
                    setBirthtDate(date);
                }}
                placeholderText="Укажите вашу дату рождения"
                isClearable
                className="modification-account__label_input"
                locale={ru}
            />
        </div>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">Город: </label>
            <input
                onChange={valueCity}
                type="text"
                name="city"
                placeholder="Укажите свой город проживания"
                className="modification-account__label_input"
                value={city} />
        </div>
        <div className="modification-account__wrapper-family">
            <label className="modification-account__label">Семейное положение: </label>
            <div className="modification-account__wrapper-family__wrapper-list">
                <div className="modification-account__family__btn"
                    onClick={toggleBtnFamilyStatusList}>
                    {familyStatusText}
                </div>
                <ul className={listClass} onMouseLeave={mouseLeaveFamilyStatus}>
                    <li className="modification-account__family__item"
                        data-value="" onClick={selectFamilyStatus}>
                        Не выбрано
                    </li>
                    <li className="modification-account__family__item"
                        data-value="RELATION"
                        onClick={selectFamilyStatus}>
                        В отношениях
                    </li>
                    <li className="modification-account__family__item"
                        data-value="NO_RELATION"
                        onClick={selectFamilyStatus}>
                        Не в отношениях
                    </li>
                    <li className="modification-account__family__item"
                        data-value="ACTIVE_SEARCH"
                        onClick={selectFamilyStatus}>
                        В активном поиске
                    </li>
                </ul>
            </div>
        </div>
        <div className="modification-account__family__selection-partner__wrapper">
            {selectionPartner}
            {selectPartnerBtn}
            {messageSelectPartner}
        </div>
        <div className="modification-account__wrapper">
            <label className="modification-account__label">Телефон:</label>
            <PhoneInput
                placeholder="Укажите свой номер телефона"
                value={phone}
                className="modification-account__label_input"
                onChange={setPhone} />
        </div>

        <div className="modification-account__wrapper">
            <label className="modification-account__label">Место работы или учёбы: </label>
            <input
                onChange={valueEmployment}
                type="text"
                name="employment"
                placeholder="Укажите, ваше место работы или учёбы"
                className="modification-account__label_input"
                value={employment}
            />
        </div>
        <div className="modification-account__wrapper-description">
            <label className="modification-account__label">
                О себе:
            </label>
            <textarea
                onChange={valueDescription}
                name="description"
                placeholder="Укажите, чем вы увлекаетесь в свободное время"
                className="modification-account__label_input-description"
                value={description} />
        </div>
        <button type="submit" className="modification-account__submit">
            Сохранить
        </button>
    </form>

    if (errorLoadingContent) {
        contentModification = <div>Что-то пошло не так! Контент не доступен!</div>
    }

    const content = spinner ? <Spinner /> : contentModification;

    return (
        <div className="modification">
            <PromptNav when={nav === false} />
            {content}
            {modalWindowUserNotification}
            {modalWindowUserNotificationError}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        id: state.userId,
        modalWindowUserNotificationTrue: state.modalWindowForUserNotification,
        pathLinkState: state.pathLink,
        actionTransitionModificationState: state.actionTransitionModification,
        returnFromModificationPageState: state.returnFromModificationPage
    }
}

const mapDispatchToProps = {
    userInformation,
    modalWindowForUserNotificationOpen,
    modalWindowForUserNotificationClose,
    pathLink,
    returnFromModificationPage,
    actionTransitionModification,
    popstate,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(Modification))
