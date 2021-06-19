import React from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner"
import Jumbotron from "react-bootstrap/Jumbotron"
// import "./Leaderboard.css";



class Leaderboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            show: false,
            scores: []
        }
    }
    
    updateScores = async () => {
        // console.log(this.props.data)
        this.setState({
            scores: []
        })
        // var firebaseApp = firebase.apps[0]
        // var db = firebaseApp.firestore()
        // var userData = db.collection("UserData")
        // console.log("I am updating the scores :)")
        // await userData.get().then((querySnapshot) => {
        //     console.log("Fetched the user data!")
        console.log(this.props.data)
            this.props.data.forEach((doc) => {
                var data = doc.data()
                var name = data.Name
                console.log(name)
                var score = parseFloat(data.Average)
                console.log(score)          
                var currentScores = this.state.scores
                if (!Number.isNaN(score) && !currentScores.includes([name, score])){
                    currentScores.push([name, score])
                } else {
                    currentScores.push([name, 0])
                }
                this.setState({
                    scores: currentScores.sort((a, b) => b[1] - a[1])
                })
                console.log("updated scores: " + this.state.scores)          
            })
            if (this.state.scores.length > 10){
                this.setState({
                    scores: this.state.scores.slice(0, 10)
                })
            }
            console.log("updated scores: " + this.state.scores)          
        // })
        console.log(this.state.scores)
        this.setState({
            show: true
        })

    }
    async componentDidMount() {
        if(this.props.fetched){ this.updateScores()}
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fetched !== this.props.fetched){
            this.updateScores()
        }
    }

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.data !== this.props.data) {
    //         return true;
    //         } else {
    //         return false;
    //     }
        
    //   }

    // componentDidUpdate(){
    //     // var firebaseApp = firebase.apps[0]
    //     // var db = firebaseApp.firestore()
    //     // var userData = db.collection("UserData")
    //    this.updateScores()
       
    // }


    render() {
        var components = []
        var place = 1
        this.state.scores.forEach((userScore) => {
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
        if (this.state.show && this.props.fetched){
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
}


export default Leaderboard;