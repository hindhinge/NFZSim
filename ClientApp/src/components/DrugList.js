import React, { Component } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button, Dropdown, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Redirect } from 'react-router';
import { Layout } from './NavMenu';
import { Unlogged } from './Unlogged';

export class DrugList extends Component {
    static displayName = DrugList.name;
    constructor(props) {
        super(props);
        this.state = {
            drugs: [],
            patients: [],
            PId: [],
            PName: [],
            PSurname: [],
            selPId: "",
            selPName: "",
            selPSurname:"",
            addDrugName: "",
            PDropdownisOpen : false,
            loading : true
        }
        this.handleNameInput = this.handleNameInput.bind(this);
        this.addDrug = this.addDrug.bind(this);
        this.handleAddDrug = this.handleAddDrug.bind(this);
        this.handleDeleteDrug = this.handleDeleteDrug.bind(this);

        this.PDropdowntoggle = this.PDropdowntoggle.bind(this);
        this.patientIdDropdown = this.patientIdDropdown.bind(this);
        this.patientIdHandle = this.patientIdHandle.bind(this);
    }

    componentDidMount() {
        this.populateDrugData();
        this.populatePatientData();
        NavMenu.refreshSession();
    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    handleNameInput(e) {
        this.setState({ addDrugName: e.target.value });
    }
    handleAddDrug(e) {
        this.addDrug(this);
    }

    PDropdowntoggle(e) {//for sorting dropdown
        this.setState({ PDropdownisOpen: !this.state.PDropdownisOpen });
    }

    patientIdDropdown(e) {
        const output = [];
        for (var i = 0; i < this.state.PId.length; i++) {
            output.push(<DropdownItem value={i} onClick={this.patientIdHandle.bind(this)}>{this.state.PId[i]}</DropdownItem>)
        }
        return (
            <DropdownMenu>
                {output}
            </DropdownMenu>
        );
    }
    patientIdHandle(e) {
        this.setState({ selPId: this.state.PId[e.target.value] });
        this.setState({ selPName: this.state.PName[e.target.value] });
        this.setState({ selPSurname: this.state.PSurname[e.target.value] });

    }

    static renderDrugData(druglist,drugs) {   //patientlist is reference to our PatientList object; used to handle onClick in buttons
        return (
            <table className='table table-striped' aria-labelledby="patientstable" >
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Patient Id</th>
                        <th>Drug</th>
                    </tr>
                </thead>
                <tbody>
                    {drugs.map(drug =>
                        <tr key={drug.drugId}>
                            <td>{drug.drugId}</td>
                            <td>{drug.patientId}</td>
                            <td>{drug.drugName}</td>
                            <td><Button onClick={druglist.handleDeleteDrug} value={drug.drugId}>DELETE</Button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        if (NavMenu.logged == true) {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : DrugList.renderDrugData(this, this.state.drugs);

            return (
                <div>
                    <h1>Add perscription</h1>
                    <Row xs="3">
                        <Col>
                            <p1>For patient: </p1>
                        </Col>
                        <Col>
                            <Dropdown isOpen={this.state.PDropdownisOpen} toggle={this.PDropdowntoggle}>
                                <DropdownToggle>
                                    Patient ID
                                    </DropdownToggle>
                                <DropdownMenu
                                    modifiers={{
                                        setMaxHeight: {
                                            enabled: true,
                                            order: 890,
                                            fn: (data) => {
                                                return {
                                                    ...data,
                                                    styles: {
                                                        ...data.styles,
                                                        overflow: 'auto',
                                                        maxHeight: '200px',
                                                    },
                                                };
                                            },
                                        },
                                    }}
                                >
                                    {this.patientIdDropdown}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col>
                                {this.state.selPName}
                        </Col>
                        <Col>
                                {this.state.selPSurname}
                        </Col>
                    </Row>
                    <Row xs="10">
                        <Col>
                            <p1>Drug name: </p1>
                        </Col>
                    </Row>
                    <Row xs="10">
                        <Col>
                            <Input value={this.state.addDrugName} onChange={this.handleNameInput}></Input>
                        </Col>
                        <Col>
                            <Button onClick={this.handleAddDrug}>ADD</Button>
                        </Col>
                    </Row>
                    <h1>List of assigned drugs</h1>
                    {contents}
                </div>);
        } else {
            return (<Unlogged />);
        }
    }
    async populateDrugData() {
        const response = await fetch('drug/DrugData');
        const data = await response.json();
        this.setState({ drugs: data});
    }

    async populatePatientData() {
        const response = await fetch('visit/PatientData');
        const data = await response.json();
        this.setState({ patients: data, loading: false });
        this.state.patients.map(patient => {
            this.setState({ PId: this.state.PId.concat([patient.patientId]) });
            this.setState({ PName: this.state.PName.concat([patient.patientName]) });
            this.setState({ PSurname: this.state.PSurname.concat([patient.patientSurname]) })
        });
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

    async delete(url, data) {
        const response = await fetch(url, {
            method: 'DELETE', // GET, POST, PUT, DELETE
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

    addDrug(e) {
        this.post('/drug/DrugAdd', {
            DrugId: 0,
            PatientId : this.state.selPId,
            DrugName: this.state.addDrugName
        });
        this.populateDrugData();
        DrugList.renderDrugData(this, this.state.drugs);
    }

    handleDeleteDrug(e) {
        this.delete('/drug/DrugDelete?id=' + e.target.value, {});
        this.populateDrugData();
        DrugList.renderDrugData(this, this.state.drugs);
    }


}