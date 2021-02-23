import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const WriteNewUserData = (firstName, lastName, email, callback) => {
    firebase.apps[0].firestore().collection("UserData").where("Email", "==", email)
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.empty){
            var writeUserRef = firebase.apps[0].firestore().collection("UserData").doc()
            writeUserRef.set({
            Name: firstName + " " + lastName,
            Email: email,
            Scores: [],
            Highest_Score: null,
            Lowest_Score: null,
            Average: null
            })
        }
        callback()
    })
}

export default WriteNewUserData;