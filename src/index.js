import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import {BrowserRouter as Router} from 'react-router-dom';
import ServiceContext from './components/servicesContext/servicesContext';
import Service from './service/service';

const store=createStore(reducer);

const service=new Service();

ReactDOM.render(
    <Provider store={store}>
            <ServiceContext.Provider value={service}>
                <Router>
                    <App/>
                </Router>
            </ServiceContext.Provider>
    </Provider>
    , document.getElementById('root'));

