import React, { Component } from 'react';
import { Row, Col, Collapse, Button, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import logo from './images/logo.jpg';

export class NavMenu extends Component {
    static displayName = NavMenu.name;
    static logged = false;
    static logtime;
    static logmins = 0;
    static logsecs = 0;
    static logseconds = 0;
    static links = { home: "/", patient: "/", visits: "/", reminder:"/",drugs:"/" };
    static homelink = "/";
    static patientlink = "/";

    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
        this.forceUpdate = this.forceUpdate.bind(this);
        this.showSessionTime = this.showSessionTime.bind(this);
    }

    static loggedStatus(status) {
        NavMenu.logged = status;
        if (status == true) {
            NavMenu.logtime = Date.now();
        }
    }

    static refreshSession() {
        NavMenu.logtime = Date.now();
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    async secondCounter() {
        this.setState({ time: Date.now() });
        NavMenu.logsecs = parseInt((this.state.time - NavMenu.logtime) / 1000, 10);
        NavMenu.logseconds = NavMenu.logsecs % 60;
        NavMenu.logmins = parseInt(NavMenu.logsecs / 60, 10);
        if (NavMenu.logmins == 15 && NavMenu.logged == true) {
            NavMenu.logged = false;
            NavMenu.logsecs = 0;
            NavMenu.logtime = 0;
            var request = "login/Logout";
            const response = await fetch(request);
            const data = await response.json();
           
            }
    }


    componentDidMount() {
        this.interval = setInterval(() => this.secondCounter(), 1000);

    }

    showSessionTime(e) {
        if (NavMenu.logged == false || NavMenu.logmins > 15) {
            return (<p></p>);
        }
        if (NavMenu.logged == true && NavMenu.logseconds <=49) {
            return (<p>Aktywna sesja:{14 - NavMenu.logmins}:{59 - NavMenu.logseconds}</p>);
        }
        if (NavMenu.logged == true && NavMenu.logseconds > 49) {
            return (<p>Aktywna sesja:{14 - NavMenu.logmins}:0{59 - NavMenu.logseconds}</p>);
        }
        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    forceUpdate(e) {
        this.setState({ state: this.state });
    }

    render() {
        return (
            <div className="stay_fixed">
                <Container>
                    <Row >
                        <Col>
                            <Container>
                                <Row>
                                    <Col>
                                        <img src={logo} alt="Logo" />
                            </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Link to={NavMenu.links["home"]}><Button onClick={this.forceUpdate} color="primary" size="sm" block>HOME</Button></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Link to={NavMenu.links["patient"]}><Button onClick={this.forceUpdate} color="primary" size="sm" block>PATIENTS</Button></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Link to={NavMenu.links["visits"]}><Button onClick={this.forceUpdate} color="primary" size="sm" block>VISITS</Button></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Link to={NavMenu.links["reminder"]}><Button onClick={this.forceUpdate} color="primary" size="sm" block>REMINDER</Button></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Link to={NavMenu.links["drugs"]}><Button onClick={this.forceUpdate} color="primary" size="sm" block>DRUGS</Button></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {this.showSessionTime(this)}
                                    </Col>
                                </Row>

                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
