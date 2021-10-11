import React, {Component} from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import PhotoUser from '../photoUser/photoUser';
import SliderCarusel from '../sliderCarusel/sliderCarusel';
import PostsList from '../postsList/postsList';
import InfoUser from '../infoUser/infoUser';
import {connect} from 'react-redux';
import Spinner from '../spinner/spinner';


class MyPage extends Component{
    render(){
        let postsContent=null;
        if(this.props.info.friendRelationStatus==="SELF" || this.props.info.friendRelationStatus==="FULL"){
            postsContent=<PostsList idForPosts={this.props.idInUrl}  messageOnWallType={"ACCOUNT"}/>
        }
        if((this.props.info.friendRelationStatus==="NO_RELATION" && this.props.info.friendRelationStatus!==undefined) || (this.props.info.friendRelationStatus==="INPUT" && this.props.info.friendRelationStatus!==undefined) || (this.props.info.friendRelationStatus==="OUTPUT" && this.props.info.friendRelationStatus!==undefined)){
            console.log("зашли");
            postsContent=<div className="profile__information__public-messages_not-access">Новости не доступны!</div>;
        }

        let spinner=null;
        if(!this.props.loadingInfoProfile && !this.props.loadingPhotoProfile){
            spinner=<Spinner/>
                    
        }
        return(
                <div className="profile">
                    <div className="profile__photo">
                        <PhotoUser idForPhoto={this.props.idInUrl}/>
                    </div>
                    <div className="profile__information">
                        <div className="profile__information__data">
                            <InfoUser idForInfo={this.props.idInUrl}/>
                        </div>
                        <div className="profile__information__photos">
                            <SliderCarusel idForPhotos={this.props.idInUrl}/>
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


export default connect(mapStateToProps)(MyPage);
