import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
// <NavMenu />
//{this.props.children}
export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <Container fluid={true}>
                    <Row>
                        <Col xs="2"><NavMenu /></Col>
                        <Col>{this.props.children}</Col>
                    </Row>
                    <Row>
                        <Col xs="1"><Footer /></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
