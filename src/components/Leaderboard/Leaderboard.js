import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner"
import Jumbotron from "react-bootstrap/Jumbotron"


const Leaderboard = (props) => {
    const [show, setShow] = useState(false)
    const [scores, setScores] = useState([])

    useEffect(async () => {
        if (props.fetched) {
            setScores([])
            console.log(props.data)
                props.data.forEach((doc) => {
                    var data = doc.data()
                    var name = data.Name
                    console.log(name)
                    var score = parseFloat(data.Average)
                    console.log(score)          
                    var currentScores = scores
                    if (!Number.isNaN(score) && !currentScores.includes([name, score])){
                        currentScores.push([name, score])
                    } else {
                        currentScores.push([name, 0])
                    }
                    setScores(currentScores.sort((a, b) => b[1] - a[1]))
                    console.log("updated scores: " + scores)          
                })
                if (scores.length > 10){
                    setScores(scores.slice(0, 10))
                }
                console.log("updated scores: " + scores)          
            console.log(scores)
            setShow(true)
        }
    }, [props.fetched])

    var components = []
    var place = 1
    scores.forEach((userScore) => {
        components.push(
            <tr>
                <td>{place}</td>
                <td>{userScore[0].split(" ")[0]}</td>
                <td>{userScore[0].split(" ")[1]}</td>
                <td>{userScore[1]}</td>
            </tr>
        )
        place += 1
    })
    if (show && props.fetched){
        return (
            <div className="leaderboard">
                <Jumbotron className = "jumbo">
                    <h1>FBLA Expert</h1>
                    <h4>Leaderboard</h4>
                </Jumbotron>
                
                <div  id = "leaderboard">
                    <Table striped hover responsive = "md" variant="light">
                        <thead className="table-heading">
                            <tr>
                            <th>Place</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Average Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {components}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    } else {
        return (
            <div className = "loading-screen">
            <h1>Loading...</h1>
            <Spinner animation="border" variant="light" />
            </div>
        )
    }
}


export default Leaderboard;