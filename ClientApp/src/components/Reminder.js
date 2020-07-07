import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { Unlogged } from './Unlogged';


export class Reminder extends Component {
    static displayName = Reminder.name;

    constructor(props) {
        super(props);
        this.state = {
            visits: [],
            patients: [],
            doctors: [],
            VId: [],
            PId: [],
            PName: [],
            PSurname: [],
            PMail:[],
            DId: [],
            DName: [],
            DSurname: [],
            VDate: []
        };
        this.handleSendButton = this.handleSendButton.bind(this);
    }

    componentDidMount() {
        this.populateVisitData();
        NavMenu.refreshSession();
        
    }

    componentDidUpdate() {
        NavMenu.refreshSession();
    }

    handleSendButton(e) {
        this.sendReminders(this.state.visits,this.state.patients,this.state.doctors);
    }

    sendReminders(visits,patients,doctors) {
        for (var i = 0; i < visits.length; i++) {
            var findMail;
            var findPName;
            var findPSurname;
            var findDName;
            var findDSurname;
            var findPId = visits[i].patientId;
            var findDId = visits[i].doctorId;
            for (var j = 0; j < patients.length; j++) {
                if (patients[j].patientId == findPId) {
                    findMail = patients[j].patientMail;
                    findPName = patients[j].patientName;
                    findPSurname = patients[j].patientSurname;
                }
            }
            for (var j = 0; j < doctors.length ; j++) {
                if (doctors[j].doctorId== findDId) {
                    findDName = doctors[j].doctorName;
                    findDSurname = doctors[j].doctorSurname;
                }
            }
            var postPatient = "&pname="+findPName+"&psurname="+findPSurname;
            var postDoctor = "&dname=" + findDName + "&dsurname=" + findDSurname;
            this.post("/visitreminder/Send?pmail=" + findMail + postPatient + postDoctor, this.state.visits[i]);
        }
    }

    render() {
        if (NavMenu.logged == true) {
            return (
                <div>
                    <h1>Send reminders</h1>
                    <p>Please click <Button onClick={this.handleSendButton}>SEND</Button> to send reminders about their visits to all patients.</p>
                </div>
            );
        } else {
            return (<Unlogged/>);
        }
    }

    mapVisits(visits) {
        visits.map(visit => {
            this.setState({ VId: this.state.VId.concat([visit.visitId]) })
            this.setState({ PId: this.state.PId.concat([visit.patientId]) })
            this.setState({ PName: this.state.PName.concat([visit.patientName]) })
            this.setState({ PSurname: this.state.PSurname.concat([visit.patientSurname]) })
            this.setState({ DId: this.state.DId.concat([visit.doctorId]) })
            this.setState({ DName: this.state.DName.concat([visit.doctorName]) })
            this.setState({ DSurname: this.state.DSurname.concat([visit.doctorSurname]) })
            this.setState({ VDate: this.state.VDate.concat([visit.visitDate]) })
        });
    }

    async populatePatientData() {
        const response = await fetch('patient/PatientData?sorttype=0&field=0&value=');
        const data = await response.json();
        this.setState({ patients: data});
        this.state.patients.map(patient => {
            this.setState({ PMail: this.state.PMail.concat([patient.patientMail]) });
        });
        this.populateDoctorData();
    }

    async populateDoctorData() {
        const response = await fetch('visit/DoctorData');
        const data = await response.json();
        this.setState({ doctors: data });
    }

    async populateVisitData() {
        const response = await fetch('visit/VisitData?sorttype=0&field=0&value=');
        const data = await response.json();
        this.setState({ visits: data });
        this.mapVisits(this.state.visits);
        this.populatePatientData();
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
}