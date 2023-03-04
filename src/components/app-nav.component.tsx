import React, {useEffect, useState} from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";

type AppNavProps = {
    setModalShow: Function
}
export default function AppNav(props: AppNavProps) {

    return (
        <Navbar bg="primary" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand href="#home">Library Management System</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => props.setModalShow(true)}>Add Book</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )

}