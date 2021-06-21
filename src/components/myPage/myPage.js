import React, {Component, createElement} from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import {Link, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import DetailedInformationBlock from '../detailedInformationBlock/detailedInformationBlock';
import WithService from '../hoc/hoc';
import { userInformation, photoRights} from '../../actions';
import PhotoUser from '../photoUser/photoUser';
import one from './one.jpg';
import two from './two.jpg';
import three from './three.jpg';
import four from './four.jpg';
import five from './five.jpg';
import six from './six.jpg';
import ImageGallery from 'react-image-gallery';

const images = [
    {
      original: one,
      thumbnail: one,
      thumbnailHeight: 100,
      thumbnailWidth: 100,
      id:1
    },
    {
        original: two,
        thumbnail: two,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:2
    },
    {
        original: three,
        thumbnail: three,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:3
    },
    {
        original: four,
        thumbnail: four,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:4
    },
    {
        original: five,
        thumbnail: five,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:5
    },
    {
        original: six,
        thumbnail: six,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:6
    },
    {
        original: three,
        thumbnail: three,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:7
    },
    {
        original: four,
        thumbnail: four,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        id:8
    },
    

  ];

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
            newImage: [],
            newImageName: []
        }
        const {Service} = this.props;
        
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
                .then(res=>this.props.photoRights(res.data.accesses))
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
            console.log(imageId)
        }

        this.addImageModalWindowOpen=()=>{
            this.setState({
                addImageModalWindow: true
            })
        }

        this.valueAndNameNewImage=(event)=>{
            this.setState({
                newImage: [...this.state.newImage, ...event.target.files]
            })
            if(event.target.value.length>0){
                this.setState({
                    newImageName: [...this.state.newImageName ,event.target.value]
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
    }

    
    render(){
        console.log(this.state.newImage, this.state.newImageName)
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
                                <button>Загрузить фото</button>
                        </div>
        }

        const modalWindowFromAddImage=<div className="ModalWindowForDeleteImage">
                                        Пожалуйста, добавьте фото для загрузки!
                                        <input  name="image" 
                                                type="file" 
                                                accept="image/jpeg,image/png" 
                                                multiple
                                                onChange={this.valueAndNameNewImage}
                                                />
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
                                <ImageGallery
                                    ref={i => this.imageGallery = i}
                                    items={images}
                                    thumbnailPosition="left"
                                    showIndex={true}
                                    disableSwipe={true}
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
    }
}

const mapDispatchToProps = {
    userInformation,
    photoRights
}

export default WithService()(connect(mapStateToProps, mapDispatchToProps)(MyPage));