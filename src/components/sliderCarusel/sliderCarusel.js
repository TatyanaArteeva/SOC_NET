import React, {Component} from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './sliderCarusel.scss';
import {connect} from 'react-redux';
import WithService from '../hoc/hoc';
import { imagesForGallery, imagesGalleryTotalSize, imagesForGalleryLoading, imagesGalleryDeletePhoto} from '../../actions';
let startIndex=0;

class SliderCarusel extends Component{
    constructor(props){
        super(props);
        this.state={
            deleteImageModalWindow: false,
            currentImageIndex: '',
            addImageModalWindow: false,
            userNotificationModalWindowAddImages: false,
            newImage: '',
            newImageName: [],
            imagess: [],
            messageInvalidFile: false,
            uderNotificationModalWindowDeleteImage: false
        }

        const {Service} = this.props;
        let start=0;
        let end=10;
        let arrEnd="";
        let numberIndexToStart="";


        this.getImagesByLoading=()=>{
            Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`, {
                responseType: 'arraybuffer'
                })
                .then(res=>{
                    this.props.imagesGalleryTotalSize(res.data.totalSize)
                    this.props.imagesForGallery(res.data.photos, start, end)
                    arrEnd=this.props.totalSizeImages;
                    numberIndexToStart=arrEnd-10
                    Service.getAccountInfo(`/api/photo/${this.props.id}?start=${numberIndexToStart}&end=${arrEnd}`, {
                    responseType: 'arraybuffer'
                    })
                    .then(res=>{
                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd)
                    })
                })
        }

        this.componentDidMount=()=>{
            this.getImagesByLoading()
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

        this.userNotificationDeleteImageClose=()=>{
            this.setState({
                uderNotificationModalWindowDeleteImage: false
            })
        }

        this.deleteImage=()=>{
            const objDeleteImages=this.props.arrImagesGallery[this.state.currentImageIndex];
            const idDeleteImages=objDeleteImages.id;
            const arrIdDeleteImages=[];
            arrIdDeleteImages.push(idDeleteImages)
            console.log(arrIdDeleteImages);
            Service.postDeleteImagesFromGallery(`/api/photo/${this.props.id}/remove`, arrIdDeleteImages)
                .then(res=>{
                    console.log(res);
                    console.log(this.state.currentImageIndex)
                    if(res.status===200){
                        start=0;
                        end=start+10;
                        Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`)
                            .then(res=>{
                                this.props.imagesGalleryTotalSize(res.data.totalSize)
                                this.props.imagesForGalleryLoading(res.data.photos, start, end)
                                arrEnd=this.props.totalSizeImages;
                                numberIndexToStart=arrEnd-10
                                Service.getAccountInfo(`/api/photo/${this.props.id}?start=${numberIndexToStart}&end=${arrEnd}`, {
                                        responseType: 'arraybuffer'
                                    })
                                    .then(res=>{
                                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd);
                                        this.setState({
                                            uderNotificationModalWindowDeleteImage: true
                                        });
                                        this.cancelDeleteImage()
                                        setTimeout(this.userNotificationDeleteImageClose, 3000)
                                    })
                            })
                    }
                })
        }

        this.addImageModalWindowOpen=()=>{
            this.setState({
                addImageModalWindow: true
            })
        }

        this.modalWindowInvalidFilesClose=()=>{
            this.setState({
                 messageInvalidFile: false
            })
        }

        this.valueAndNameNewImage=(event)=>{
            const files=event.target.value.split(".").pop().toLowerCase();
            const value=event.target.value
            console.log(files, value)
            if(event.target.value.length>0){
                if(files==="jpg" || files==="jpeg" || files==="png"){
                     this.setState({
                        newImage: [...this.state.newImage, event.target.files[0]]
                    })
                    this.setState({
                        newImageName: [...this.state.newImageName, event.target.value]
                    },()=>{
                        event.target.value="";
                    })
                }else{
                     this.setState({
                        newImage: [...this.state.newImage]
                    })
                    this.setState({
                        newImageName: [...this.state.newImageName]
                    },()=>{
                        event.target.value="";
                    })
                    this.setState({
                        messageInvalidFile: true
                    })
                    setTimeout(this.modalWindowInvalidFilesClose, 2000)
                }
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
                            end=10;
                            Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`)
                                .then(res=>{
                                    this.props.imagesGalleryTotalSize(res.data.totalSize)
                                    this.props.imagesForGallery(res.data.photos, start, end)
                                    arrEnd=this.props.totalSizeImages;
                                    numberIndexToStart=arrEnd-10
                                    Service.getAccountInfo(`/api/photo/${this.props.id}?start=${numberIndexToStart}&end=${arrEnd}`, {
                                            responseType: 'arraybuffer'
                                        })
                                        .then(res=>{
                                            this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd)
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
            console.log(index)
            if(index===end-8){
                start=end;

                if(end+10>=this.props.totalSizeImages){
                    end=this.props.totalSizeImages
                }else{
                    end=end+10;
                }

                
                if(end>numberIndexToStart){
                    end=numberIndexToStart;
                }

                if(start===end){
                    return
                }
                console.log(start, end)
                Service.getAccountInfo(`/api/photo/${this.props.id}?start=${start}&end=${end}`, {
                    responseType: 'arraybuffer'
                    })
                    .then(res=>{
                        console.log("вперед")
                        this.props.imagesForGalleryLoading(res.data.photos, start, end)
                    })
            }

            if(index===numberIndexToStart+8){
                arrEnd=numberIndexToStart;
                numberIndexToStart=numberIndexToStart-10;

               
                if(arrEnd<end){
                    return
                }

                if(numberIndexToStart<end){
                    numberIndexToStart=end
                }

                if(numberIndexToStart===arrEnd){
                    return 
                }

                Service.getAccountInfo(`/api/photo/${this.props.id}?start=${numberIndexToStart}&end=${arrEnd}`, {
                    responseType: 'arraybuffer'
                    })
                    .then(res=>{
                        console.log("назад")
                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd)
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

        const messageInvalidFile= <div>
                                        <div>Не верный формат файла!</div>
                                        <div>Допустимые значения: .jpg, .jpeg, .png</div>
                                    </div>

        const modalWindowMessageInvalidFile=this.state.messageInvalidFile ? messageInvalidFile : null;

        const modalWindowFromDeleteImage=<div className="ModalWindowForDeleteImage">
                                            <div>Вы уверены что хотите удалить фото номер {this.state.currentImageIndex+1}?</div>
                                            <div>
                                                <button onClick={this.deleteImage}>Удалить фото</button>
                                                <button onClick={this.cancelDeleteImage}>Отмена</button>
                                            </div>
                                        </div>
        
        const modalWindowDeleteImage=this.state.deleteImageModalWindow ? modalWindowFromDeleteImage : null;

        let listNewImage=null;

        let modalWindowUserNotificationDeleteImage=null;

        if(this.state.uderNotificationModalWindowDeleteImage){
            modalWindowUserNotificationDeleteImage=<div className="ModalWindowForDeleteImage">
                                                        <button onClick={this.userNotificationDeleteImageClose}>Закрыть</button>
                                                        <div>Фото успешно удалено!</div>
                                                    </div>
        }

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
                                        {modalWindowMessageInvalidFile}
                                        {listNewImage}
                                        <div>
                                            <button onClick={this.cancelAddImage}>
                                                Отмена
                                            </button>
                                        </div>
                                      </div>

        const modalWindowAddImage=this.state.addImageModalWindow ? modalWindowFromAddImage : null;
        

        return(
            <div>
                 <div className="profile_photos_wrapper">
                                <button onClick={this.addImageModalWindowOpen}>Добавить фото</button>
                                {modalWindowAddImage}
                                {modalWindowUserNotificationAddImages}
                                <ImageGallery
                                    ref={i => this.imageGallery = i}
                                    items={this.props.arrImagesGallery}
                                    thumbnailPosition="left"
                                    showIndex={true}
                                    onSlide={this.onSlide}
                                    startIndex={startIndex}
                                />
                                
                            </div>
                            {modalWindowDeleteImage}
                            {modalWindowUserNotificationDeleteImage}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        id: state.userId, 
        arrImagesGallery: state.imagesGallery,
        totalSizeImages: state.imagesGalleryTotalSize,
    }
}

const mapDispatchToProps = {
    imagesForGallery,
    imagesGalleryTotalSize,
    imagesForGalleryLoading,
    imagesGalleryDeletePhoto
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(SliderCarusel));