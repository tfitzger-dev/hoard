import React from 'react';
import {Container, FormSelect, Nav, Navbar} from "react-bootstrap";

type AppNavProps = {
    theme: string,
    setModalShow: Function,
    setTheme: Function;
}
export default function AppNav(props: AppNavProps) {

    const handleThemeChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        props.setTheme(event.target.value.toLowerCase())
    }

    return (
        <Navbar bg="primary" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand href="#home">The Horde</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => props.setModalShow(true)}>Add Book</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Item>
                        <FormSelect onChange={handleThemeChange}>
                            {["Cerulean","Cosmo","Cyborg","Darkly","Flatly","Journal","Litera","Lumen","Lux","Materia","Minty","Morph","Pulse","Quartz","Sandstone","Simplex","Sketchy","Slate","Solar","Spacelab","Superhero","United","Vapor","Yeti","Zephyr"].map((theme:string, idx:number) => (
                                <option key={idx} value={theme.toLowerCase()} selected={props.theme === theme.toLowerCase()}>{theme}</option>
                            ))}
                        </FormSelect>

                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    )

}