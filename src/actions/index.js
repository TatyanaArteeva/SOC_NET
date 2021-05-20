export const displayingLoginAndRegistrationPage=()=>{
    return({type: 'DISPLAING_LOGIN_AND_REGISTRATION_PAGE'})
}

export const displayingContentPages=()=>{
    return({type: 'DISPLAYING_CONTENT_PAGES'})
}

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

export const errorWindowLoginOpen=()=>{
    return({type: 'ERROR_WINDOW_LOGIN_OPEN'})
}

export const errorWindowLoginClose=()=>{
    return({type: 'ERROR_WINDOW_LOGIN_CLOSE'})
}

export const userId=(id)=>{
    return({type: 'USER_ID', id: id})
}

export const userAccesses=(accesses)=>{
    return({type: 'USER_ACCSESSES', accesses: accesses})
}