
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import { connect } from 'react-redux';
import WithService from '../hoc/hoc';
import 'moment/locale/ru';
import Moment from 'react-moment';
import './postsList.scss';

let req=false;


const localFormatDateByVersionLibMomentReact='lll'

const PostsList=({Service, currentIdLocation, idForPosts, newPostInput, messageOnWallType, info, groupInfoRelation, accessesToPosts})=>{
    console.log(accessesToPosts);
    // console.log(groupInfoRelation)
    const[newPost, setNewPost]=useState();
    const[loadingPosts, setLoadingPosts]=useState(false);
    const[calcIndex, setCalcIndex]=useState(false);
    const[startDate, setStartDate]=useState('');
    const[postsArr, setPostsArr]=useState([]);
    const[totalSizePosts, setTotalSizePosts]=useState();
    const [inputPost, setInputPost]=useState();
    const postListRef=useRef()
    const[start, setStart]=useState(0);
    const [end, setEnd]=useState(10);
    
    function getSimpleAccount(){
        console.log(inputPost)
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
                    setPostsArr([newEl, ...postsArr])

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

    // const getPosts=useCallback(()=>{
    //     console.log("el")
    //     let cleanupFunction = false;
    //     const date=new Date().toISOString();
    //     if(!cleanupFunction){
    //         setStartDate(date)
    //     }
        
    //     const objDataForPosts={
    //         end: end,
    //         start: start,
    //         startLoadTime: date,
    //         targetId: idForPosts
    //     }

    //     Service.getAllPosts(`/api/message/getMessagesOnWall`, objDataForPosts)
    //                .then(res=>{
    //                    if(res.status===200){
    //                     console.log("info")
    //                     if(!cleanupFunction){
    //                         setPostsArr(res.data.messages)
    //                         setTotalSizePosts(res.data.totalSize)
    //                     }
    //                    }
    //                }) 
    //     return () => { cleanupFunction = true;};
    // },[Service, startDate, getPosts])

    useEffect(()=>{
        let cleanupFunction = false;
        console.log('loading')
        if(currentIdLocation.length>0 ){
            // getPosts()
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
                            console.log("info")
                            if(!cleanupFunction){
                                setPostsArr(res.data.messages)
                                setTotalSizePosts(res.data.totalSize)
                            }
                           }
                       }) 
            return () => { cleanupFunction = true;};
        }
    },[currentIdLocation])

    function valuePost(e){
        setNewPost(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
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

        const windowHeight=document.documentElement.clientHeight;

        useEffect(()=>{
            let cleanupFunction = false;
            console.log("aaaa", req, start, end)
            if(loadingPosts){
                console.log("запрос", start, end)
                const objDataForPosts={
                    end: end,
                    start: start,
                    startLoadTime: startDate,
                    targetId: idForPosts
                }   
                console.log("вызываем функцию")
                const inf=async ()=>{
                    try{
                        const res=await Service.getAllPosts(`/api/message/getMessagesOnWall`, objDataForPosts);
                        console.log(res)
                        if(!cleanupFunction){
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


        let postContent=null

        postContent=useMemo(()=>{
            let posts=null;
            if(totalSizePosts===0){
                posts=<div>У вас пока нет записей на стене!</div>
                return posts
            }
    
            if(totalSizePosts>0){
                posts= postsArr.map((post, index)=>{
                    console.log("el")
                    const dateMilliseconds=new Date(post.sendDate).getTime();
                    const timeZone=new Date(post.sendDate).getTimezoneOffset()*60*1000;
                    const currentDateMilliseconds=dateMilliseconds-(timeZone);
                    const currentDate=new Date(currentDateMilliseconds);
    
                    const newFormatPhoto="data:image/jpg;base64," + post.source.photo;
    
             
                    return <li key={post.id} className="myFriends_item">
                                {index+1}
                                <div>
                                    <div>
                                        <img src={newFormatPhoto} alt="userPhoto" className="myFriends_item_img"/>
                                        {post.source.firstName} {post.source.lastName}
                                    </div>
                                </div>
                                <div>{post.content}</div>
                                <div>
                                <Moment locale="ru"
                                                date={currentDate}
                                                format={localFormatDateByVersionLibMomentReact}
                                                
                                        />
                                </div>
                            </li>
                })
                return posts
            }
            
        }, [totalSizePosts, postsArr])

        return(
            
            <div>
                <form 
                onSubmit={postRequest}  
                onKeyPress={keyPressEnter}
                >
                    <textarea type="text" 
                              placeholder="Какие новости?" 
                              value={newPost}
                              required
                              onChange={valuePost}
                    />
                    <button type="submit">Опубликовать</button>
                </form>
                <div>{totalSizePosts}</div>
                <ul ref={postListRef}>
                    {
                        postContent
                    }
                </ul>
            </div>
        )
    
}

const mapStateToProps = (state) => {
    return {
        currentIdLocation: state.currentIdLocation,
        newPostInput: state.newPost,
        accessesToPosts: state.accessesToPosts
        // info: state.infoRelation,
        // groupInfoRelation:state.groupInfoRelation
    }
}

export default WithService()(connect(mapStateToProps)(PostsList));