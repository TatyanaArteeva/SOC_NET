import React, {Component} from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './myPage.scss';
import PhotoUser from '../photoUser/photoUser';
import SliderCarusel from '../sliderCarusel/sliderCarusel';
import PostsList from '../postsList/postsList';
import InfoUser from '../infoUser/infoUser';
import {connect} from 'react-redux';


class MyPage extends Component{
    
    render(){
        console.log(this.props.info)

        let postsContent=<div>Вы не друзья! Контент не доступен!</div>;
        if(this.props.info.friendRelationStatus==="SELF" || this.props.info.friendRelationStatus==="FULL"){
            postsContent=<PostsList idForPosts={this.props.idInUrl}  messageOnWallType={"ACCOUNT"}/>
        }
        return(
            <div>
                <div className="profile">
                    <div className="profile_photo"><PhotoUser idForPhoto={this.props.idInUrl}/></div>
                        <div className="profile_information">
                            <InfoUser idForInfo={this.props.idInUrl}/>
                        </div>
                        <div className="profile_photos">
                            <SliderCarusel idForPhotos={this.props.idInUrl}/>
                        </div>
                        <div className="profile_publicMessages">
                            Здесь будут записи со стены
                            {postsContent}
                            {/* <PostsList idForPosts={this.props.idInUrl}  messageOnWallType={"ACCOUNT"}/> */}
                        </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.infoRelation,
    }
}


export default connect(mapStateToProps)(MyPage);
