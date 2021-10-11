import React, {useEffect, useState, useRef, useMemo} from 'react';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import 'moment/locale/ru';
import Moment from 'react-moment';
import './postsList.scss';
import SpinnerMini from '../spinnerMini/spinnerMini';
import send from './send.svg';
import { withRouter, useHistory} from "react-router-dom";


let req=false;


const localFormatDateByVersionLibMomentReact='lll'

const PostsList=({Service, currentIdLocation, idForPosts, newPostInput, messageOnWallType, postsLoading})=>{
    const[newPost, setNewPost]=useState('');
    const[loadingPosts, setLoadingPosts]=useState(false);
    const[calcIndex, setCalcIndex]=useState(false);
    const[startDate, setStartDate]=useState('');
    const[postsArr, setPostsArr]=useState('');
    const[totalSizePosts, setTotalSizePosts]=useState();
    const [inputPost, setInputPost]=useState();
    const postListRef=useRef()
    const[start, setStart]=useState(0);
    const [end, setEnd]=useState(10);
    const [spinnerMini, setSpinnerMini]= useState(false);
    const [loading, setLoading]=useState(true);
    const { push } = useHistory();

    function getSimpleAccount(){
        Service.getInformationForInputMessage(`/api/account/simple-account/${newPostInput.sourceId}`)
            .then(res=>{
                if(res.status===200){
                    console.log(res)
                    const newEl={
                        content: newPostInput.content,
                        createDate: newPostInput.createDate,
                        destinationId: newPostInput.destinationId,
                        id: newPostInput.id,
                        messageOnWallType: newPostInput.messageOnWallType,
                        sendDate: newPostInput.sendDate,
                        source:{
                            firstName: res.data.firstName,
                            id: res.data.id,
                            lastName: res.data.lastName,
                            photo: res.data.photo
                        }
                    }
                    setTotalSizePosts(totalSizePosts + 1)
                    setPostsArr([newEl, ...postsArr]);
                }
            })
    }

    useEffect(()=>{
        let cleanupFunction = false;
        if(!cleanupFunction){
            setInputPost(newPostInput);
            if(inputPost!==undefined){
                console.log("запускаем получение аккаунта")
                getSimpleAccount()
            }
        }
        return () => cleanupFunction = true;
    }, [newPostInput])

    useEffect(()=>{
        let cleanupFunction = false;
        if(currentIdLocation.length>0 ){
            const date=new Date().toISOString();
            if(!cleanupFunction){
                setStartDate(date)
            }
            
            const objDataForPosts={
                end: end,
                start: start,
                startLoadTime: date,
                targetId: idForPosts
            }
    
            Service.getAllPosts(`/api/message/getMessagesOnWall`, objDataForPosts)
                       .then(res=>{
                           if(res.status===200){
                            if(!cleanupFunction){
                                setPostsArr(res.data.messages)
                                setTotalSizePosts(res.data.totalSize)
                                setLoading(false);
                            }
                           }
                       }) 
            return () => { cleanupFunction = true;};
        }
    },[currentIdLocation])

    function valuePost(e){
        if(e.target!==undefined){
            setNewPost(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
        }
    }

 
        function postRequest(e){
            e.preventDefault();
            const OneInvalidSymbol = ' ';
    
            const oneCheck = newPost.indexOf(OneInvalidSymbol);
    
            if(newPost.length>0){
                if(oneCheck!==0){
                    const sendDate=new Date().toISOString()
    
                    const outputPost= {
                        content: newPost,
                        destinationId: currentIdLocation,
                        messageOnWallType: messageOnWallType,
                        sendDate: sendDate,
                        sourceId: localStorage.getItem('idUser')
                    }

                    console.log(outputPost)

                    Service.postMessage('/api/message/sendMessageOnWall', outputPost)
                        .then(res=>{
                            if(res.status===200){
                                setNewPost('')
                            }
                        })
                }
            }
        }

        function keyPressEnter(e){
            if(e.key==='Enter'){
                postRequest(e)
            }
        }

        function keyDown(e){
            if(e.key==='Enter' && e.ctrlKey===true){
                console.log("ok")
                setNewPost(newPost + "\r\n")
            }
        }

        const windowHeight=document.documentElement.clientHeight;

        useEffect(()=>{
            let cleanupFunction = false;
            if(loadingPosts){
                setSpinnerMini(true)
                const objDataForPosts={
                    end: end,
                    start: start,
                    startLoadTime: startDate,
                    targetId: idForPosts
                }   
                const inf=async ()=>{
                    try{
                        const res=await Service.getAllPosts(`/api/message/getMessagesOnWall`, objDataForPosts);
                        console.log(res)
                        if(!cleanupFunction){
                            setSpinnerMini(false)
                            setPostsArr([...postsArr , ...res.data.messages])
                            setTotalSizePosts(res.data.totalSize)
                            req=false;
                            setLoadingPosts(false)
                        }
                    }catch(e){
                        console.log(e)
                    }
                }
                inf()
            }
            return () => cleanupFunction = true;
        },[loadingPosts, start, end])

        useEffect(()=>{
            
            if(calcIndex){
                if(start+10===totalSizePosts){
                    console.log(start)
                    return
                }else if(start+10>totalSizePosts){
                    console.log(start)
                    return
                } else if(end+10>totalSizePosts){
                    console.log(end)
                    setStart(end)
                    setEnd(totalSizePosts)
                    req=true;
                    setLoadingPosts(true)
                    setCalcIndex(false)
                } else{
                    setStart(end)
                    setEnd(end+10)
                    req=true
                    setLoadingPosts(true)
                    setCalcIndex(false)
                }
            }
        },[req, start, end, calcIndex])

        


        window.addEventListener("scroll", ()=>{
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if(postListRef.current!==null && postListRef.current!==undefined){
                let heghtList=postListRef.current.scrollHeight;
                let heghtListOffsetTop=postListRef.current.offsetTop
                if((scrollTop+windowHeight - heghtListOffsetTop)>=(heghtList/100*80) && req===false && totalSizePosts!==undefined){
                    console.log("calc=true")
                    setCalcIndex(true)
                }
            }
        })


        let postContent=null;

        function goToPageUser(id){
            console.log(id)
            push({
                pathname: `/${id}`
            });
        }

    

        postContent=useMemo(()=>{
            let posts=null;
            if(totalSizePosts===0 && typeof postsArr!=="string"){
                posts=<div className="public-messages__null">Пока нет новостей</div>
                return posts
            }
    
            if(totalSizePosts>0 && typeof postsArr!=="string"){
                posts= postsArr.map((post, index)=>{
                    const dateMilliseconds=new Date(post.sendDate).getTime();
                    const timeZone=new Date(post.sendDate).getTimezoneOffset()*60*1000;
                    const currentDateMilliseconds=dateMilliseconds-(timeZone);
                    const currentDate=new Date(currentDateMilliseconds);
    
                    const newFormatPhoto="data:image/jpg;base64," + post.source.photo;
                    
                    return <li key={post.id} className="public-messages__item">
                                <div className="public-messages__item__img" onClick={()=>goToPageUser(post.source.id)}>
                                        <img src={newFormatPhoto} alt="userPhoto"/>
                                </div>
                                <div className="public-messages__item__content">
                                    <div className="public-messages__item__content__info">
                                        <div className="public-messages__item__content__info_name"  onClick={()=>goToPageUser(post.source.id)}>
                                            {post.source.firstName} {post.source.lastName}
                                        </div>
                                    </div>
                                    <div className="public-messages__item__content__message">
                                        {post.content}
                                    </div>
                                </div>
                                <div className="public-messages__item__content__info_time">
                                    <div>
                                        <Moment locale="ru"
                                                date={currentDate}
                                                format={localFormatDateByVersionLibMomentReact}
                                                                
                                        />
                                    </div>
                                </div>
                            </li>
                })
                return posts
            }
            
        }, [totalSizePosts, postsArr])

        const miniSpinner=spinnerMini ? <SpinnerMini/> : null;

        const messages=  <ul ref={postListRef} className="public-messages__list">
                                <div className="public-messages__total-size">
                                    Всего новостей: <span>{totalSizePosts}</span>
                                </div>
                                {
                                    postContent
                                }
                                {miniSpinner}
                            </ul>
                        

        let content= loading? <SpinnerMini/> : messages;

        return(
          <div className="public-messages">
            <form 
                onKeyPress={keyPressEnter}
                onKeyDown={keyDown}
                className="public-messages__wrapper"
                >
                <textarea type="text" 
                    placeholder="Какие новости?" 
                    value={newPost}
                    required
                    onChange={valuePost}
                    className="public-messages__input"
                />
                <div className="public-messages__send" onClick={postRequest} >
                <img src={send} alt="send"/>
                </div>
            </form>
            {content}
          </div>
        )
    
}

const mapStateToProps = (state) => {
    return {
        currentIdLocation: state.currentIdLocation,
        newPostInput: state.newPost,
        accessesToPosts: state.accessesToPosts
    }
}


export default withRouter(WithService()(connect(mapStateToProps)(PostsList)));