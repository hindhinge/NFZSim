import React, { Component, useState, Redirect } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button,Dropdown ,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';


export class Visit extends Component {
    static displayName = Visit.name;


    constructor(props) {
        super(props);
        this.state = {
            privateNFZ:"NFZ",
            DId: [],
            DName: [],
            DSurname: [],
            DSpecialization: [],
            PId: [],
            PName: [],
            PSurname: [],
            visits: [],
            patients: [],
            doctors: [],
            selPId: 0,
            selPName: "",
            selPSurname: "",
            selDId: 0,
            selDSpecialization :"",
            selDName: "",
            selDSurname: "",
            PDropdownisOpen: false,
            DDropdownisOpen: false,
            DYearDropdownisOpen: false,
            DMonthDropdownisOpen: false,
            DDayDropdownisOpen: false,
            DateYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
            DateMonths: ["01","02","03","04","05","06","07","08","09","10","11","12"],//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            DateDays: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            selYear: "2020",
            selMonth: "01",
            selDay: "01",
            selHour: "12",
            selMinute: "00",
            selFulldate: "2020-05-04",
            selFulltime: "12:00:00",
            searchByCategory: 0, //0 = None, 1-8 Id,PatientID,PatientName,PatientSurname,Doctor ID,Doctorname,Doctor surname, Date
            searchByField: "",
            sortedBy: 0, //0 - 7 id,pid,pname,psurname,did,dname,dsurname,date ascending, 8 - 15 descending
            searchDropdownOpen: false,
            setSearchDropdownOpen: false,
            loading: true
        };
        this.PDropdowntoggle = this.PDropdowntoggle.bind(this);
        this.DDropdowntoggle = this.DDropdowntoggle.bind(this);
        this.DYearDropdowntoggle = this.DYearDropdowntoggle.bind(this);
        this.DMonthDropdowntoggle = this.DMonthDropdowntoggle.bind(this);
        this.DDayDropdowntoggle = this.DDayDropdowntoggle.bind(this);
        this.patientIdDropdown = this.patientIdDropdown.bind(this);
        this.doctorIdDropdown = this.doctorIdDropdown.bind(this);
        this.dateYearDropdown = this.dateYearDropdown.bind(this);
        this.dateMonthDropdown = this.dateMonthDropdown.bind(this);
        this.dateDayDropdown = this.dateDayDropdown.bind(this);
        this.setCurrentDate = this.setCurrentDate.bind(this);
        this.handleHourInput = this.handleHourInput.bind(this);
        this.handleMinuteInput = this.handleMinuteInput.bind(this);
        this.addVisitHandle = this.addVisitHandle.bind(this);
        this.addvisit = this.addvisit.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.confirmDateHandle = this.confirmDateHandle.bind(this);

        this.handleSearchBy = this.handleSearchBy.bind(this);
        this.handleSearchByButton = this.handleSearchByButton.bind(this);
        this.setSearchCategory = this.setSearchCategory.bind(this);

        this.sortBy = this.sortBy.bind(this);
        this.toggleSortDD = this.toggleSortDD.bind(this);
        this.handleDeleteVisit = this.handleDeleteVisit.bind(this);

        this.handlePrivateInput = this.handlePrivateInput.bind(this);
    }

