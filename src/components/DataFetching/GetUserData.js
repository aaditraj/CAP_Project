import firebase from "firebase/app";
import "firebase/firestore";

const GetUserData = async () => {
    var db = firebase.apps[0].firestore()
    var readUserRef = db.collection("UserData").where(
    "Email", "==", firebase.auth().currentUser.email)
    var userData, writeUserRef;
    await readUserRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        userData = doc.data();
        writeUserRef = db.collection("UserData").doc(doc.id)
        })
        // this.setState({
        // logged_in: true,
        // take_quiz: true
        // })
    })
    return (
        [userData, writeUserRef]
    )
}

export default GetUserData;