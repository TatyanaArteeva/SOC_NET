import React, {Component} from 'react';
import './App.scss';
import '../../fonts/fonts.scss';
import '../login_page/login_page';
import LoginPage from '../login_page/login_page';
import MainPage from '../main_page/mainPage';
import WithService from '../hoc/hoc';
import {connect} from 'react-redux';
import {displayingLoginAndRegistrationPage, displayingContentPages, userId, userAccesses} from '../../actions';

class App extends Component{
    
    componentDidMount(){
      const {Service}=this.props;
      Service.getCurrentUserStatus('/api/status')
        .then(res=>{
          if(res.status===200){
            this.props.userId(res.data.currentAccount.id);
            this.props.userAccesses(res.data.accesses)
          }
        }).then(res=>{
          this.props.displayingContentPages()
        }).catch(err=>{
          this.props.displayingLoginAndRegistrationPage();
        })
    }

    render(){
      const{showLoginAndRegistrationPage, showContentPage}=this.props;
      
      const loginAndRegistration=showLoginAndRegistrationPage ? <LoginPage/> : null;
      const contentPages=showContentPage ? <MainPage/> : null;

      return (
        <div className="App">
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
