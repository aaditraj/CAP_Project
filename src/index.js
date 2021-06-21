import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import AppTest from './App-test.js';
import firebase from "firebase/app";
import configData from "./config.json"


// firebase.initializeApp({
//   apiKey: "AIzaSyD_dxaZ75fz-C96Lq1MoziqerFGTJbQC6k",
//   authDomain: "cap-project-86c79.firebaseapp.com",
//   projectId: "cap-project-86c79",
//   storageBucket: "cap-project-86c79.appspot.com",
//   messagingSenderId: "308193142608",
//   appId: "1:308193142608:web:f35982c86c92ea8296ae55",
//   measurementId: "G-1RW0FRKMTR"
// })

firebase.initializeApp({
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  projectId: configData.projectId,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
  appId: configData.appId,
  measurementId: configData.measurementId
})


ReactDOM.render(
  <React.StrictMode>
      <AppTest />
  </React.StrictMode>,
  document.getElementById('root')
);

// const moveDocuments = async() => {
//   var index = 1;
//   var db = firebase.apps[0].firestore()
//   await db.collection("TrueFalse").where("Topic", "==", "Dates/Times").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       var documentData = doc.data()
//       console.log(documentData)
//       db.collection("TrueFalse").doc("Dates and Times").doc(index).set({
//         Answer: documentData.Answer,
//         Question: documentData.Question,
//       })
//       index += 1
//     })
//   })
// }

// moveDocuments()

// export const copyDoc = async (
//   collectionFrom,
//   docId,
//   collectionTo,
//   addData,
//   recursive = false;
// ): Promise<boolean> => {
//   // document reference
//   const docRef = admin.firestore().collection(collectionFrom).doc(docId);

//   // copy the document
//   const docData = await docRef
//     .get()
//     .then((doc) => doc.exists && doc.data())
//     .catch((error) => {
//       console.error('Error reading document', `${collectionFrom}/${docId}`, JSON.stringify(error));
//       throw new functions.https.HttpsError('not-found', 'Copying document was not read');
//     });

//   if (docData) {
//     // document exists, create the new item
//     await admin
//       .firestore()
//       .collection(collectionTo)
//       .doc(docId)
//       .set({ ...docData, ...addData })
//       .catch((error) => {
//         console.error('Error creating document', `${collectionTo}/${docId}`, JSON.stringify(error));
//         throw new functions.https.HttpsError(
//           'data-loss',
//           'Data was not copied properly to the target collection, please try again.',
//         );
//       });

//     // if copying of the subcollections is needed
//     if (recursive) {
//       // subcollections
//       const subcollections = await docRef.listCollections();
//       for await (const subcollectionRef of subcollections) {
//         const subcollectionPath = `${collectionFrom}/${docId}/${subcollectionRef.id}`;

//         // get all the documents in the collection
//         return await subcollectionRef
//           .get()
//           .then(async (snapshot) => {
//             const docs = snapshot.docs;
//             for await (const doc of docs) {
//               await copyDoc(subcollectionPath, doc.id, `${collectionTo}/${docId}/${subcollectionRef.id}`, true);
//             }
//             return true;
//           })
//           .catch((error) => {
//             console.error('Error reading subcollection', subcollectionPath, JSON.stringify(error));
//             throw new functions.https.HttpsError(
//               'data-loss',
//               'Data was not copied properly to the target collection, please try again.',
//             );
//           });
//       }
//     }
//     return true;
//   }
//   return false;
// };
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
