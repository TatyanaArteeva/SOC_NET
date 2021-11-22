import React from 'react';
import spinnerMiniMini from './751.svg';
import './spinnerMiniMini.scss';

const Spinner = () => {
    return (
        <div className="spinner-mini-mini">
            <img src={spinnerMiniMini} alt="spinner" className="spinner-mini-mini__img" />
        </div>
    )
}

export default Spinner