    componentDidMount() {
        this.populateVisitData();
        this.populatePatientData();
        this.populateDoctorData();
        this.setCurrentDate();
        NavMenu.refreshSession();
    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    PDropdowntoggle(e) {//for sorting dropdown
        this.setState({ PDropdownisOpen: !this.state.PDropdownisOpen });
    }

    DDropdowntoggle(e) {//for sorting dropdown
        this.setState({ DDropdownisOpen: !this.state.DDropdownisOpen });
    }

    DYearDropdowntoggle(e) {
        this.setState({ DYearDropdownisOpen: !this.state.DYearDropdownisOpen });
    }

    DMonthDropdowntoggle(e) {
        this.setState({ DMonthDropdownisOpen: !this.state.DMonthDropdownisOpen });
    }

    DDayDropdowntoggle(e) {
        this.setState({ DDayDropdownisOpen: !this.state.DDayDropdownisOpen });
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

    doctorIdDropdown(e) {
        const output = [];
        for (var i = 0; i < this.state.DId.length; i++) {
            output.push(<DropdownItem value={i} onClick={this.doctorIdHandle.bind(this)}>{this.state.DId[i]}</DropdownItem>)
        }
        return (
            <DropdownMenu>
                {output}
            </DropdownMenu>
        );
    }

    dateYearDropdown(e) {
        const output = [];
        for (var i = 0; i < this.state.DateYears.length; i++) {
            output.push(<DropdownItem value={i} onClick={this.dateYearHandle.bind(this)}>{this.state.DateYears[i]}</DropdownItem>)
        }
        return (
            <DropdownMenu>
                {output}
            </DropdownMenu>
        );
    }

    dateMonthDropdown(e) {
        const output = [];
        for (var i = 0; i < this.state.DateMonths.length; i++) {
            output.push(<DropdownItem value={i} onClick={this.dateMonthHandle.bind(this)}>{this.state.DateMonths[i]}</DropdownItem>)
        }
        return (
            <DropdownMenu>
                {output}
            </DropdownMenu>
        );
    }

    dateDayDropdown(e) {
        const output = [];
        for (var i = 0; i < this.state.DateDays.length; i++) {
            output.push(<DropdownItem value={i} onClick={this.dateDayHandle.bind(this)}>{this.state.DateDays[i]}</DropdownItem>)
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

    doctorIdHandle(e) {
        this.setState({ selDId: this.state.DId[e.target.value] });
        this.setState({ selDName: this.state.DName[e.target.value] });
        this.setState({ selDSurname: this.state.DSurname[e.target.value] });
        this.setState({ selDSpecialization: this.state.DSpecialization[e.target.value] });

    }

    dateYearHandle(e) {
        this.setState({ selYear: this.state.DateYears[e.target.value] });
        this.updateDate();
        this.setState({ state: this.state });
    }

    dateMonthHandle(e) {
        this.setState({ selMonth: this.state.DateMonths[e.target.value] });
        this.updateDate();
        this.setState({ state: this.state });
    }

    dateDayHandle(e) {
        this.setState({ selDay: this.state.DateDays[e.target.value] });
        this.updateDate();
        this.setState({ state: this.state });
    }

    handleHourInput(e) {
        this.setState({ selHour: e.target.value });
        this.updateDate();
    }

    handleMinuteInput(e) {
        this.setState({ selMinute: e.target.value });
        this.updateDate();
    }

    addVisitHandle(e) {
        this.updateDate();
        this.setState({ state: this.state });
        this.addvisit();
    }

    confirmDateHandle(e) {
        this.updateDate();
        this.setState({ state: this.state });
    }

    handlePrivateInput(e) {
        if (this.state.privateNFZ == "NFZ") {
            this.setState({ privateNFZ: "Private" });
        }else {
            this.setState({ privateNFZ: "NFZ" });
        }
        console.log(this.state.privateNFZ);
    }

    updateDate(e) {
        var year = this.state.selYear.toString();
        var month = this.state.selMonth.toString();
        var day = this.state.selDay.toString();
        var hour = this.state.selHour.toString();
        var minute = this.state.selMinute.toString();
        this.setState({ selFulldate: year + "." + month + "." + day });
        this.setState({ selFulltime: hour + ":" + minute + ":00" });
        this.setState({ state: this.state });
    }

    setCurrentDate() {
        var d = new Date(Date.now()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        this.setState({selMonth: this.state.DateMonths[month - 1]});
        this.setState({ selDay: this.state.DateDays[day - 1] });
    }


    setSearchCategory(e) {
        this.setState({ searchByCategory: e.target.value });
    }

    handleSearchBy(e) {
        this.setState({ searchByField: e.target.value });
    }

    toggleSortDD() {//for sorting dropdown
        this.setState({ searchDropdownOpen: !this.state.searchDropdownOpen });
    }

    sortBy(e) {
        var id = Number(e.target.id);
        var current = Number(this.state.sortedBy);
        if (id == current || id == current - 7) {
            if (id == current) {
                this.setState({ sortedBy: id + 7 });
            } else {
                this.setState({ sortedBy: id });
            }
        } else {
            this.setState({ sortedBy: id });
        }
        this.searchByParameter();
    }

    handleSearchByButton() {
        this.searchByParameter();
    }

    handleDeleteVisit(e) {
        this.delete('/visit/VisitDelete?id=' + e.target.value, {});
        this.populateVisitData();
        Visit.renderVisitData(this, this.state.visits);
    }



    static renderVisitData(visitlist,visits) {   //patientlist is reference to our PatientList object; used to handle onClick in buttons
        return (
            <table className='table table-striped' aria-labelledby="patientstable" >
                <thead>
                    <tr>
                        <th>VisitId</th>
                        <th>PatientId</th>
                        <th>DoctorId</th>
                        <th>DoctorSpecialization</th>
                        <th>VisitDate</th>
                        <th>VisitTime</th>
                        <th>Private/NFZ</th>
                    </tr>
                </thead>
                <tbody>
                    {visits.map(visit =>
                        <tr key={visit.visitId}>
                            <td>{visit.visitId}</td>
                            <td>{visit.patientId}</td>
                            <td>{visit.doctorId}</td>
                            <td>{visit.doctorSpecialization}</td>
                            <td>{visit.visitDate}</td>
                            <td>{visit.visitTime}</td>
                            <td>{visit.visitPrivateNFZ}</td>
                            <td><Link to={"/visitedit/" + visit.visitId}><Button> EDIT</Button></Link></td>
                            <td><Button onClick={visitlist.handleDeleteVisit} value={visit.visitId}>DELETE</Button></td>
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
                : Visit.renderVisitData(this,this.state.visits);

            return (
                <div>
                    <h1>Add visit</h1>
                    <Container>
                        <Row xs="5">
                            <Col>
                                <p1>Patient ID</p1>
                            </Col>
                            <Col>
                                <p1>Surname</p1>
                            </Col>
                            <Col>
                                <p1>Name</p1>
                            </Col>
                        </Row>
                        <Row>
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
                        <Row xs="5">
                            <Col>
                                <p1>Doctor ID</p1>
                            </Col>
                            <Col>
                                <p1>Surname</p1>
                            </Col>
                            <Col>
                                <p1>Name</p1>
                            </Col>
                            <Col>
                                <p1>Specialization</p1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Dropdown isOpen={this.state.DDropdownisOpen} toggle={this.DDropdowntoggle}>
                                    <DropdownToggle>
                                        Doctor ID
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
                                        {this.doctorIdDropdown}
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col>
                                {this.state.selDName}
                            </Col>
                            <Col>
                                {this.state.selDSurname}
                            </Col>
                            <Col>
                                {this.state.selDSpecialization}
                            </Col>
                        </Row>
                        </Container>
                        <Container>
                        <Row xs="15">
                            <Col>
                                Year
                            </Col>
                            <Col>
                                Month
                            </Col>
                            <Col>
                                Day
                            </Col>
                            <Col>
                                Hours
                            </Col>
                            <Col>
                                Minutes
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        <Row xs="15">
                            <Col>
                                <Dropdown isOpen={this.state.DYearDropdownisOpen} toggle={this.DYearDropdowntoggle}>
                                    <DropdownToggle>
                                        {this.state.selYear}
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
                                        {this.dateYearDropdown}
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Dropdown isOpen={this.state.DMonthDropdownisOpen} toggle={this.DMonthDropdowntoggle}>
                                    <DropdownToggle>
                                        {this.state.selMonth}
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
                                        {this.dateMonthDropdown}
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Dropdown isOpen={this.state.DDayDropdownisOpen} toggle={this.DDayDropdowntoggle}>
                                    <DropdownToggle>
                                        {this.state.selDay}
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
                                        {this.dateDayDropdown}
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Input onChange={this.handleHourInput}></Input>
                            </Col>
                            <Col>
                                <h4>:</h4>
                            </Col>
                            <Col>
                                <Input onChange={this.handleMinuteInput}></Input>
                            </Col>
                            <Col>
                                <Label check>
                                    <Input onClick={this.handlePrivateInput} type="checkbox" />{' '}
                                     Private ?
                            </Label>
                            </Col>
                            <Col>
                                <Button onClick={this.confirmDateHandle} >Confirm Date</Button>
                            </Col>
                           
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={this.addVisitHandle} >Add</Button>
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
                                        Patient Id
                                     </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={3} type="radio" name="radio1" />{' '}
                                        Doctor Id
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={4} type="radio" name="radio1" />{' '}
                                        Doctor Specialization
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={5} type="radio" name="radio1" />{' '}
                                        Date
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={6} type="radio" name="radio1" />{' '}
                                        Time
                                    </Label>
                                    </FormGroup>
                                    <FormGroup check >
                                        <Label check>
                                            <Input onChange={this.setSearchCategory} value={7} type="radio" name="radio1" />{' '}
                                        Private/NFZ
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
                                <ButtonDropdown isOpen={this.state.searchDropdownOpen} toggle={this.toggleSortDD}>
                                    <DropdownToggle caret>
                                        Parameter
                                </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem id={0} onClick={this.sortBy}>Id</DropdownItem>
                                        <DropdownItem id={1} onClick={this.sortBy}>Patient Id</DropdownItem>
                                        <DropdownItem id={2} onClick={this.sortBy}>Doctor Id</DropdownItem>
                                        <DropdownItem id={3} onClick={this.sortBy}>Doctor Specialization</DropdownItem>
                                        <DropdownItem id={4} onClick={this.sortBy}>Date</DropdownItem>
                                        <DropdownItem id={5} onClick={this.sortBy}>Time</DropdownItem>
                                        <DropdownItem id={6} onClick={this.sortBy}>PrivateNFZ</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Col>
                        </Row>
                    </Container>
                    <h1 id="visittable" >List of registered visits</h1>
                    {contents}
                </div>
            );
        } else {
            return (<Unlogged />);
        }
    }

    addvisit(e) {
        this.post('/visit/VisitAdd', {
            VisitId:0,
            PatientId: this.state.selPId,
            DoctorId: this.state.selDId,
            DoctorSpecialization: this.state.selDSpecialization,
            VisitDate: this.state.selFulldate,
            VisitTime: this.state.selFulltime,
            visitPrivateNFZ: this.state.privateNFZ

        });
        this.populateVisitData();
        Visit.renderVisitData(this,this.state.visits);
        this.populateVisitData();
        Visit.renderVisitData(this,this.state.visits);
        this.setState({ state: this.state });
    }

    async populateVisitData() {
        const response = await fetch('visit/VisitData?sorttype=0&field=0&value=');
        const data = await response.json();
        this.setState({ visits: data, loading: false });
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

    async populateDoctorData() {
        const response = await fetch('visit/DoctorData');
        const data = await response.json();
        this.setState({ doctors: data, loading: false });
        this.state.doctors.map(doctor => {
            this.setState({ DId: this.state.DId.concat([doctor.doctorId]) });
            this.setState({ DName: this.state.DName.concat([doctor.doctorName]) });
            this.setState({ DSurname: this.state.DSurname.concat([doctor.doctorSurname]) });
            this.setState({ DSpecialization: this.state.DSpecialization.concat([doctor.doctorSpecialization]) })
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

    async searchByParameter() {
        this.setState({ loading: true });
        var sort = this.state.sortedBy;
        var field = this.state.searchByCategory;
        var value = this.state.searchByField;
        var fetchstring = 'visit/VisitData';
        var sortstring = '?sorttype=' + sort;
        var fieldstring = '&field=' + field;
        var valuestring = '&value=' + value;
        var request = fetchstring + sortstring + fieldstring + valuestring;
        console.log(request);
        const response = await fetch(request);
        const data = await response.json();
        this.setState({ visits: data, loading: false });
    }
}
