const initialState = {
    windowRegistrationOpen: false,
    registrationSuccessful: false,
    birth: '',
    loginMainPage: false,
    loginErrorWindow: false,
    loginAndRegistrationPage: true,
    contentPages: false,
    userId: '',
    userEmail: '',
    userAccesses: {},
    logout: false,
    userInformation: {
        firstName: '',
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
    modalWindowForMainPhotoOptions: false,
    modalWindowForUserNotification: false,
    listRights: {},
    photoUser: '',
    imagesGallery: [],
    imagesGalleryTotalSize: '',
    groupId: '',
    invalidFile: false,
    modalWindowUserNotificationCreatingGroup: false,
    infoRelation: {},
    groupAccesses: {},
    groupInfoRelation: {},
    allSearchValue: '',
    idForDialogFriends: '',
    outputMessage: {},
    inputMessageObj: [],
    inputNotificationObj: [],
    unsubscribe: false,
    currentIdLocation: '',
    newPost: {},
    accessesToPosts: {},
    pathLink: '',
    actionTransitionModification: '',
    openModalAllParticipantsGroup: false,
    loadingInfoProfile: false,
    loadingPhotoProfile: false,
    mouseLeaveNotificationsList: false,
    returnFromModificationPage: false,
    dropDownMenu: false,
    popstate: false,
    notAuthorization: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_MODAL_REGISTRATION':
            return {
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
            return {
                ...state,
                birth: action.data
            }
        case 'LOGIN_MAIN_PAGE':
            return {
                ...state,
                loginMainPage: true,
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
                logout: false,
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
                loginMainPage: false,
                loginAndRegistrationPage: true,
                contentPages: false,
                logout: true,
                inputMessageObj: [],
                inputNotificationObj: [],
            }
        case 'USER_INFORMATION':
            const information = action.information;
            for (let key in information) {
                if (information[key] === null || information[key] === undefined || information[key].length === 0) {
                    information[key] = ""
                }
            }
            if (information.sex === "MALE") {
                information.sex = "мужской"
            } else if (information.sex === "FEMALE") {
                information.sex = "женский"
            } else if (information.sex.length === 0 || information.sex === null) {
                information.sex = ""
            }
            if (information.familyStatus === "RELATION") {
                information.familyStatus = "В отношениях"
            } else if (information.familyStatus === "NO_RELATION") {
                information.familyStatus = "Не в отношениях"
            } else if (information.familyStatus === "ACTIVE_SEARCH") {
                information.familyStatus = "В активном поиске"
            }
            const months = {
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
            let newData = "";
            const date = information.birthDate;
            const dateArr = date.split("-");
            const month = months[dateArr[1]];
            if (date !== null && date !== undefined && date.length > 0) {
                newData = `${dateArr[2]} ${month} ${dateArr[0]} г.`;
            }
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
        case 'MODAL_WINDOW_FOR_MAIN_PHOTO_OPTIONS_OPEN':
            return {
                ...state,
                modalWindowForMainPhotoOptions: true
            }
        case 'MODAL_WINDOW_FOR_MAIN_PHOTO_OPTIONS_CLOSE':
            return {
                ...state,
                modalWindowForMainPhotoOptions: false
            }
        case 'RIGHTS':
            return {
                ...state,
                listRights: action.rights
            }
        case 'PHOTO_USER':
            return {
                ...state,
                photoUser: action.photo
            }
        case 'IMAGES_GALLERY':
            let images = action.arrImages;;
            const start = action.startIndex;
            const end = action.endIndex;
            images.map(el => {
                Buffer.from(el.data, 'binary').toString('base64');
                el.data = "data:image/jpg;base64," + el.data;
                return el.data
            })
            for (let i = start; i < end; i++) {
                if (images[i] !== undefined) {
                    state.imagesGallery[i].original = images[i].data;
                    state.imagesGallery[i].thumbnail = images[i].data;
                    state.imagesGallery[i].id = images[i].id;
                }
            }
            return {
                ...state,
                imagesGallery: state.imagesGallery
            }
        case 'IMAGES_GALLERY_LOADING':
            let imagesLoading = action.arrImages;
            const startLoading = action.startIndex;
            const endLoading = action.endIndex;
            imagesLoading.map(el => {
                Buffer.from(el.data, 'binary').toString('base64');
                return el.data = "data:image/jpg;base64," + el.data;
            })
            for (let i = startLoading; i < endLoading; i++) {
                state.imagesGallery[i].original = imagesLoading[i - startLoading].data;
                state.imagesGallery[i].thumbnail = imagesLoading[i - startLoading].data;
                state.imagesGallery[i].id = imagesLoading[i - startLoading].id;
            }
            return {
                ...state,
                imagesGallery: state.imagesGallery
            }
        case 'IMAGES_GALLERY_DELETE_PHOTO':
            state.imagesGallery.splice(action.idDeletePhoto, 1)
            return {
                ...state,
                imagesGallery: state.imagesGallery
            }
        case 'IMAGES_GALLERY_TOTAL_SIZE':
            const arrImages = []
            for (let i = 0; i < action.imagesGalleryTotalSize; i++) {
                arrImages.push({
                    original: "",
                    thumbnail: "",
                    thumbnailHeight: 100,
                    thumbnailWidth: 100,
                    id: ""
                })
            }
            return {
                ...state,
                imagesGalleryTotalSize: action.imagesGalleryTotalSize,
                imagesGallery: arrImages
            }
        case 'GROUP_ID':
            return {
                ...state,
                groupId: action.id
            }
        case 'INVALID_FILE_TRUE':
            return {
                ...state,
                invalidFile: true
            }
        case 'INVALID_FILE_FALSE':
            return {
                ...state,
                invalidFile: false
            }
        case 'MODAL_WINDOW_USER_NOTIFICATION_CREATING_GROUP_OPEN':
            return {
                ...state,
                modalWindowUserNotificationCreatingGroup: true
            }
        case 'MODAL_WINDOW_USER_NOTIFICATION_CREATING_GROUP_CLOSE':
            return {
                ...state,
                modalWindowUserNotificationCreatingGroup: false
            }
        case 'INFO_RELATION':
            return {
                ...state,
                infoRelation: action.infoRelation
            }
        case 'INFO_RELATION_FOR_ACCESSES_TO_POSTS':
            return {
                ...state,
                accessesToPosts: action.accessesToPosts
            }
        case 'ACCESSES_GROUP':
            return {
                ...state,
                groupAccesses: action.groupAccesses,


            }
        case 'INFO_RELATION_GROUP':
            return {
                ...state,
                groupInfoRelation: action.groupInfoRelation
            }
        case 'ALL_SEARCH_VALUE':
            return {
                ...state,
                allSearchValue: action.allSearchValue
            }
        case 'ID_FOR_DIALOG_FRIENDS':
            return {
                ...state,
                idForDialogFriends: action.idForDialogFriends
            }
        case 'OUTPUT_MESSAGE':
            return {
                ...state,
                outputMessage: action.outputMessage
            }
        case 'INPUT_MESSAGE_OBJ':
            return {
                ...state,
                inputMessageObj: [...state.inputMessageObj, action.inputMessageObj]
            }
        case 'INPUT_NOTIFICATION_OBJ':
            return {
                ...state,
                inputNotificationObj: [...state.inputNotificationObj, action.inputNotificationObj]
            }
        case 'DELETE_MESSAGE_FROM_INPUT_MESSAGE_OBJ':
            const index = state.inputMessageObj.findIndex(el => {
                return el.id === action.message.id
            })
            const before = state.inputMessageObj.slice(0, index);
            const after = state.inputMessageObj.slice(index + 1);
            const newArr = [...before, ...after]
            return {
                ...state,
                inputMessageObj: newArr
            }
        case 'DELETE_NOTIFICATION_FROM_INPUT_NOTIFICATION_OBJ':
            const indexNotification = state.inputNotificationObj.findIndex(el => {
                return el.id === action.notification.id
            })
            const beforeNotificationArr = state.inputNotificationObj.slice(0, indexNotification);
            const afterNotificationArr = state.inputNotificationObj.slice(indexNotification + 1);
            const newArrNotification = [...beforeNotificationArr, ...afterNotificationArr]
            return {
                ...state,
                inputNotificationObj: newArrNotification
            }
        case 'UNSUBSCRIBE':
            return {
                ...state,
                unsubscribe: true
            }
        case 'SUBSCRIBE':
            return {
                ...state,
                unsubscribe: false
            }
        case 'CURRENT_ID_LOCATION':
            return {
                ...state,
                currentIdLocation: action.currentIdLocation
            }
        case 'NEW_POST':
            return {
                ...state,
                newPost: action.newPost
            }
        case 'PATH_LINK':
            return {
                ...state,
                pathLink: action.pathLink
            }
        case 'ACTION_TRANSITION_MODIFICATION':
            return {
                ...state,
                actionTransitionModification: action.actionTransitionModification
            }
        case 'OPEN_MODAL_ALL_PARTICIPANTS_GROUP':
            return {
                ...state,
                openModalAllParticipantsGroup: true
            }
        case 'CLOSE_MODAL_ALL_PARTICIPANTS_GROUP':
            return {
                ...state,
                openModalAllParticipantsGroup: false
            }
        case 'LOADING_INFO_PROFILE':
            return {
                ...state,
                loadingInfoProfile: action.loadingInfoProfile
            }
        case 'LOADING_PHOTO_PROFILE':
            return {
                ...state,
                loadingPhotoProfile: action.loadingPhotoProfile
            }
        case 'MOUSE_LEAVE_NOTIFICATIONS_LIST':
            return {
                ...state,
                mouseLeaveNotificationsList: action.mouseLeaveNotificationsList
            }
        case 'RETURN_FROM_MODIFICATION_PAGE':
            return {
                ...state,
                returnFromModificationPage: action.returnFromModificationPage
            }
        case 'OPEN_AND_CLOSE_DROP_DOWN_MENU':
            return {
                ...state,
                dropDownMenu: action.openAndCloseDropDownMenu
            }
        case 'POPSTATE':
            return {
                ...state,
                popstate: action.popstate
            }
        case 'CHECKINGFORAUTORIZATION':
            localStorage.clear();
            return {
                ...state,
                loginMainPage: false,
                loginAndRegistrationPage: true,
                contentPages: false,
                logout: true,
                inputMessageObj: [],
                inputNotificationObj: [],

            }
        default:
            return state;
    }
}

export default reducer;