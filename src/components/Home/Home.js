import React from "react"
import {
    Link
  } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button"

class Home extends React.Component {
    
    componentDidMount(){
        window.scrollTo(0, 0)
    }
    
    render() {
        let components = [];
        let topics = ["Know Your Numbers", "Dates and Times", "People", "Places", "Terms, Creeds, Mottos", "Potpourri"]
        for (let index = 0; index < topics.length; index++) {
            var path = "/" + topics[index]
            components.push(
                <div className="topic-container">
                    <div className="topic-image" id={topics[index].split(" ")[0]}>
                    <Button className="middle" as={Link} to={path}>{topics[index]}</Button>
                    </div>
                </div>
            )   
        }
        return (
            <div>
                <Jumbotron className = "jumbo">
                    <h1>FBLA Expert</h1>
                    <h4>Choose a Quiz Topic Below!</h4>
                </Jumbotron>
                <div id="Choose-Topics">

                    <div className="topics-wrapper">
                        {components}
                    </div>
                    

                </div>
            </div>
        )
    }
}

export default Home;