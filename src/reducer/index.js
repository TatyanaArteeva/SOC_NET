const initialState={
    windowRegistrationOpen: false,
    birth:'',
    loginMainPage: false
}

console.log(initialState.birth)
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
        default:
            return state;
    }
}
export default reducer;