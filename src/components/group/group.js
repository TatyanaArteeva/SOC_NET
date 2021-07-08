import React, {useState, useEffect} from 'react';
import './group.scss';
import WithService from '../hoc/hoc';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import {groupId} from '../../actions';
import {Link, HashRouter} from 'react-router-dom';

const Group =({Service, idInUrl, groupId})=>{
    
    const[nameGroup, setNameGroup]=useState();
    const[themeGroup, setThemeGroup]=useState();
    // const[ownThemeGroup, setOwnThemeGroup]=useState();
    const[subThemeGroup, setSubThemeGroup]=useState();
    const[descriptionGroup, setDescriptionGroup]=useState();
    const[photoGroup, setPhotoGroup]=useState();
    const[photoNameGroup, setPhotoNameGroup]=useState();
    const[id, setId]=useState();
    
    useEffect(()=>{
        let cleanupFunction = false;
            const information=async () =>{
            try{
                const res=await Service.getGroup(`/api/group/${idInUrl}`)
                    if(!cleanupFunction){
                        groupId(idInUrl)
                        localStorage.setItem('idGroup', idInUrl);
                        if(res.data.ownTheme.length>0){
                            setThemeGroup(res.data.ownTheme)
                            setSubThemeGroup(res.data.subTheme)
                        }else{
                            setThemeGroup(res.data.theme)
                            setSubThemeGroup(res.data.subTheme)
                        }
                        setNameGroup(res.data.name)
                        setSubThemeGroup(res.data.subTheme)
                        setDescriptionGroup(res.data.description)
                        setPhotoNameGroup(res.data.photoName)
                        setId(res.data.id)
                        const newFormatPhoto="data:image/jpg;base64," + res.data.photo;
                        setPhotoGroup(newFormatPhoto)
                    }
            }catch(e){
                console.log(e)
            }
             
        }
        information()

        return () => cleanupFunction = true;
        
    },[])

        return(
            <div>
                <div className="group">
                    <div className="group_photo">
                        <div className="photo"><img className="photoUser" src={photoGroup}  alt="photoGroup"/></div>
                    </div>
                    <div className="group_information">
                        <HashRouter>
                            <Link to="/modificationGroups"><button>Редактировать</button></Link>
                        </HashRouter>
                        <div className="group_name">Название группы: {nameGroup}</div>
                        <div className="group_information_theme">здесь будет тема: {themeGroup}</div>
                        <div className="group_information__subTheme">Здесь будет субтема: {subThemeGroup}</div>
                        <div className="group_information__description">Здесь будет описание: {descriptionGroup}</div>
                        <div className="group_information__admin">Здесь будет администратор группы</div>
                    </div>
                    <div className="group_publicMessages">Здесь будут новости группы</div>
                </div>
            </div>
        )
    }

    const mapStateToProps = (state) => {
    return {
        idGroup: state.groupId,
    }
}

const mapDispatchToProps = {
    groupId,
}


export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(Group)))