import React, { Component } from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import PhotoUser from '../photoUser/photoUser';
import SliderCarusel from '../sliderCarusel/sliderCarusel';
import PostsList from '../postsList/postsList';
import InfoUser from '../infoUser/infoUser';
import { connect } from 'react-redux';
import Spinner from '../spinner/spinner';
import eyeClose from './eyeClose.svg';

class MyPage extends Component {
    render() {

        let postsContent = null;
        let spinner = null;

        const { info, idInUrl, loadingInfoProfile, loadingPhotoProfile } = this.props;

        if (info.friendRelationStatus === "SELF" || info.friendRelationStatus === "FULL") {
            postsContent = <PostsList idForPosts={idInUrl}
                messageOnWallType={"ACCOUNT"}
            />
        }

        if ((info.friendRelationStatus === "NO_RELATION" && info.friendRelationStatus !== undefined) ||
            (info.friendRelationStatus === "INPUT" && info.friendRelationStatus !== undefined) ||
            (info.friendRelationStatus === "OUTPUT" && info.friendRelationStatus !== undefined)) {
            postsContent = <div className="profile__information__public-messages_not-access">
                <img src={eyeClose} alt="contentNotAccess" />
            </div>;
        }

        if (!loadingInfoProfile && !loadingPhotoProfile) {
            spinner = <Spinner />

        }

        return (
            <div className="profile">
                <div className="profile__photo">
                    <PhotoUser idForPhoto={idInUrl} />
                </div>
                <div className="profile__information">
                    <div className="profile__information__data">
                        <InfoUser idForInfo={idInUrl} />
                    </div>
                    <div className="profile__information__photos">
                        <SliderCarusel idForPhotos={idInUrl} />
                    </div>
                    <div className="profile__information__public-messages">
                        {postsContent}
                    </div>
                </div>
                {spinner}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoRelation,
        loadingInfoProfile: state.loadingInfoProfile,
        loadingPhotoProfile: state.loadingPhotoProfile
    }
}

export default connect(mapStateToProps)(MyPage)
