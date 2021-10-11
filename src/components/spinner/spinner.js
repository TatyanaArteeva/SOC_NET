import React from 'react';
import spinner from './1234.gif';
import './spinner.scss';


const Spinner=()=> {
    return (
        <div className="spinner">
            <div className="spinner__modal">
                <img src={spinner} alt="spinner" className="spinner__img"/>
            </div>
        </div>
    )
}

export default Spinner;