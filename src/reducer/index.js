const initialState={
    windowRegistrationOpen: false,
    registrationSuccessful: false,
    birth:'',
    loginMainPage: false,
    loginErrorWindow: false,
    loginAndRegistrationPage: true,
    contentPages: false,
    userId: '',
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
    }
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
            return {
                ...state,
                userInformation: {
                    firstName: information.firstName,
                    lastName: information.lastName,
                    sex: information.sex,
                    birthDate: information.birthDate,
                    city: information.city,
                    familyStatus: information.familyStatus,
                    phone: information.phone,
                    employment: information.employment,
                    personal: information.personal,
                    id: information.id
                }
            }
        default:
            return state;
    }
}

export default reducer;