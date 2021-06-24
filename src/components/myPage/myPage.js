import React, {Component, createElement} from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import WithService from '../hoc/hoc';
import { userInformation, photoRights, imagesForGallery, imagesGalleryTotalSize, imagesForGalleryUpdate} from '../../actions';
import PhotoUser from '../photoUser/photoUser';
import ImageGallery from 'react-image-gallery';


class MyPage extends Component{
    constructor(props){
        super(props)
        this.refImgGallery=React.createRef();
        this.state={
            btnDetailedInformation: false,
            firstName: '',
            lastName: '',
            birthDate: '',
            deleteImageModalWindow: false,
            currentImageIndex: '',
            addImageModalWindow: false,
            userNotificationModalWindowAddImages: false,
            newImage: '',
            newImageName: [],
            imagess: []
        }
        const {Service} = this.props;
        let start=0;
        let end=5;
        
        this.detailedInformation=()=>{
            this.setState(({btnDetailedInformation})=>({
                btnDetailedInformation: !btnDetailedInformation
            }))
        }

        this.recepionInformation=()=>{
            Service.getUserAccountId(this.props.id)
                .then(res=>{
                    if(res.status===200){
                        this.props.userInformation(res.data)
                    }
                }).then(res=>{
                    this.setState({
                    firstName: this.props.information.firstName,
                    lastName: this.props.information.lastName,
                    birthDate: this.props.information.birthDate
                    })
                });
            Service.getAccountInfo(`/api/account/${this.props.id}/page-info`)
                .then(res=>this.props.photoRights(res.data.accesses));

            Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`, {
                                responseType: 'arraybuffer'
                                })
                .then(res=>{
                    this.props.imagesGalleryTotalSize(res.data.totalSize)
                    this.props.imagesForGallery(res.data.photos)
                        this.setState(({imagess})=>{
                            for(let i=0; i<this.props.totalSizeImages; i++){
                                imagess.push({
                                    original: "",
                                    thumbnail: "",
                                    thumbnailHeight: 100,
                                    thumbnailWidth: 100,
                                    id: ""
                                })
                            }
                            for(let i=start; i<this.props.arrImagesGallery.length; i++){
                                    imagess[i].original=this.props.arrImagesGallery[i].data;
                                    imagess[i].thumbnail=this.props.arrImagesGallery[i].data;
                                    imagess[i].id=this.props.arrImagesGallery[i].id;
                            }
                            
                            return imagess
                        })
                })
                
        }

        this.componentDidMount=()=>{
            this.recepionInformation()
        }

        this.deleteImageModalWindowOpen=()=>{
            const imageIndex=this.imageGallery.getCurrentIndex();
            this.setState({
                deleteImageModalWindow: true,
                currentImageIndex: imageIndex
            })
        }

        this.cancelDeleteImage=()=>{
            this.setState({
                deleteImageModalWindow: false
            })
        }

        this.deleteImage=()=>{
            const objImage=images[this.state.currentImageIndex];
            const imageId=objImage.id;
        }

        this.addImageModalWindowOpen=()=>{
            this.setState({
                addImageModalWindow: true
            })
        }

        this.valueAndNameNewImage=(event)=>{
            this.setState({
                newImage: [...this.state.newImage, event.target.files[0]]
            })
            if(event.target.value.length>0){
                this.setState({
                    newImageName: [...this.state.newImageName, event.target.value]
                },()=>{
                    event.target.value="";
                })
            }
        }
           
        this.cancelAddImage=()=>{
            this.setState({
                addImageModalWindow: false
            })
            if(this.state.newImage.length>0 && this.state.newImageName.length>0){
                this.setState({
                    newImage: [],
                    newImageName: []
                })
            }
        }
    
        this.deleteNewImageFromList=(index)=>{
            this.setState(({newImage, newImageName})=>{
                
                const beforeImage=newImage.slice(0, index);
                const afterImage=newImage.slice(index+1);
                const newListNewImage=[...beforeImage, ...afterImage];

                const beforeImageName=newImageName.slice(0, index);
                const afterImageName=newImageName.slice(index+1);
                const newListNewImageName=[...beforeImageName, ...afterImageName];

                return {
                    newImage : newListNewImage,
                    newImageName: newListNewImageName
                }
            })

        }

        this.userNotificationModalWindowAddClose=()=>{
            this.setState({
                userNotificationModalWindowAddImages: false
            })
        }

        this.postNewImages=(event)=>{
            event.preventDefault();
            const formData=new FormData();
            for(let i=0; i<this.state.newImage.length; i++){
                formData.append("photos", this.state.newImage[i])
            }
            Service.postNewPhotoProfile(`/api/photo/${this.props.id}/add`, formData)
                .then(res=>{
                    if(res.status===200){
                        start=0;
                        end=3;
                        Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`)
                            .then(res=>{
                                this.props.imagesGalleryTotalSize(res.data.totalSize)
                                this.props.imagesForGalleryUpdate(res.data.photos)
                                this.setState({
                                    imagess: []
                                })
                                this.setState(({imagess})=>{
                                    for(let i=0; i<this.props.totalSizeImages; i++){
                                        imagess.push({
                                            original: "",
                                            thumbnail: "",
                                            thumbnailHeight: 100,
                                            thumbnailWidth: 100,
                                            id: ""
                                        })
                                    }
                                    for(let i=start; i<this.props.arrImagesGallery.length; i++){
                                        imagess[i].original=this.props.arrImagesGallery[i].data;
                                        imagess[i].thumbnail=this.props.arrImagesGallery[i].data;
                                        imagess[i].id=this.props.arrImagesGallery[i].id;
                                        console.log(this.props.arrImagesGallery)
                                    }
                                                    
                                    return imagess
                                })
                                this.cancelAddImage()
                                this.setState({
                                    userNotificationModalWindowAddImages: true,
                                });
                                setTimeout(this.userNotificationModalWindowAddClose, 1000)
                            })
                        
                    }
                })
                
        }

        this.onSlide=(index)=>{
                if(index==end-2){
                    start=end;
                    end=end+5;
                    console.log(start, end)
                    Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`, {
                        responseType: 'arraybuffer'
                        })
                        .then(res=>{
                            console.log(res)
                            // this.props.imagesForGallery(res.data.photos)
                            // console.log(this.props.arrImagesGallery)
                            // this.setState(({imagess})=>{
                            //     for(let i=0; i<end-start; i++){
                            //         if(this.props.arrImagesGallery[i]!=undefined){
                            //             imagess[i].original=this.props.arrImagesGallery[i].data;
                            //             imagess[i].thumbnail=this.props.arrImagesGallery[i].data;
                            //             imagess[i].id=this.props.arrImagesGallery[i].id;
                            //         }
                            //     }
                            //     console.log(imagess)
                            //     return imagess
                            // })
                            
                        })
                }
               
        }

        
    }

    
    render(){
        const gallery=document.querySelectorAll(".image-gallery");
        const galleryObj=gallery[0];
        const btnDeletePhoto=document.createElement("button");
        btnDeletePhoto.innerHTML="Удалить фото";
        btnDeletePhoto.classList.add("photo_deleteBtn")
        btnDeletePhoto.addEventListener("click", ()=>{
            this.deleteImageModalWindowOpen()
        })
        if(galleryObj!==undefined){
            galleryObj.append(btnDeletePhoto)
        }

        

        const modalWindowFromDeleteImage=<div className="ModalWindowForDeleteImage">
                                            <div>Вы уверены что хотите удалить фото номер {this.state.currentImageIndex+1}?</div>
                                            <div>
                                                <button onClick={this.deleteImage}>Удалить фото</button>
                                                <button onClick={this.cancelDeleteImage}>Отмена</button>
                                            </div>
                                        </div>
        
        const modalWindowDeleteImage=this.state.deleteImageModalWindow ? modalWindowFromDeleteImage : null;

        let listNewImage=null;

        let modalWindowUserNotificationAddImages=null;

        if(this.state.userNotificationModalWindowAddImages){
            modalWindowUserNotificationAddImages=<div className="ModalWindowForDeleteImage">
                                                        <button onClick={this.userNotificationModalWindowAddClose}>Закрыть</button>
                                                        <div>фото успешно добавлены!</div>
                                                    </div>
        } 


        if(this.state.newImageName.length>0 && this.state.newImageName!==undefined && this.state.newImage.length>0 && this.state.newImage!== undefined){
            listNewImage=<div>
                            Вы выбрали файлы: 
                            <ul>
                                {
                                    this.state.newImageName.map((el, index)=>{
                                        return(
                                            <li key={index}>
                                                {el} 
                                                <button onClick={()=>this.deleteNewImageFromList(index)}>Удалить элемент</button>
                                            </li>  
                                        )  
                                    })
                                }
                            </ul>
                                <button onClick={this.postNewImages}>Загрузить фото</button>
                        </div>
        }

        const modalWindowFromAddImage=<div className="ModalWindowForDeleteImage">
                                        Пожалуйста, добавьте фото для загрузки!
                                        <form>
                                            <input  name="photos" 
                                                    type="file" 
                                                    accept="image/jpeg,image/png" 
                                                    multiple
                                                    onChange={this.valueAndNameNewImage}
                                                    />
                                        </form>
                                        {listNewImage}
                                        <div>
                                            <button onClick={this.cancelAddImage}>
                                                Отмена
                                            </button>
                                        </div>
                                      </div>

        const modalWindowAddImage=this.state.addImageModalWindow ? modalWindowFromAddImage : null;
        
        const blockDetailedInformation=this.state.btnDetailedInformation? <DetailedInformationBlock/> : null;
        return(
            <div>
                <div className="profile">
                    <div className="profile_photo"><PhotoUser/></div>
                        <div className="profile_information">
                            <HashRouter>
                                <Link to="/modification"><div className="profile_editing">Редактировать</div></Link>
                            </HashRouter>
    
                            <div className="profile_name">Мое имя: {this.state.firstName} {this.state.lastName}</div>
                            <div className="profile_information_title">Основная информация</div>
                            <div className="profile_information__birthday">День рождения: {this.state.birthDate}</div>
                            <button onClick={this.detailedInformation}>Показать подробную информацию</button>
                            {blockDetailedInformation}
                        </div>
                        <div className="profile_photos">
                            Здесь будет карусель для фото
                            <div className="profile_photos_wrapper">
                                <button onClick={this.addImageModalWindowOpen}>Добавить фото</button>
                                {modalWindowAddImage}
                                {modalWindowUserNotificationAddImages}
                                <ImageGallery
                                    ref={i => this.imageGallery = i}
                                    items={this.state.imagess}
                                    thumbnailPosition="left"
                                    showIndex={true}
                                    // lazyLoad={true}
                                    onSlide={this.onSlide}
                                />
                                
                            </div>
                            {modalWindowDeleteImage}
                        </div>
                        <div className="profile_publicMessages">Здесь будут записи со стены</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        information: state.userInformation,
        id: state.userId, 
        arrImagesGallery: state.imagesGallery,
        totalSizeImages: state.imagesGalleryTotalSize
    }
}

const mapDispatchToProps = {
    userInformation,
    photoRights,
    imagesForGallery,
    imagesGalleryTotalSize,
    imagesForGalleryUpdate
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(MyPage));