import React from 'react';
import './photoUser.scss';
import photoUser from './default_photo_user.png';

const PhotoUser=()=>{
    return(
        <>
            <div className="photo"><img className="photoUser" src={photoUser} alt="photoUser"/></div>
            <button className="add_photo">изменить фото</button>
        </>
    )
}

export default PhotoUser;