import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

const showPastQuizzes = () =>{

        var currentUserEmail = firebase.auth().currentUser.email
        var storage = firebase.storage()
        var pathRef = storage.ref().child(`Results/${currentUserEmail}`)
        pathRef.listAll().then((res) => {
            res.items.forEach((itemRef) => {
                console.log(itemRef)
                itemRef.getMetadata().then((metaData) => {
                    console.log(metaData.timeCreated, metaData.Score, metaData.Topic)
                })
            })
        })
}

export default showPastQuizzes;