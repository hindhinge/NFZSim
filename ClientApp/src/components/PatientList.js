import React, { Component, useState, Redirect } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon,Input,Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,Label,FormGroup} from 'reactstrap';
import { PatientListEdit } from './PatientListEdit';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';

export class PatientList extends Component {
    static displayName = PatientList.name;

    constructor(props) {
        super(props);
        this.state = {
            dbLogin: "sa",
            dbPassword: "password",
            addPName: "",
            addPSurname: "",
            addPPhone: "",
            addPMail: "",
            dropdownOpen: false,
            setOpen: false,
            searchByCategory: 0, //1-5 Id,Name,Surname,Phone,Mail
            searchByField: "",
            sortedBy: 0, //0 - 4 sorted by Id,Name,Surname,Phone,Mail ascending, 5-9 descending
            patients: [],
            loading: true
        };
        this.addPatientName = this.addPatientName.bind(this);
        this.addPatientSurname = this.addPatientSurname.bind(this);
        this.addPatientPhone = this.addPatientPhone.bind(this);
        this.addPatientMail = this.addPatientMail.bind(this);
        this.addPatient = this.addPatient.bind(this);

        this.toggle = this.toggle.bind(this);

        this.sortById = this.sortById.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortBySurname = this.sortBySurname.bind(this);
        this.sortByPhone = this.sortByPhone.bind(this);
        this.sortByMail = this.sortByMail.bind(this);

        this.handleSearchBy = this.handleSearchBy.bind(this);
        this.handleSearchByButton = this.handleSearchByButton.bind(this);

        this.setSearchCategory = this.setSearchCategory.bind(this);

        this.handleDeletePatient = this.handleDeletePatient.bind(this);
    }

    componentDidMount() {
        this.populatePatientData();
    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    addPatientName(event) {
        this.setState({ addPName: event.target.value });
    }

    addPatientSurname(event) {
        this.setState({ addPSurname: event.target.value });
    }

    addPatientPhone(event) {
        this.setState({ addPPhone: event.target.value });
    }

    addPatientMail(event) {
        this.setState({ addPMail: event.target.value });

    }

    toggle() {//for sorting dropdown
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    sortById() {
        this.setState({ sortedBy: 0 });
    }
    sortByName() {
        this.setState({ sortedBy: 1 });
    }
    sortBySurname() {
        this.setState({ sortedBy: 2 });

    }
    sortByPhone() {
        this.setState({ sortedBy: 3 });
    }
    sortByMail() {
        this.setState({ sortedBy: 4 });
    }

    setSearchCategory(e) {
        this.setState({ searchByCategory: e.target.value });
    }

    handleSearchBy(event) {
        this.setState({ searchByField: event.target.value });
    }

    handleSearchByButton() {
        this.searchByParameter();
    }


    static renderPatientsData(patientlist,patients) {   //patientlist is reference to our PatientList object; used to handle onClick in buttons
        return (
            <table className='table table-striped' aria-labelledby="patientstable" >
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Phone</th>
                        <th>Mail</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient =>
                        <tr key={patient.patientId}>
                            <td>{patient.patientId}</td>
                            <td>{patient.patientName}</td>
                            <td>{patient.patientSurname}</td>
                            <td>{patient.patientPhone}</td>
                            <td>{patient.patientMail}</td>
                            <td><Link to={"/patientedit/"+patient.patientId}><Button> EDIT</Button></Link></td>
                            <td><Button onClick={patientlist.handleDeletePatient} value={patient.patientId}>DELETE</Button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
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


    addPatient(e) {
        this.post('/patient/PatientAdd', {
            PatientId: 0,
            PatientName: this.state.addPName,
            PatientSurname: this.state.addPSurname,
            PatientMail: this.state.addPMail,
            PatientPhone: Number(this.state.addPPhone)
        });
        this.populatePatientData();
        PatientList.renderPatientsData(this,this.state.patients);
        this.populatePatientData();
        PatientList.renderPatientsData(this,this.state.patients);
    }

    handleDeletePatient(e) {
        this.delete('/patient/PatientDelete?id='+e.target.value,{});
        this.populatePatientData();
        PatientList.renderPatientsData(this, this.state.patients);
    }

    render() {
        if (NavMenu.logged == true) {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : PatientList.renderPatientsData(this, this.state.patients);

            return (
                <div>
                    <h1>Add patient</h1>
                    <Container>
                        <Row xs="5">
                            <Col>
                                <p1>Name</p1>
                            </Col>
                            <Col>
                                <p1>Surname</p1>
                            </Col>
                            <Col>
                                <p1>Phone</p1>
                            </Col>
                            <Col>
                                <p1>Mail</p1>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <Input value={this.state.addPName} onChange={this.addPatientName}></Input>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Input value={this.state.addPSurname} onChange={this.addPatientSurname}></Input>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Input value={this.state.addPPhone} onChange={this.addPatientPhone}></Input>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Input value={this.state.addPMail} onChange={this.addPatientMail}></Input>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button onClick={this.addPatient}>Add</Button>
                            </Col>
                        </Row>
                    </Container>

                    <Container>
                        <Row xs="2">
                            <Col>
                                <FormGroup tag="fieldset">
                                    <legend>Serach by:</legend>
                                    <FormGroup check>
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={0} type="radio" name="radio1" />{' '}
                                        None
                                     </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={1} type="radio" name="radio1" />{' '}
                                        Id
                                     </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={2} type="radio" name="radio1" />{' '}
                                        Name
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={3} type="radio" name="radio1" />{' '}
                                        Surname
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={4} type="radio" name="radio1" />{' '}
                                        Phone
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={5} type="radio" name="radio1" />{' '}
                                        Mail
                                    </Label>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="text" name="parameter" id="parameter" placeholder="Type in value" onChange={this.handleSearchBy} />
                                    </FormGroup>
                                    <Button onClick={this.handleSearchByButton}>Search</Button>
                                </FormGroup>
                            </Col>
                            <Col>
                                <h3>Sort by:</h3>
                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                        Parameter
                                </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.sortById}>Id</DropdownItem>
                                        <DropdownItem onClick={this.sortByName}>Name</DropdownItem>
                                        <DropdownItem onClick={this.sortBySurname}>Surname</DropdownItem>
                                        <DropdownItem onClick={this.sortByPhone}>Phone</DropdownItem>
                                        <DropdownItem onClick={this.sortByMail}>Mail</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Col>
                        </Row>
                    </Container>

                    <h1 id="patientstable" >List of registered patients:</h1>
                    {contents}
                </div>
            );
        } else {
            return (<Unlogged />);
        }
    }


    async populatePatientData()
    {
        const response = await fetch('patient/PatientData?sorttype=0&field=0&value=');
        const data = await response.json();
        this.setState({ patients: data, loading: false });
    }

    async searchByParameter()
    {
        this.setState({loading: true });
        var sort = this.state.sortedBy;
        var field = this.state.searchByCategory;
        var value = this.state.searchByField;
        var fetchstring = 'patient/PatientDataParamSort';
        var sortstring = '?sorttype=' + sort;
        var fieldstring = '&field=' + field;
        var valuestring = '&value=' + value;
        var request = fetchstring + sortstring + fieldstring + valuestring;
        const response = await fetch(request);
        const data = await response.json();
        this.setState({ patients: data, loading: false });
    }
}
