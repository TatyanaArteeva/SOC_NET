import React, { Component } from 'react';
import './App.scss';
import '../../fonts/fonts.scss';
import LoginPage from '../loginPage/loginPage';
import MainPage from '../mainPage/mainPage';
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import {
  displayingLoginAndRegistrationPage,
  displayingContentPages,
  userId,
  userAccesses,
} from '../../actions';
import Spinner from '../spinner/spinner';
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true
    }

    const { Service,
      userId,
      userAccesses,
      displayingContentPages,
      displayingLoginAndRegistrationPage } = this.props;

    this.componentDidMount = () => {
      Service.getCurrentUserStatus('/api/status')
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem("idUser", res.data.currentAccount.id)
            userId(res.data.currentAccount.id);
            userAccesses(res.data.accesses)
            this.setState({
              spinner: false
            })
          }
        }).then(res => {
          displayingContentPages()
        }).catch(err => {
          this.setState({
            spinner: false
          })
          displayingLoginAndRegistrationPage();
        })
    }
  }

  render() {

    const { showLoginAndRegistrationPage, showContentPage } = this.props;

    const { spinner } = this.state;

    let loginAndRegistration = null;
    if (showLoginAndRegistrationPage && !spinner) {
      loginAndRegistration = <LoginPage />
    }

    let contentPages = null;
    if (showContentPage && !spinner) {
      contentPages = <MainPage />
    }

    const spinnerBlock = spinner ? <Spinner /> : null;

    if (this.props.notAuthorization) {
      loginAndRegistration = <LoginPage />;
      contentPages = null;
    }

    return (
      <div className="App">
        {spinnerBlock}
        {loginAndRegistration}
        {contentPages}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showLoginAndRegistrationPage: state.loginAndRegistrationPage,
    showContentPage: state.contentPages,
    logoutStatus: state.logout
  }
}

const mapDispatchToProps = {
  displayingLoginAndRegistrationPage,
  displayingContentPages,
  userId,
  userAccesses
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(App)))
