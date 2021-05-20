const initialState={
    windowRegistrationOpen: false,
    birth:'',
    loginMainPage: false,
    loginErrorWindow: false,
    loginAndRegistrationPage: true,
    contentPages: false,
    userId: '',
    userAccesses:[]
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
                contentPages: false    
            }
        case 'DISPLAYING_CONTENT_PAGES':
            return {
                ...state,
                loginAndRegistrationPage: false,
                contentPages: true   
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
        default:
            return state;
    }
}

export default reducer;