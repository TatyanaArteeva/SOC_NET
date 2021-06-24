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

export const registrationSuccessful=()=>{
    return ({type: 'REGISTRATION_SUCCESSFUL'})
}

export const closeWindowMessageRegistration  =()=>{
    return ({type: 'CLOSE_WINDOW__MESSAGE_REGISTRATION'})
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

export const userEmail=(email)=>{
    return({type: 'USER_EMAIL', email: email})
}

export const userAccesses=(accesses)=>{
    return({type: 'USER_ACCSESSES', accesses: accesses})
}

export const logout=()=>{
    return({type: 'LOGOUT'})
}

export const userInformation=(information)=>{
    return({type: 'USER_INFORMATION', information: information})
}

export const modalWindowForUserNotificationOpen=()=>{
    return({type: 'MODAL_WINDOW_FOR_USER_NOTIFICATION_OPEN'})
}

export const modalWindowForUserNotificationClose=()=>{
    return({type: 'MODAL_WINDOW_FOR_USER_NOTIFICATION_CLOSE'})
}

export const modalWindowForMainPhotoOptionsOpen=()=>{
    return({type: 'MODAL_WINDOW_FOR_MAIN_PHOTO_OPTIONS_OPEN'})
}

export const modalWindowForMainPhotoOptionsClose=()=>{
    return({type: 'MODAL_WINDOW_FOR_MAIN_PHOTO_OPTIONS_CLOSE'})
}

export const photoRights=(rights)=>{
    return({type: 'PHOTO_RIGHTS', rights: rights})
}

export const photoUser=(photo)=>{
    return({type: 'PHOTO_USER', photo: photo})
}
export const imagesForGallery=(arrImages)=>{
    return({type: 'IMAGES_GALLERY', arrImages: arrImages})
}
export const imagesForGalleryUpdate=(arrImagesUpdate)=>{
    return({type: 'IMAGES_GALLERY_UPDATE', arrImagesUpdate: arrImagesUpdate})
}
export const imagesGalleryTotalSize=(imagesGalleryTotalSize)=>{
    return({type: 'IMAGES_GALLERY_TOTAL_SIZE', imagesGalleryTotalSize: imagesGalleryTotalSize})
}




