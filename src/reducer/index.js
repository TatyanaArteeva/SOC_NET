
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
    userAccesses:{},
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
    modalWindowForMainPhotoOptions: false,
    modalWindowForUserNotification: false,
    listRights:{},
    photoUser:'',
    imagesGallery: [],
    imagesGalleryTotalSize: '',
    groupId: '',
    invalidFile: false,
    modalWindowUserNotificationCreatingGroup: false,
    infoRelation: {},
    groupAccesses: {},
    groupInfoRelation: {}
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
            let newData= "Информация отсутствует";
            const date=information.birthDate;
            const dateArr=date.split("-");
            const month=months[dateArr[1]];
            if(date!==null && date!==undefined  && date!== "Информация отсутствует"){
                newData=`${dateArr[2]} ${month} ${dateArr[0]} г.`;
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
            let images=action.arrImages;;
            const start=action.startIndex;
            const end=action.endIndex;
            images.map(el=>{
                Buffer.from(el.data, 'binary').toString('base64');
                return el.data="data:image/jpg;base64," + el.data;
            })
            for(let i=start; i<end; i++){
                    state.imagesGallery[i].original=images[i].data;
                    state.imagesGallery[i].thumbnail=images[i].data;
                    state.imagesGallery[i].id=images[i].id;
            }

            return {
                ...state,
                imagesGallery: state.imagesGallery
        }
        case 'IMAGES_GALLERY_LOADING': 
            let imagesLoading=action.arrImages;
            const startLoading=action.startIndex;
            const endLoading=action.endIndex;
            imagesLoading.map(el=>{
                Buffer.from(el.data, 'binary').toString('base64');
                return el.data="data:image/jpg;base64," + el.data;
            })
            for(let i=startLoading; i<endLoading; i++){
                    state.imagesGallery[i].original=imagesLoading[i-startLoading].data;
                    state.imagesGallery[i].thumbnail=imagesLoading[i-startLoading].data;
                    state.imagesGallery[i].id=imagesLoading[i-startLoading].id;
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
            const arrImages=[]
            for(let i=0; i<action.imagesGalleryTotalSize; i++){
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
        case 'ACCESSES_GROUP': 
            return {
                ...state,
                groupAccesses:action.groupAccesses,
    
           
            }
        case 'INFO_RELATION_GROUP': 
        console.log(action.groupInfoRelation)
            return {
                ...state,
                groupInfoRelation: action.groupInfoRelation
           
        }
        default:
            return state;
    }
}

export default reducer;