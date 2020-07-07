import React, { Component } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Redirect } from 'react-router';
import { Layout } from './NavMenu';
import './Login.css';


export class Login extends Component {
    static displayName = Login.name;
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            redirect: false,
            loginData: []
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.checkCredentials = this.checkCredentials.bind(this);
    }

    handleLogin(event) {
        this.setState({ login: event.target.value });
    }
    handlePassword(event) {
        this.setState({ password: event.target.value });
    }
    handleRedirect(e) {
        NavMenu.links["home"] = "/home";
        NavMenu.links["patient"] = "/patients";
        NavMenu.links["visits"] = "/visits";
        NavMenu.links["reminder"] = "/reminder";
        NavMenu.links["drugs"] = "/drugs";
        this.setState({ redirect: true });
    }

    render() {
        if (this.state.redirect || NavMenu.logged) {
            return <Redirect push to="/home" />;
        } else {
            return (
                <div class="center">
                    <Container>
                    <Row>
                     <Col sm="12" md={{ size: 8, offset: 0 }}>
                    <h1 class="font">{this.state.loginData["message"]}</h1>
                    <h1 class="font">Log in to continue</h1>

                    <Container>
                    <Row>
                    <InputGroup>
                                                <Col sm="12" md={{ size: 2, offset:0 }}>
                                                <h3>Login</h3>
                                                </Col>
                                                <Col sm="12" md={{ size: 8, offset: 2 }}>
                                                <Input value={this.state.login} onChange={this.handleLogin}></Input>
                                                </Col>
                    </InputGroup>
                                    </Row>
                                    <Row>
                                        <InputGroup>
                                            <Col sm="12" md={{ size: 2, offset: 0 }}>
                                                <h3>Password</h3>
                                            </Col>
                                            <Col sm="12" md={{ size: 8, offset: 2 }}>
                                                <Input type="password" value={this.state.password} onChange={this.handlePassword}></Input>
                                            </Col>
                                    </InputGroup>
                                    </Row>
                                    <Row >
                                        <Col xl="8" md={{ size: 8, offset: 4}}>
                                        <Button color="primary" onClick={this.checkCredentials} size="lg" block>Login</Button>
                                        </Col> 
                                    </Row>
                                </Container>
                    </Col>
                    </Row>
                    </Container>
                </div >
            )
        }
    }

    async get(url, data) {
        const response = await fetch(url, {
            method: 'GET', // GET, POST, PUT, DELETE
            mode: 'cors', // no-cors, cors, same-origin
            cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, follow, error
            referrerPolicy: 'no-referrer', // no-referrer, client
            body: JSON.stringify(data)
        });
        return await response.json();

    }
    async checkCredentials(event) {
        var fetchstring = 'login/AdminLogin?';
        var loginstring = 'login=' + this.state.login;
        var passwordstring = '&password=' + this.state.password;
        var request = fetchstring + loginstring + passwordstring;
        const response = await fetch(request);
        const data = await response.json();
        this.setState({ loginData: data });
        if (this.state.loginData["status"] == "GRANTED") {
            NavMenu.loggedStatus(true);
            this.handleRedirect();
        } else {
            NavMenu.loggedStatus(false);
        }
;
    }
}
