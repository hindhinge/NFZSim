import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Visit } from './components/Visit';
import { VisitEdit } from './components/VisitEdit';
import { Login } from './components/Login';
import { Reminder } from './components/Reminder';
import { PatientList } from './components/PatientList';
import { PatientListEdit } from './components/PatientListEdit';
import { NavMenu } from './components/NavMenu';
import './custom.css'
import { DrugList } from './components/DrugList';

export default class App extends Component {
    static displayName = App.name;
    render() {
        return (
            <Layout>
                <Route exact path='/' component={Login} />
                <Route path='/home' component={Home} />
                <Route path='/patients' component={PatientList} />
                <Route path='/patientedit/:id' component={PatientListEdit} />
                <Route path='/visits' component={Visit} />
                <Route path='/visitedit/:id' component={VisitEdit} />
                <Route path='/reminder' component={Reminder} />
                <Route path='/drugs' component={DrugList} />
            </Layout>
        );
    }
}
