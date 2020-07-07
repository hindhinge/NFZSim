import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';


export class Unlogged extends Component {
    static displayName = Unlogged.name;

    render() {
        return (
            <div>
                <h1>It seems that you forgot to log in!</h1>
                <p>Please <Link to="/"><Button color="primary">LOG IN</Button></Link> to continue.</p>
            </div>
        );
    }
}