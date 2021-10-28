import React, {Component} from 'react';
import './font.scss';
import './devizLabel.scss';

class DevizLabel extends Component{
    render(){
        return(
            <aside className="devizLabel">
                <hr className="devizLabel__line"/>
                <span className="devizLabel__deviz">Общаясь - расцветай</span>
                <hr className="devizLabel__line"/>
            </aside>
        )
    }
}

export default DevizLabel;