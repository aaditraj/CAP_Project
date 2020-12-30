import logo from './logo.svg';
import './App.css';
import firebase from "firebase";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";

function App() {
  const firebaseApp = firebase.apps[0];
  // const db = firebaseApp.firestore();
  // var docRef = db.collection("testCollection").doc("testDoc");
  // var data;

  // docRef.get().then(function(doc) {
  //     if (doc.exists) {
  //         data = doc.data(); 
  //     } else {
  //         // doc.data() will be undefined in this case
  //         data = "Not a document!";
  //     }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });
  return (
    <div className="App">
      <header>
      <h1>React & Firebase</h1>
      <h2>By Aaditya Raj</h2>
      </header>
      
      <h6>CONFIG DETAILS</h6>
      <code>
        <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
      </code>
      
      {/* Bootstrap experimentation */}
      <Jumbotron>
       <h1>Hello World!</h1>
       <p>First Jumbotron!</p>
       <Button variant = "danger">DANGER!</Button>
      </Jumbotron>
    </div>
  );
}

export default App;
