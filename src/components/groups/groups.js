// import React, { Component} from 'react';
// import './groups.scss';
// import {Link, HashRouter} from 'react-router-dom';
// import { withRouter } from "react-router-dom";
// import WithService from '../hoc/hoc';


// class Groups extends Component{
//     constructor(props){
//         super(props)
//         this.state={
//             arrGroups: [],
//             totalSizeGroup: '',
//             req: false,
//             heightList: ''
//         }
//         this.refListGroup=React.createRef()
//         const {Service} = this.props;
        
//         let start=0;
//         let end=10;

//         this.allGroup=()=>{
//             Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
//                 .then(res=>{
//                     console.log("res")
//                     this.setState({
//                         arrGroups: [...this.state.arrGroups, ...res.data.groups],
//                         totalSizeGroup: res.data.totalSize
//                     })
//                 })
//         }

//         this.componentDidMount=()=>{
//             this.allGroup();
//         }

//         this.goToGroup=(id)=>{
//             this.props.history.push(`/groups/${id}`)
//         }

        
    

//         this.componentDidUpdate=()=>{
//             const heightListGroup=this.refListGroup.current.scrollHeight;
//             if(heightListGroup!==this.state.heightList){
//                 this.setState({
//                     heightList: heightListGroup
//                 })
//             }
//             const windowHeight=document.documentElement.clientHeight;
//             window.addEventListener("scroll", ()=>{
//                 let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//                 if((scrollTop+windowHeight)>=(this.state.heightList/100*80) && !this.state.req){
//                     console.log(scrollTop+windowHeight, this.state.heightList)
//                     this.setState({
//                         req: true
//                     })

//                     start=end;
//                     end=end+10;

//                     if(start===this.state.totalSizeGroup){
//                         return
//                     }

//                     if(start>this.state.totalSizeGroup){
//                         return
//                     }

                    
//                     if(end>this.state.totalSizeGroup){
//                         end=this.state.totalSizeGroup
//                     }


//                     console.log(start, end)
//                     console.log("yes")
//                     Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
//                     .then(res=>{
//                         console.log(res.data.groups)
//                         this.setState({
//                             arrGroups: [...this.state.arrGroups, ...res.data.groups],
//                             totalSizeGroup: res.data.totalSize,
//                             req: false
//                         })
//                     })
//                     return false
//                 }
                
//             })
            

//         }
        

//     }
    
    
//      render(){

//         let groupsAndMessageNotGroups=null;

//         if(this.state.arrGroups.length===0){
//             groupsAndMessageNotGroups=<div>
//                                         У вас пока нет групп
//                                       </div>
//         }

//         if(this.state.arrGroups.length>0){
//             groupsAndMessageNotGroups=<div>
//                                         {
//                                             this.state.arrGroups.map((el, index)=>{
//                                                 return <div key={el.id}>
//                                                             <li className="myGroups_item" onClick={()=>this.goToGroup(el.id)}>
//                                                                 {index+1}
//                                                                 <img className="myGroups_item_img" src={"data:image/jpg;base64," + el.photo} alt="photoGroup"/>
//                                                                 {el.name}
//                                                             </li>
//                                                         </div>
//                                             })
//                                         }
//                                       </div>
//         }

//          return(
//             <div>
//                 <div>
//                     <input
//                         type="text"
//                         placeholder="Поиск групп"
//                     />
//                     <HashRouter>
//                         <Link to="/createGroups"><button>Создать новую группу</button></Link>
//                     </HashRouter>
//                 </div>
//                 <div className="myGroups">
//                     <div>Всего групп: {this.state.totalSizeGroup}</div>
//                     <ul className="myGroups_list" ref={this.refListGroup}>
//                         {groupsAndMessageNotGroups}
//                     </ul>
//                 </div>
//             </div>
//         )
//      }
// }


// export default withRouter(WithService()(Groups));

import React, { Component} from 'react';
import './groups.scss';
import {Link, HashRouter} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import FriendsAndGroupsList from '../friendsAndGroupsList/friendsAndGroupsList';


class Groups extends Component{
    constructor(props){
        super(props)
        this.state={
            arr: []
        }
        
    }
    
     render(){
         return(
            <div>
                <HashRouter>
                    <Link to="/createGroups"><button>Создать новую группу</button></Link>
                </HashRouter>
                <FriendsAndGroupsList getItems={(start,end)=>
                                            `/api/group/all?start=${start}&end=${end}`
                                        }
                                        arrItems={(items)=>{
                                            this.setState({
                                                arr: [...this.state.arr, ...items.groups]
                                            })
                                        }}
                                        path={(id)=>{
                                            this.props.history.push(`/groups/${id}`)
                                            }
                                        }
                                        titleItem={(el)=>{
                                            return(
                                                <div>
                                                    <img className="myFriends_item_img" src={"data:image/jpg;base64," + el.photo} alt="photoGroup"/>
                                                    <span>{el.name}</span>
                                                </div>
                                            )
                                        }}
                                        renderItems={this.state.arr}
                                        searchName={"Поиск групп"}
                                        messageNotContent={"У вас пока нет групп"}
                                        nameList={"групп"}
                                    />
            </div>
         )
     }
}


export default withRouter(WithService()(Groups));