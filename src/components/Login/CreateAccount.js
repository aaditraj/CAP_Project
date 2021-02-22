import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const WriteNewUserData = (firstName, lastName, email) => {
    this.writeUserRef = firebase.apps[0].firestore().collection("UserData").doc()
    this.writeUserRef.set({
    Name: firstName + " " + lastName,
    Email: email,
    Scores: [],
    Highest_Score: null,
    Lowest_Score: null,
    Average: null
    })
}

export default WriteNewUserData;