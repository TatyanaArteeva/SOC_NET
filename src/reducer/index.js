const initialState={
    windowRegistrationOpen: false,
    registrationSuccessful: false,
    birth:'',
    loginMainPage: false,
    loginErrorWindow: false,
    loginAndRegistrationPage: true,
    contentPages: false,
    userId: '',
    userEmail:'',
    userAccesses:[],
    logout: false,
    userInformation: {
        firstName:'',
        lastName: '',
        sex: '',
        birthDate: '',
        city: '',
        familyStatus: '',
        phone: '',
        employment: '',
        description: '',
        id: ''
    },
    modalWindowForUserNotification: false
}


const reducer=(state=initialState, action)=>{
    switch(action.type){
        case 'OPEN_MODAL_REGISTRATION':
            return{
                ...state,
                windowRegistrationOpen: true
            }
        case 'CLOSE_MODAL_REGISTRATION': 
            return {
                ...state,
                windowRegistrationOpen: false
            }
        case 'REGISTRATION_SUCCESSFUL': 
            return {
                ...state,
                registrationSuccessful: true
            }
        case 'CLOSE_WINDOW__MESSAGE_REGISTRATION': 
            return {
                ...state,
                registrationSuccessful: false,
            }
        case 'DATA_BIRDTH':
            return{
                ...state,
                birth: action.data
            }
        case 'LOGIN_MAIN_PAGE':
            return {
                ...state,
                loginMainPage: true
            }
        case 'ERROR_WINDOW_LOGIN_OPEN':
            return {
                ...state,
                loginErrorWindow: true
            }
        case 'ERROR_WINDOW_LOGIN_CLOSE':
            return {
                ...state,
                loginErrorWindow: false
            }
        case 'DISPLAING_LOGIN_AND_REGISTRATION_PAGE':
            return {
                ...state,
                loginAndRegistrationPage: true,
                contentPages: false,
                logout: false
            }
        case 'DISPLAYING_CONTENT_PAGES':
            return {
                ...state,
                loginAndRegistrationPage: false,
                logout: false ,
                contentPages: true,
                loginMainPage: true
            }
        case 'USER_ID':
            return {
                ...state,
                userId: action.id
            }
        case 'USER_EMAIL':
            return {
                ...state,
                userEmail: action.email
            }
        case 'USER_ACCSESSES':
            return {
                ...state,
                userAccesses: action.accesses
            }
        case 'LOGOUT':
            return {
                ...state,
                logout: true,
                loginMainPage: false,
                loginAndRegistrationPage: true,
                contentPages: false,
            }
        case 'USER_INFORMATION':
            const information=action.information;
            for(let key in information){
                        if(information[key]===null || information[key]===undefined){
                            information[key]= "Информация отсутствует"
                        }
                    }
            if(information.sex==="MALE"){
                information.sex="мужской"
            }
            if(information.sex==="FEMALE"){
                information.sex="женский"
            }
            
            const months={
                "01": "января",
                "02": "февраля",
                "03": "марта",
                "04": "апреля",
                "05": "мая",
                "06": "июня",
                "07": "июля",
                "08": "августа",
                "09": "сентября",
                "10": "октября",
                "11": "ноября",
                "12": "декабря",
            }

            const date=information.birthDate;
            const dateArr=date.split("-");
            const month=months[dateArr[1]];
            const newData=`${dateArr[2]} ${month} ${dateArr[0]} г.`;
            return {
                ...state,
                userInformation: {
                    firstName: information.firstName,
                    lastName: information.lastName,
                    sex: information.sex,
                    birthDate: newData,
                    city: information.city,
                    familyStatus: information.familyStatus,
                    phone: information.phone,
                    employment: information.employment,
                    description: information.description,
                    id: information.id
                }
            }
        case 'MODAL_WINDOW_FOR_USER_NOTIFICATION_OPEN': 
            return {
                ...state,
                modalWindowForUserNotification: true,
        }
        case 'MODAL_WINDOW_FOR_USER_NOTIFICATION_CLOSE': 
            return {
                ...state,
                modalWindowForUserNotification: false,
        }
        default:
            return state;
    }
}

export default reducer;