
export const openModalRegistration=()=>{
    return ({type: 'OPEN_MODAL_REGISTRATION'})
}

export const closeModalRegistration=()=>{
    return ({type: 'CLOSE_MODAL_REGISTRATION'})
}

export const dataBirth=(dataRegistration)=>{
    return({type: 'DATA_BIRDTH', data: dataRegistration})
}

export const loginMainPage=()=>{
    return({type: 'LOGIN_MAIN_PAGE'})
}