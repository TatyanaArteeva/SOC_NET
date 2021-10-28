import React, {Component} from 'react';
import './App.scss';
import '../../fonts/fonts.scss';
import LoginPage from '../login_page/login_page';
import MainPage from '../main_page/mainPage';
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {displayingLoginAndRegistrationPage, displayingContentPages, userId, userAccesses} from '../../actions';
import Spinner from '../spinner/spinner';


class App extends Component{

  constructor(props){
    super(props);
    this.state={
      spinner: true
    }

    this.componentDidMount=()=>{
      const {Service}=this.props;
      Service.getCurrentUserStatus('/api/status')
        .then(res=>{
          if(res.status===200){
            localStorage.setItem("idUser", res.data.currentAccount.id)
            this.props.userId(res.data.currentAccount.id);
            this.props.userAccesses(res.data.accesses)
            this.setState({
              spinner: false
            })
          }
        }).then(res=>{
          this.props.displayingContentPages()
        }).catch(err=>{
          this.setState({
            spinner: false
          })
          this.props.displayingLoginAndRegistrationPage();
        })
    }
  }
    
    
    render(){
      const{showLoginAndRegistrationPage, showContentPage}=this.props;
      
      const loginAndRegistration=showLoginAndRegistrationPage && !this.state.spinner ? <LoginPage/> : null;
      const contentPages=showContentPage && !this.state.spinner ? <MainPage/> : null;
      const spinner=this.state.spinner ? <Spinner/> : null;

      return (
        <div className="App">
          {spinner}
          {loginAndRegistration}
          {contentPages}
       </div>
    
      );
    }
  
}

const mapStateToProps=(state)=>{
  return{
    showLoginAndRegistrationPage: state.loginAndRegistrationPage,
    showContentPage: state.contentPages,
    logoutStatus: state.logout
  }
}

const mapDispatchToProps={
  displayingLoginAndRegistrationPage,
  displayingContentPages,
  userId,
  userAccesses  
}

export default WithService()(connect(mapStateToProps,mapDispatchToProps)(App));
