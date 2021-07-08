// import React, {Component, createRef} from 'react';
import React, {useEffect, useState, useRef, Component} from 'react';
import './groups.scss';
import {Link, HashRouter} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import { useHistory } from "react-router-dom";

class Groups extends Component{
    constructor(props){
        super(props)
        this.state={
            arrGroups: [],
            totalSizeGroup: '',
            req: false,
            heightList: ''
        }
        this.refListGroup=React.createRef()
        const {Service} = this.props;
        

       


        let start=0;
        let end=10;

        this.allGroup=()=>{
            Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
                .then(res=>{
                    console.log("res")
                    this.setState({
                        arrGroups: [...this.state.arrGroups, ...res.data.groups],
                        totalSizeGroup: res.data.totalSize
                    })
                })
        }

        this.componentDidMount=()=>{
            this.allGroup();
        }

        this.goToGroup=(id)=>{
            this.props.history.push(`/groups/${id}`)
        }

        
    

        this.componentDidUpdate=()=>{
            const heightListGroup=this.refListGroup.current.scrollHeight;
            if(heightListGroup!==this.state.heightList){
                this.setState({
                    heightList: heightListGroup
                })
            }
            console.log(heightListGroup)
            const windowHeight=document.documentElement.clientHeight;
            console.log(windowHeight);
            window.addEventListener("scroll", ()=>{
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                // console.log(scrollTop)
                if((scrollTop+windowHeight)>=(this.state.heightList/100*80) && !this.state.req){
                    console.log(scrollTop+windowHeight, this.state.heightList)
                    this.setState({
                        req: true
                    })
                    start=end;
                    end=end+10;
                    if(start===end){
                        return
                    }

                    if(end>this.state.totalSizeGroup){
                        return
                    }
                    console.log("yes")
                    Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
                    .then(res=>{
                        console.log(res.data.groups)
                        this.setState({
                            arrGroups: [...this.state.arrGroups, ...res.data.groups],
                            totalSizeGroup: res.data.totalSize,
                            req: false
                        })
                    })
                    return false
                }
                
            })
            

        }
        

    }
    
    
     render(){

         return(
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Поиск групп"
                    />
                    <HashRouter>
                        <Link to="/createGroups"><button>Создать новую группу</button></Link>
                    </HashRouter>
                </div>
                <div className="myGroups" onClick={this.click}>
                    <div>Всего групп: {this.state.totalSizeGroup}</div>
                    <ul className="myGroups_list" ref={this.refListGroup}>
                        {
                            this.state.arrGroups.map((el, index)=>{
                                return <div key={el.id}>
                                            <li className="myGroups_item" onClick={()=>this.goToGroup(el.id)}>
                                                {index+1}
                                                <img className="myGroups_item_img" src={"data:image/jpg;base64," + el.photo} alt="photoGroup"/>
                                                {el.name}
                                            </li>
                                        </div>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
     }
}


// const Groups =({Service})=>{
//     const [arrGroups, setArrGroups]=useState([]);
//     const [totalSizeGroup, setTotalSizeGroups]=useState();
//     const [heightContent, setHeightContent]=useState();
//     const [scroll, setScroll]=useState()
//     const refListGroup = useRef();
//     const { push } = useHistory();
//     const heightListGroup=refListGroup;
//     const windowHeight=document.documentElement.clientHeight;
//     let request=false
  
//     let start=0;
//     let end=10;

//         useEffect(()=>{
//             getGroup();
            
//         },[])

//         window.addEventListener('scroll', ()=>{
//             setScroll(window.pageYOffset || document.documentElement.scrollTop);

//         })

        

//         function getGroup(){
//             request=true
//             Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
//             .then(res=>{
//                 console.log(res)
//                     setArrGroups([...arrGroups, ...res.data.groups])
//                     setTotalSizeGroups(res.data.totalSize)
//             })
//             .then(res=>{
//                 setHeightContent(heightListGroup.current.scrollHeight);
//             })
//         }

   
          
      



//         // if(scroll+windowHeight>=heightContent/100*80 && request===false){
//         //     request=true
//         //     if(request===true){
//         //         start=end;
//         //         end=end+10;
//         //         Service.getGroupAll(`/api/group/all?start=${start}&end=${end}`)
//         //         .then(res=>{
//         //             console.log(res)
//         //                 setArrGroups([...arrGroups, ...res.data.groups])
//         //                 setTotalSizeGroups(res.data.totalSize)
//         //         })
//         //         .then(res=>{
//         //             setHeightContent(heightListGroup.current.scrollHeight);
//         //             request=false
//         //         })
//         //     }
     
//         // }


//         function goToGroup(id){
//             push({
//                 pathname: `/groups/${id}`
//             });
//         }


//             // const heightListGroup=refListGroup.current.heght;
//             // console.log(heightListGroup)
  

//             // const heightListGroup=refListGroup.current.getBoundingClientRect().height;
//             // const windowHeight=document.documentElement.clientHeight;
//             // console.log(heightListGroup, windowHeight);
//             // window.addEventListener("scroll", ()=>{
//             //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//             //     a=scrollTop
//                 // if((scroll+windowHeight)===heightListGroup-100 || (scroll+windowHeight)>=heightListGroup-100){
//                 //     console.log("scroll");
//                 //     // start=end;
//                 //     // end=end+10;
//                 //     // this.allGroup()
//                 // }
                
               
//             // })
            

       
       
        



    
    
    

//     return(
//         <div>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Поиск групп"
//                 />
//                 <HashRouter>
//                     <Link to="/createGroups"><button>Создать новую группу</button></Link>
//                 </HashRouter>
//             </div>
//             <div className="myGroups">
//                 <div>Всего групп: {totalSizeGroup}</div>
//                 <ul className="myGroups_list" ref={refListGroup}>
//                     {
//                         arrGroups.map((el, index)=>{
//                             return <div key={el.id}>
//                                         <li className="myGroups_item" onClick={()=>goToGroup(el.id)}>
//                                             {index+1}
//                                             <img className="myGroups_item_img" src={"data:image/jpg;base64," + el.photo} alt="photoGroup"/>
//                                             {el.name}
//                                         </li>
//                                     </div>
//                         })
//                     }
//                 </ul>
//             </div>
//         </div>
//     )
// }

export default withRouter(WithService()(Groups));