import React from 'react';
// import spinnerMini from './1234.gif';
import spinnerMini from './751.svg';
import './spinnerMini.scss';


const Spinner=()=> {
    return (
        <div className="spinner-mini">
            <img src={spinnerMini} alt="spinner" className="spinner-mini__img"/>
        </div>
    )
}

export default Spinner;