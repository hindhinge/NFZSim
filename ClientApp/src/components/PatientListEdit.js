import React, { Component, useState } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';
export class PatientListEdit extends Component {
    static displayName = PatientListEdit.name;
    constructor(props) {
        super(props);
        this.state = {
            changed:false,
            loading:true,
            PId: 0,
            PName: "",
            PSurname: "",
            PPhone: 0,
            PMail:"",            
            patients :[]
        };

        this.changePName = this.changePName.bind(this);
        this.changePSurname = this.changePSurname.bind(this);
        this.changePPhone = this.changePPhone.bind(this);
        this.changePMail = this.changePMail.bind(this);

        this.updatePatient = this.updatePatient.bind(this);
    }

    componentDidMount() {
        this.populatePatientData();
        NavMenu.refreshSession();

    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    mapPatients(patients) {
        patients.map(patient => {
            this.setState({
                PId: this.props.match.params.id,
                PName: patient.patientName,
                PSurname: patient.patientSurname,
                PPhone: patient.patientPhone,
                PMail: patient.patientMail
            })
        });
    }

    changePName(e) {
        this.setState({ PName: e.target.value });
    }
    changePSurname(e) {
        this.setState({ PSurname: e.target.value });
    }
    changePPhone(e) {
        this.setState({ PPhone: e.target.value });
    }
    changePMail(e) {
        this.setState({ PMail: e.target.value });
    }

    render() {
        if (NavMenu.logged == true) {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : PatientListEdit.renderPatientData(this, this.state.patients);
            let changemessage = this.state.changed ? <h2>Patient data sucessfuly changed !</h2> : <h2></h2>;
            return (
                <div>
                    {changemessage}
                    <h1>Edit patient:</h1>
                    {contents}
                </div>
            );
        } else {
            return (<Unlogged />);
        }
    }

    static renderPatientData(patientedit,patients) {
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>ID: {patientedit.state.PId}</h2>
                    </Col>
                    <Col>
                        <InputGroup>
                                <Input value={patientedit.state.PName} onChange={patientedit.changePName}></Input>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                                <Input value={patientedit.state.PSurname} onChange={patientedit.changePSurname}></Input>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                                <Input value={patientedit.state.PPhone} onChange={patientedit.changePPhone}></Input>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                                <Input value={patientedit.state.PMail} onChange={patientedit.changePMail}></Input>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Link to="/patients"><Button>BACK</Button></Link>
                    </Col>
                    <Col>
                        <Button onClick={patientedit.updatePatient}>UPDATE</Button>
                    </Col>
                </Row>
            </Container>
            )
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST', // GET, POST, PUT, DELETE
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

    updatePatient(e) {
        this.post('/patient/PatientUpdate', {
            PatientId: Number(this.state.PId),
            PatientName: this.state.PName,
            PatientSurname: this.state.PSurname,
            PatientMail: this.state.PMail,
            PatientPhone: Number(this.state.PPhone)
        });
        this.populatePatientData();
        this.mapPatients(this.state.patients);
        this.setState({ changed: true });
        PatientListEdit.renderPatientData(this, this.state.patients);
    }

    async populatePatientData() {
        var fetchstring = 'patient/PatientDataParamSort?sorttype=0&field=1&value=';
        var fetchvalue = this.props.match.params.id;
        var request = fetchstring + fetchvalue;
        const response = await fetch(request);
        const data = await response.json();
        this.setState({ patients: data });
        this.mapPatients(this.state.patients);
        this.setState({ loading: false });
    }
}