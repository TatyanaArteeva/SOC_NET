import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './sliderCarusel.scss';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import {
    imagesForGallery,
    imagesGalleryTotalSize,
    imagesForGalleryLoading,
    imagesGalleryDeletePhoto,
    checkingForAuthorization,
    unsubscribe
} from '../../actions';
import { withRouter } from "react-router";
import SpinnerMini from '../spinnerMini/spinnerMini';
import SpinnerMiniMini from '../spinnerMiniMini/spinnerMiniMini';
import cancel from './cancel.svg';
import download from './download.svg';
import remove from './delete.svg';
import noPhotos from './no-photos.svg';
import errorMessageForUser from '../errorMessagesForUser/errorMessagesForUser';
let startIndex = 0;


class SliderCarusel extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            deleteImageModalWindow: false,
            currentImageIndex: '',
            addImageModalWindow: false,
            newImage: '',
            newImageName: [],
            images: [],
            messageInvalidFile: false,
            deleteImageSuccessfully: false,
            addImageSuccessfully: false,
            spinner: true,
            indicatorofBeingInModalWindow: false,
            errorActionsSavePhotos: false,
            errorActionsMessageSavePhotos: '',
            blockedBtnAddPhotos: false,
            blockedBtnRemovePhotos: false
        }

        let markingCloseModalWindowFromDeleteImage = false;
        let markingCloseModalWindowFromAddImage = false;

        const { Service } = this.props;

        let start = 0;
        let end = 10;
        let arrEnd = "";
        let numberIndexToStart = "";

        this.getImagesByLoading = () => {
            Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${start}&end=${end}`, {
                responseType: 'arraybuffer'
            })
                .then(res => {
                    if (this._cleanupFunction) {
                        this.props.imagesGalleryTotalSize(res.data.totalSize)
                        this.props.imagesForGallery(res.data.photos, start, end)
                        this.setState({
                            spinner: false
                        })
                        this.setState({
                            images: this.props.arrImagesGallery
                        })
                    }
                    arrEnd = this.props.totalSizeImages;
                    numberIndexToStart = arrEnd - 10
                    if (numberIndexToStart < 0) {
                        return
                    }
                    Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${numberIndexToStart}&end=${arrEnd}`, {
                        responseType: 'arraybuffer'
                    })
                        .then(res => {
                            if (this._cleanupFunction) {
                                this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd)
                                this.setState({
                                    spinner: false
                                })
                                this.setState({
                                    images: this.props.arrImagesGallery
                                })
                            }
                        }).catch(err => {
                            if (err.response.status === 401) {
                                unsubscribe()
                                checkingForAuthorization();
                            }
                        })
                }).catch(err => {
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            this.getImagesByLoading()
        }

        this.componentDidUpdate = (prevProps) => {
            if (prevProps.idForPhotos !== this.props.match.params.id) {
                start = 0;
                end = 10;
                this.getImagesByLoading()
            }
            if (prevProps.arrImagesGallery.length !== this.props.arrImagesGallery.length) {
                this.setState({
                    images: this.props.arrImagesGallery
                })
            }
        }

        this.componentWillUnmount = () => {
            this._cleanupFunction = false
        }

        this.deleteImageModalWindowOpen = () => {
            const imageIndex = this.imageGallery.getCurrentIndex();
            this.setState({
                deleteImageModalWindow: true,
                currentImageIndex: imageIndex
            })
            if (document.body.style.overflow !== "hidden") {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "scroll";
            }
        }

        this.cancelDeleteImage = () => {
            this.setState({
                deleteImageModalWindow: false
            })
            if (document.body.style.overflow !== "hidden") {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "scroll";
            }
        }

        this.userNotificationDeleteImageClose = () => {
            this.setState({
                uderNotificationModalWindowDeleteImage: false
            })
        }

        this.closeModalWindowFromDeleteImageSuccessfully = () => {
            markingCloseModalWindowFromDeleteImage = true;
            this.setState({
                deleteImageSuccessfully: false
            })
            markingCloseModalWindowFromDeleteImage = false;
        }

        this.deleteImage = () => {
            const objDeleteImages = this.props.arrImagesGallery[this.state.currentImageIndex];
            const idDeleteImages = objDeleteImages.id;
            const arrIdDeleteImages = [];
            arrIdDeleteImages.push(idDeleteImages)
            this.setState({
                blockedBtnRemovePhotos: true
            })
            Service.postDeleteImagesFromGallery(`/api/photo/${this.props.idForPhotos}/remove`, arrIdDeleteImages)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            deleteImageSuccessfully: true,
                            deleteImageModalWindow: false,
                            blockedBtnRemovePhotos: false
                        })
                        if (markingCloseModalWindowFromDeleteImage === false) {
                            setTimeout(this.closeModalWindowFromDeleteImageSuccessfully, 1000)
                            if (document.body.style.overflow !== "hidden") {
                                document.body.style.overflow = "hidden";
                            } else {
                                document.body.style.overflow = "scroll";
                            }
                        }
                        start = 0;
                        end = start + 10;
                        Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${start}&end=${end}`)
                            .then(res => {
                                if (res.data.photos.length <= end) {
                                    end = res.data.photos.length
                                }
                                this.props.imagesGalleryTotalSize(res.data.totalSize)
                                this.props.imagesForGalleryLoading(res.data.photos, start, end)
                                this.setState({
                                    images: this.props.arrImagesGallery
                                })
                                arrEnd = this.props.totalSizeImages;
                                numberIndexToStart = arrEnd - 10
                                if (numberIndexToStart < 0) {
                                    return
                                }
                                Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${numberIndexToStart}&end=${arrEnd}`, {
                                    responseType: 'arraybuffer'
                                })
                                    .then(res => {
                                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd);
                                        this.setState({
                                            images: this.props.arrImagesGallery
                                        })
                                    }).catch(err => {
                                        if (err.response.status === 401) {
                                            this.props.unsubscribe()
                                            this.props.checkingForAuthorization();
                                        }
                                    })
                            })
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.setState({
                            blockedBtnRemovePhotos: false
                        })
                        this.props.unsubscribe()
                        this.props.checkingForAuthorization();
                    }
                })
        }

        this.addImageModalWindowOpen = () => {
            this.setState({
                addImageModalWindow: true
            })
            if (document.body.style.overflow !== "hidden") {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "scroll";
            }
        }

        this.modalWindowInvalidFilesClose = () => {
            this.setState({
                messageInvalidFile: false
            })
        }

        this.valueAndNameNewImage = (event) => {
            const files = event.target.value.split(".").pop().toLowerCase();
            const value = event.target.value
            if (value.length > 0) {
                if (files === "jpg" || files === "jpeg" || files === "png") {
                    this.setState({
                        newImage: [...this.state.newImage, event.target.files[0]]
                    })
                    const valueNamePhoto = event.target.value.split("\\");
                    this.setState({
                        newImageName: [...this.state.newImageName, valueNamePhoto[valueNamePhoto.length - 1]]
                    }, () => {
                        event.target.value = "";
                    })
                } else {
                    this.setState({
                        newImage: [...this.state.newImage]
                    })
                    this.setState({
                        newImageName: [...this.state.newImageName]
                    }, () => {
                        event.target.value = "";
                    })
                    this.setState({
                        messageInvalidFile: true
                    })
                    setTimeout(this.modalWindowInvalidFilesClose, 2000)
                }
            }
        }

        this.cancelAddImage = () => {
            this.setState({
                addImageModalWindow: false
            })
            if (document.body.style.overflow !== "hidden") {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "scroll";
            }
            if (this.state.newImage.length > 0 && this.state.newImageName.length > 0) {
                this.setState({
                    newImage: [],
                    newImageName: []
                })
            }
        }

        this.deleteNewImageFromList = (index) => {
            this.setState(({ newImage, newImageName }) => {
                const beforeImage = newImage.slice(0, index);
                const afterImage = newImage.slice(index + 1);
                const newListNewImage = [...beforeImage, ...afterImage];
                const beforeImageName = newImageName.slice(0, index);
                const afterImageName = newImageName.slice(index + 1);
                const newListNewImageName = [...beforeImageName, ...afterImageName];
                return {
                    newImage: newListNewImage,
                    newImageName: newListNewImageName
                }
            })
        }

        this.closeModalWindowFromAddImageSuccessfully = () => {
            markingCloseModalWindowFromAddImage = true;
            this.setState({
                addImageSuccessfully: false
            })
            markingCloseModalWindowFromAddImage = false;
            if (document.body.style.overflow !== "hidden") {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "scroll";
            }
        }

        this.postNewImages = (event) => {
            event.preventDefault();
            const formData = new FormData();
            for (let i = 0; i < this.state.newImage.length; i++) {
                formData.append("photos", this.state.newImage[i])
            }
            this.setState({
                blockedBtnAddPhotos: true
            })
            Service.postNewPhotoProfile(`/api/photo/${this.props.idForPhotos}/add`, formData)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            addImageModalWindow: false,
                            addImageSuccessfully: true,
                            newImage: [],
                            newImageName: [],
                            blockedBtnAddPhotos: false
                        })
                        if (markingCloseModalWindowFromAddImage === false) {
                            setTimeout(this.closeModalWindowFromAddImageSuccessfully, 1000)
                        }
                        start = 0;
                        end = 10;
                        Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${start}&end=${end}`)
                            .then(res => {
                                if (res.data.photos.length <= end) {
                                    end = res.data.photos.length
                                }
                                this.props.imagesGalleryTotalSize(res.data.totalSize)
                                this.props.imagesForGallery(res.data.photos, start, end)
                                this.setState({
                                    images: this.props.arrImagesGallery
                                })
                                arrEnd = this.props.totalSizeImages;
                                numberIndexToStart = arrEnd - 10;
                                if (numberIndexToStart < 0) {
                                    return
                                }
                                Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${numberIndexToStart}&end=${arrEnd}`, {
                                    responseType: 'arraybuffer'
                                })
                                    .then(res => {
                                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd);
                                        this.setState({
                                            images: this.props.arrImagesGallery
                                        })
                                    }).catch(err => {
                                        if (err.response.status === 401) {
                                            this.props.unsubscribe()
                                            this.props.checkingForAuthorization();
                                        }
                                    })
                            }).catch(err => {
                                if (err.response.status === 401) {
                                    this.props.unsubscribe()
                                    this.props.checkingForAuthorization();
                                }
                            })
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.setState({
                            blockedBtnAddPhotos: false
                        })
                        this.props.unsubscribe()
                        this.props.checkingForAuthorization();

                    } else {
                        const error = errorMessageForUser(err.response.data.code);
                        this.setState({
                            errorActionsSavePhotos: true,
                            errorActionsMessageSavePhotos: error,
                            blockedBtnAddPhotos: false
                        })
                        setTimeout(this.closeErrorSaveNewPhotos, 2000)
                    }
                })
        }

        this.closeErrorSaveNewPhotos = () => {
            this.setState({
                errorActionsSavePhotos: false,
                errorActionsMessageSavePhotos: ''
            })
        }

        this.onSlide = (index) => {
            if (index === end - 8) {
                start = end;
                if (start >= this.props.totalSizeImages) {
                    return
                }
                if (end + 10 >= this.props.totalSizeImages) {
                    end = this.props.totalSizeImages
                } else {
                    end = end + 10;
                }
                if (end > numberIndexToStart) {
                    end = numberIndexToStart;
                }
                Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${start}&end=${end}`, {
                    responseType: 'arraybuffer'
                })
                    .then(res => {
                        this.props.imagesForGalleryLoading(res.data.photos, start, end)
                        this.setState({
                            images: this.props.arrImagesGallery
                        })
                    }).catch(err => {
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
            if (index === numberIndexToStart + 8) {
                arrEnd = numberIndexToStart;
                numberIndexToStart = numberIndexToStart - 10;
                if (arrEnd < end) {
                    return
                }
                if (numberIndexToStart < end) {
                    numberIndexToStart = end
                }
                if (numberIndexToStart === arrEnd) {
                    return
                }
                Service.getAccountInfo(`/api/photo/${this.props.idForPhotos}?start=${numberIndexToStart}&end=${arrEnd}`, {
                    responseType: 'arraybuffer'
                })
                    .then(res => {
                        this.props.imagesForGalleryLoading(res.data.photos, numberIndexToStart, arrEnd)
                        this.setState({
                            images: this.props.arrImagesGallery
                        })
                    }).catch(err => {
                        if (err.response.status === 401) {
                            unsubscribe()
                            checkingForAuthorization();
                        }
                    })
            }
        }

        this.closeModalWindowDeleteImage = () => {
            if (!this.state.indicatorofBeingInModalWindow) {
                this.cancelDeleteImage();
            }
        }

        this.closeModalWindowFromDeleteImageSuccessfullyByOverlay = () => {
            if (!this.state.indicatorofBeingInModalWindow) {
                this.closeModalWindowFromDeleteImageSuccessfully()
            }
        }

        this.closeModalWindowFromAddImageByOverlay = () => {
            if (!this.state.indicatorofBeingInModalWindow) {
                this.cancelAddImage()
            }
        }

        this.closeModalWindowFromAddImageSuccessfullyByOverlay = () => {
            if (!this.state.indicatorofBeingInModalWindow) {
                this.closeModalWindowFromAddImageSuccessfully()
            }
        }

        this.exitFromBlock = () => {
            this.setState({
                indicatorofBeingInModalWindow: false
            })
        }

        this.enteredInBlock = () => {
            this.setState({
                indicatorofBeingInModalWindow: true
            })
        }
    }

    render() {

        let btnAddPhoto = null;
        let btnRemovePhoto = null;
        let gallerySlider = null;
        let listNewImage = null;
        let errorSaveNewPhotos = null;
        let blockBtnAddPhotos = <button onClick={this.postNewImages}
            className="profile-photos__modal__actions-image__btn__item">
            Загрузить фото
        </button>
        let blockBtnRemovePhotos = <button onClick={this.deleteImage}
            className="profile-photos__modal__actions-image__btns__item">
            Удалить фото
        </button>

        const { listRights, arrImagesGallery } = this.props;

        const {
            spinner,
            images,
            messageInvalidFile,
            deleteImageSuccessfully,
            addImageSuccessfully,
            newImageName,
            newImage,
            deleteImageModalWindow,
            addImageModalWindow,
            blockedBtnAddPhotos,
            blockedBtnRemovePhotos,
            errorActionsSavePhotos
        } = this.state;

        if (blockedBtnAddPhotos) {
            blockBtnAddPhotos = <button className="profile-photos__modal__actions-image__btn__item">
                <SpinnerMiniMini />
            </button>
        }

        if (errorActionsSavePhotos) {
            errorSaveNewPhotos = <div className="profile-photos__modal__actions-image__invalid-file">
                <div className="profile-photos__modal__actions-image__invalid-file__text">
                    {this.state.errorActionsMessageSavePhotos}
                </div>
            </div>
        }

        if (blockedBtnRemovePhotos) {
            blockBtnRemovePhotos = <button className="profile-photos__modal__actions-image__btns__item">
                <SpinnerMiniMini/>
            </button>
        }

        if (listRights.canModify) {
            btnAddPhoto = <button onClick={this.addImageModalWindowOpen}
                className="profile-photos__btns__add-photo">
                Добавить фото
            </button>;
        }

        if (arrImagesGallery.length > 0 && listRights.canModify) {
            btnRemovePhoto = <button onClick={this.deleteImageModalWindowOpen}
                className="profile-photos__btns__remove-photo">
                Удалить фото
            </button>
        }

        if (arrImagesGallery.length === 0 && !spinner) {
            gallerySlider = <div className="profile-photos__null">
                <img src={noPhotos} alt="no-photos" />
            </div>
        }

        if (arrImagesGallery.length > 0 && !spinner) {
            gallerySlider = <ImageGallery
                ref={i => this.imageGallery = i}
                items={images}
                thumbnailPosition="left"
                showIndex={true}
                onSlide={this.onSlide}
                startIndex={startIndex}
            />
        }

        const messageInvalidFileBlock = <div className="profile-photos__modal__actions-image__invalid-file">
            <div className="profile-photos__modal__actions-image__invalid-file__text">
                Не верный формат! Разрешены: .jpg, .jpeg, .png
            </div>
        </div>

        const modalWindowMessageInvalidFile = messageInvalidFile ?
            messageInvalidFileBlock : <div className="profile-photos__modal__actions-image__invalid-file"></div>;

        const modalWindowFromDeleteImageSuccessfully = <div className="profile-photos__modal__actions-image"
            onClick={this.closeModalWindowFromDeleteImageSuccessfullyByOverlay}>
            <div className="profile-photos__modal__actions-image__window"
                onMouseLeave={this.exitFromBlock}
                onMouseEnter={this.enteredInBlock}>
                <div onClick={this.closeModalWindowFromDeleteImageSuccessfully}
                    className="profile-photos__modal__actions-image__window__cancel">
                    <img src={cancel} alt="cancel" />
                </div>
                <div className="profile-photos__modal__actions-image__text_final">
                    Фото успешно удалено!
                </div>
            </div>
        </div>

        const modalWindowDeleteImageSuccessfully = deleteImageSuccessfully ?
            modalWindowFromDeleteImageSuccessfully : null;

        const modalWindowFromAddImageSuccessfully = <div className="profile-photos__modal__actions-image"
            onClick={this.closeModalWindowFromAddImageSuccessfullyByOverlay}>
            <div className="profile-photos__modal__actions-image__window"
                onMouseLeave={this.exitFromBlock}
                onMouseEnter={this.enteredInBlock}>
                <div onClick={this.closeModalWindowFromAddImageSuccessfully}
                    className="profile-photos__modal__actions-image__window__cancel">
                    <img src={cancel} alt="cancel" />
                </div>
                <div className="profile-photos__modal__actions-image__text_final">
                    Фото успешно добавлено
                </div>
            </div>
        </div>

        const modalWindowAddImageSuccessfully = addImageSuccessfully ?
            modalWindowFromAddImageSuccessfully : null;

        if (newImageName.length > 0 &&
            newImageName !== undefined &&
            newImage.length > 0 &&
            newImage !== undefined) {
            listNewImage = <div>
                <div className="profile-photos__modal__actions-image__text">
                    Вы выбрали файлы:
                </div>
                <ul>
                    {
                        newImageName.map((el, index) => {
                            return (
                                <li key={index}
                                    className="profile-photos__modal__actions-image__window__wrapper__input-file__item">
                                    <span>{el}</span>
                                    <img onClick={() => this.deleteNewImageFromList(index)}
                                        src={remove}
                                        alt="delete"
                                    />
                                </li>
                            )
                        })
                    }
                </ul>

                <div className="profile-photos__modal__actions-image__btn">
                    {blockBtnAddPhotos}
                </div>
                {errorSaveNewPhotos}
            </div>
        }

        let inputPhoto = <div className="profile-photos__modal__actions-image__window__wrapper__input-file">
            <form>
                <input name="photos"
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={this.valueAndNameNewImage}
                    className="profile-photos__modal__actions-image__window__input-file__input"
                    id="inputFiles"
                />
                <label htmlFor="inputFiles"
                    className="profile-photos__modal__actions-image__window__wrapper__input-file__label">
                    <span className="profile-photos__modal__actions-image__window__wrapper__input-file__label_img">
                        <img src={download} alt="inputFile" />
                    </span>
                    <div className="profile-photos__modal__actions-image__window__wrapper__input-file__label_border"></div>
                    <span className="profile-photos__modal__actions-image__window__wrapper__input-file__label_name">
                        Выберите файл
                    </span>
                </label>
            </form>
        </div>

        if (this.state.newImage.length >= 5) {
            inputPhoto = <div className="profile-photos__modal__actions-image__text_warninig">
                За один раз возможно загрузить не больше 5 фото!
            </div>
        }

        const modalWindowFromAddImage = <div className="profile-photos__modal__actions-image"
            onClick={this.closeModalWindowFromAddImageByOverlay}>
            <div className="profile-photos__modal__actions-image__window"
                onMouseLeave={this.exitFromBlock}
                onMouseEnter={this.enteredInBlock}>
                <div className="profile-photos__modal__actions-image__window__cancel"
                    onClick={this.cancelAddImage}>
                    <img src={cancel} alt="cancel" />
                </div>
                <div className="profile-photos__modal__actions-image__text_final">
                    Добавьте фото для загрузки!
                </div>
                {inputPhoto}
                {modalWindowMessageInvalidFile}
                {listNewImage}
            </div>
        </div>

        let modalWindowFromDeleteImage = <div className="profile-photos__modal__actions-image"
            onClick={this.closeModalWindowDeleteImage}>
            <div className="profile-photos__modal__actions-image__window"
                onMouseLeave={this.exitFromBlock}
                onMouseEnter={this.enteredInBlock}>
                <div className="profile-photos__modal__actions-image__text">
                    Вы уверены что хотите удалить данное фото?
                </div>
                <div className="profile-photos__modal__actions-image__btns">
                    {blockBtnRemovePhotos}
                    <button onClick={this.cancelDeleteImage}
                        className="profile-photos__modal__actions-image__btns__item">
                        Отмена
                    </button>
                </div>
            </div>
        </div>

        const modalWindowDeleteImage = deleteImageModalWindow ? modalWindowFromDeleteImage : null;

        const modalWindowAddImage = addImageModalWindow ? modalWindowFromAddImage : null;

        const content = spinner ?
            <div className="profile-photos__spinner-wrapper">
                <SpinnerMini />
            </div> : <>
                <div className="profile-photos">
                    {btnAddPhoto}
                    {btnRemovePhoto}
                    <div className="profile-photos__wrapper">
                        {modalWindowDeleteImageSuccessfully}
                        {modalWindowDeleteImage}
                        {modalWindowAddImage}
                        {modalWindowAddImageSuccessfully}
                        {gallerySlider}
                    </div>
                </div>
            </>

        return (
            <>
                {content}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userId,
        arrImagesGallery: state.imagesGallery,
        totalSizeImages: state.imagesGalleryTotalSize,
        listRights: state.listRights,
    }
}

const mapDispatchToProps = {
    imagesForGallery,
    imagesGalleryTotalSize,
    imagesForGalleryLoading,
    imagesGalleryDeletePhoto,
    checkingForAuthorization,
    unsubscribe
}

export default WithService()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SliderCarusel)))