import React, { Component} from 'react';
import './friends.scss';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';

class Friends extends Component{
    constructor(props){
        super(props);
        this.state={
            arrFriends: [],
            totalSize: '',
            req: false,
            heightList: ''
        }

        this.refListFriends=React.createRef();

        const {Service} = this.props;

        let start=0;
        let end=10;

        this.allFriends=()=>{
            Service.getFriendsAll(`/api/account/all?start=${start}&end=${end}`)
                .then(res=>{
                    console.log(res)
                    console.log("res")
                    this.setState({
                        arrFriends: [...this.state.arrFriends, ...res.data.accounts],
                        totalSizeGroup: res.data.totalSize
                    })
                })
        }

        this.componentDidMount=()=>{
            this.allFriends();
        }

        this.goToFriends=(id)=>{
            this.props.history.push(`${id}`)
        }

        this.componentDidUpdate=()=>{
            const heightListFriends=this.refListFriends.current.scrollHeight;
            if(heightListFriends!==this.state.heightList){
                this.setState({
                    heightList: heightListFriends
                })
            }
            console.log(heightListFriends)
            const windowHeight=document.documentElement.clientHeight;
            console.log(windowHeight);
            window.addEventListener("scroll", ()=>{
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if((scrollTop+windowHeight)>=(this.state.heightList/100*80) && !this.state.req){
                    console.log(scrollTop+windowHeight, this.state.heightList)
                    this.setState({
                        req: true
                    })

                    start=end;
                    end=end+10;

                    if(start===this.state.totalSizeFriends){
                        return
                    }

                    if(start>this.state.totalSizeFriends){
                        return
                    }

                    
                    if(end>this.state.totalSizeFriends){
                        end=this.state.totalSizeFriends
                    }


                    console.log(start, end)
                    console.log("yes")
                    Service.getFriendsAll(`/api/account/all?start=${start}&end=${end}`)
                    .then(res=>{
                        console.log(res.data.accounts)
                        this.setState({
                            arrFriends: [...this.state.arrFriends, ...res.data.accounts],
                            totalSizeFriends: res.data.totalSize,
                            req: false
                        })
                    })
                    return false
                }
                
            })
            

        }
    }

    render(){
        let friendsAndMessageNotFriends=null;

        if(this.state.arrFriends.length===0){
            friendsAndMessageNotFriends=<div>
                                        У вас пока нет друзей
                                      </div>
        }

        if(this.state.arrFriends.length>0){
            friendsAndMessageNotFriends=<div>
                                        {
                                            this.state.arrFriends.map((el, index)=>{
                                                return <div key={el.id}>
                                                            <li className="myFriends_item" onClick={()=>this.goToFriends(el.id)}>
                                                                {index+1}
                                                                <img className="myFriends_item_img" src={"data:image/jpg;base64," + el.photo} alt="photoGroup"/>
                                                                {el.name}
                                                            </li>
                                                        </div>
                                            })
                                        }
                                      </div>
        }

         return(
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Поиск друзей"
                    />
                </div>
                <div className="myFriends" >
                    <div>Всего групп: {this.state.totalSizeFriends}</div>
                    <ul className="myGroups_list" ref={this.refListFriends}>
                        {friendsAndMessageNotFriends}
                    </ul>
                </div>
            </div>
        )
     }
}


    


export default withRouter(WithService()(Friends));