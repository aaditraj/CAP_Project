import React from "react"
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image"
import fblaLogo from "../assets/fbla-logo.png"
import cafblaLogo from "../assets/cafbla-logo.png"
import hhsfblaLogo from "../assets/hhsfbla-logo.jpg"

const Footer = () => {
    return (
        <footer>
            <Card className="app-footer">
                <Card.Header><h4>Learn More About FBLA</h4></Card.Header>
                <Card.Body className="card-body">
                <div id="fbla-links">
                <a target="_blank" href="https://www.fbla-pbl.org/about/">
                    <Image src={fblaLogo}/>
                </a>
                <a target="_blank" href="https://www.cafbla.org/domain/10">
                    <Image src={cafblaLogo}/>
                </a>
                <a target="_blank" href="https://www.hhsfbla.com">
                    <Image src={hhsfblaLogo}/>
                </a>
                </div>
                </Card.Body>
                <Card.Footer>© 2021 - Aaditya Raj</Card.Footer>
            </Card>
        </footer>
    )
}

export default Footer;