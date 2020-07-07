import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';


export class Home extends Component {
  static displayName = Home.name;

    render() {
        if (NavMenu.logged == true) {
            return (
                <div>
                    <h1>Hello administrator!</h1>
                    <p>This is your control panel, in which you can: </p>
                    <ul>
                        <li>Show list of all registered patients,</li>
                        <li>edit, add and delete patients from database,</li>
                        <li>do the same thing with visits,</li>
                        <li>send reminders about visits to patients,</li>
                        <li>see database of all available drugs,</li>
                        <li>and nothing else ! (yet)</li>
                    </ul>
                    <p>Select an option from navigation bar to the left.</p>
                </div>
            );
        } else {
            return (<Unlogged />);
        }
  }
}
