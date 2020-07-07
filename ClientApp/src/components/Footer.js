import React, { Component } from 'react';
import './Footer.css';
import { TopscrollButton } from './TopscrollButton';

export class Footer extends Component {
    static displayName = Footer.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footercontainer">
                <TopscrollButton />
            </div>
            )
    }
}