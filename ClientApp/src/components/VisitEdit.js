import React, { Component, useState, Redirect } from 'react';
import { Container, Col, Row, InputGroup, InputGroupAddon, Input, Button, Dropdown, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';


export class VisitEdit extends Component {
    static displayName = VisitEdit.name;


    constructor(props) {
        super(props);
        this.state = {
            DId: [],
            DSpecialization:[],
            DName: [],
            DSurname: [],
            PId: [],
            PName: [],
            PSurname: [],
            visits: [],
            patients: [],
            doctors: [],
            currentVId: 0,
            currentPId: 0,
            currentDId: 0,
            currentDSpecialization: "",
            currentPName: "",
            currentDName: "",
            currentPSurname: "",
            currentDSurname: "",
            Date: "",
            Time: "",
            PrivateNFZ: "",
            PrivateBool:true,
            DateYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
            DateMonths: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            DateDays: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            selYear: "2020",
            selMonth: "01",
            selDay: "01",
            selHour: "12",
            selMinute: "00",
            selFulldate: "2020-05-04",
            selFulltime: "12:00:00",
            PDropdownisOpen: false,
            DDropdownisOpen: false,
            DYearDropdownisOpen: false,
            DMonthDropdownisOpen: false,
            DDayDropdownisOpen: false,
            Unconfirmed: true,
            Changed: false,
            loading:true
        };
        this.PDropdowntoggle = this.PDropdowntoggle.bind(this);
        this.DDropdowntoggle = this.DDropdowntoggle.bind(this);
        this.doctorIdDropdown = this.doctorIdDropdown.bind(this);
        this.patientIdDropdown = this.patientIdDropdown.bind(this);

        this.DYearDropdowntoggle = this.DYearDropdowntoggle.bind(this);
        this.DMonthDropdowntoggle = this.DMonthDropdowntoggle.bind(this);
        this.DDayDropdowntoggle = this.DDayDropdowntoggle.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.dateYearDropdown = this.dateYearDropdown.bind(this);
        this.dateMonthDropdown = this.dateMonthDropdown.bind(this);
        this.dateDayDropdown = this.dateDayDropdown.bind(this);
        this.handleHourInput = this.handleHourInput.bind(this);
        this.handleMinuteInput = this.handleMinuteInput.bind(this);
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.handleChangeButton = this.handleChangeButton.bind(this);

        this.updateVisit = this.updateVisit.bind(this);
        this.refreshVisitData = this.refreshVisitData.bind(this);

        this.radioInput = this.radioInput.bind(this);


    }

    componentDidMount() {
        this.parseDate();
        this.populatePatientData();
        this.populateDoctorData();
        this.populateVisitData();
        NavMenu.refreshSession();

    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    mapVisits(visitedit, visits) {
        visits.map(visit => {
            this.setState({
                currentVId: this.props.match.params.id,
                currentPId: visit.patientId,
                currentDId: visit.doctorId,
                Date: visit.visitDate,
                Time: visit.visitTime,
                PrivateNFZ: visit.visitPrivateNFZ
            })
        });
        for (var i = 0; i < visitedit.state.PId.length; i++) {
            if (visitedit.state.PId[i] == visitedit.state.currentPId) {
                visitedit.state.currentPName = visitedit.state.PName[i];
                visitedit.state.currentPSurname = visitedit.state.PSurname[i];
            }
        }
        for (var i = 0; i < visitedit.state.DId.length; i++) {
            if (visitedit.state.DId[i] == visitedit.state.currentDId) {
                visitedit.state.currentDName = visitedit.state.DName[i];
                visitedit.state.currentDSurname = visitedit.state.DSurname[i];
                visitedit.state.currentDSpecialization = visitedit.state.DSpecialization[i];
            }
        }
        console.log(visitedit.state.PrivateNFZ);
        if (visitedit.state.PrivateNFZ == "Private") {
            visitedit.setState({ PrivateBool: true });
        } else {
            visitedit.setState({ PrivateBool: false });
        }
    }

    refreshState(e) {
        this.setState({ state: this.state });
    }

    PDropdowntoggle(e) {//for sorting dropdown
        this.setState({ PDropdownisOpen: !this.state.PDropdownisOpen });
    }

    DDropdowntoggle(e) {//for sorting dropdown
        this.setState({ DDropdownisOpen: !this.state.DDropdownisOpen });
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

    patientIdHandle(e) {
        this.setState({ currentPId: this.state.PId[e.target.value] });
        this.setState({ currentPName: this.state.PName[e.target.value] });
        this.setState({ currentPSurname: this.state.PSurname[e.target.value] });
    }
    doctorIdHandle(e) {
        this.setState({ currentDId: this.state.DId[e.target.value] });
        this.setState({ currentDName: this.state.DName[e.target.value] });
        this.setState({ currentDSurname: this.state.DSurname[e.target.value] });
        this.setState({ currentDSpecialization: this.state.DSpecialization[e.target.value] });
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
        this.refreshState();
    }

    handleMinuteInput(e) {
        this.setState({ selMinute: e.target.value });
        this.updateDate();
        this.refreshState();
    }

    handleConfirmButton(e) {
        this.setState({ Unconfirmed: false });
        this.updateDate();
        this.refreshState();
    }

    handleChangeButton(e) {
        this.updateVisit();
    }

    radioInput(e) {
        if (e.target.value == 1) {
            this.setState({ PrivateNFZ: "Private" });
            this.setState({ PrivateBool: true });
        } else {
            this.setState({ PrivateNFZ: "NFZ" });
            this.setState({ PrivateBool: false });
        }
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

    parseDate(e) {
        var date = this.state.Date;
        var time = this.state.Time;
        var datesplit = date.split('.');
        var day = datesplit[0];
        var month = datesplit[1];
        var year = datesplit[2];
        var timesplit = time.split(':');
        var hour = timesplit[0];
        var minutes = timesplit[1];
        this.setState({
            selYear: year,
            selMonth: month,
            selDay: day,
            selHour: hour,
            selMinute: minutes
        })
    }

    render() {
        if (NavMenu.logged == true) {
            let changemessage = this.state.Changed ? <h2>Patient data sucessfuly changed !</h2> : <h2></h2>;
            return (
                
                <div>
                    {changemessage}
                    <h1>Edit selected visit with id {this.state.currentVId}</h1>
                        <Container>
                            <Row xs="5">
                                <Col>
                                    <p1>Patient ID</p1>
                                </Col>
                                <Col>
                                    <p1>Name</p1>
                                </Col>
                                <Col>
                                    <p1>Surname</p1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Dropdown isOpen={this.state.PDropdownisOpen} toggle={this.PDropdowntoggle}>
                                        <DropdownToggle>
                                        Patient ID {this.state.currentPId}
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
                                    <h3>{this.state.currentPName}</h3>
                                </Col>
                                <Col>
                                    <h3>{this.state.currentPSurname}</h3>
                                </Col>
                            </Row>
                            <Row xs="5">
                                <Col>
                                    <p1>Doctor ID</p1>
                                </Col>
                                <Col>
                                    <p1>Name</p1>
                                </Col>
                                <Col>
                                    <p1>Surname</p1>
                                </Col>
                                <Col>
                                    <p1>Specialization</p1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Dropdown isOpen={this.state.DDropdownisOpen} toggle={this.DDropdowntoggle}>
                                        <DropdownToggle>
                                        Doctor ID {this.state.currentDId}
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
                                    <h3>{this.state.currentDName}</h3>
                                </Col>
                                <Col>
                                    <h3>{this.state.currentDSurname}</h3>
                                 </Col>
                                 <Col>
                                     <h3>{this.state.currentDSpecialization}</h3>
                                 </Col>
                            </Row>
                            <Row>
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
                                <Input value={this.state.selHour} onChange={this.handleHourInput}></Input>
                            </Col>
                            <Col>
                                <h4>:</h4>
                            </Col>
                            <Col>
                                <Input value={this.state.selMinute} onChange={this.handleMinuteInput}></Input>
                            </Col>
                            <Col>
                                <Button onClick={this.handleConfirmButton}>Confirm Date</Button>
                            </Col>
                        </Row>
                        <Row>
                                    <Col sm={10}>
                                        <FormGroup check>
                                            <Label check>
                                        <Input checked={this.state.PrivateBool == true} onChange={this.radioInput} value={1} type="radio" name="radio2" />{' '}
                                                     Private
                                             </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                        <Input checked={this.state.PrivateBool == false} onChange={this.radioInput} value={2} type="radio" name="radio2" />{' '}
                                                     NFZ
                                             </Label>
                                    </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={this.handleChangeButton} disabled={this.state.Unconfirmed}>Confirm Changes</Button>
                            </Col>
                            <Col>
                                    <Link to="/visits"><Button>BACK</Button></Link>
                            </Col>
                        </Row>
                        </Container>
                </div>
            );
        } else {
            return (<Unlogged />);
        }
    }

    refreshVisitData(e) {
        this.setState({ loading: true });
        this.populateVisitData();
    }

    async populateVisitData() {
        var fetchstring = 'visit/VisitData?sorttype=0&field=1&value=';
        var fetchvalue = this.props.match.params.id;
        var request = fetchstring + fetchvalue;
        const response = await fetch(request);
        const data = await response.json();
        this.setState({ visits: data });
        this.mapVisits(this,this.state.visits);
        this.setState({ loading: false });
        this.parseDate();
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

    updateVisit(e) {
        this.post('/visit/VisitUpdate', {
            VisitId: Number(this.state.currentVId),
            PatientId: Number(this.state.currentPId),
            DoctorId: Number(this.state.currentDId),
            DoctorSpecialization: this.state.currentDSpecialization,
            VisitDate: this.state.selFulldate,
            VisitTime: this.state.selFulltime,
            VisitPrivateNFZ: this.state.PrivateNFZ

        });
        this.setState({ Changed: true });
        this.refreshVisitData();
    }
}