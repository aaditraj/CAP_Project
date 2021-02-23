import firebase from 'firebase';

export default async function GetData(props) {  
    let state = props;
    let questionData = new Map();
    let firebaseApp= firebase.apps[0];
    let db = firebaseApp.firestore();
    let multChosen = Math.floor(Math.random() * 20);
    let multRef = db.collection("MultipleChoice").doc("" + multChosen);
    let multChosen2 = Math.floor(Math.random() * 20);
    while (multChosen2 === multChosen){
      multChosen2 = Math.floor(Math.random() * 20)
    }
    let multRef2 = db.collection("MultipleChoice").doc("" + multChosen2);
    let dropdownRef = db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)));
    let trueFalseRef = db.collection("TrueFalse").doc( "" + Math.floor((Math.random() * 10)));
    let fillBlankRef = db.collection("FillInTheBlank").doc("" + Math.floor((Math.random() * 10)))

    let multipleChoice = await multRef.get()
    let multipleChoice2 = await multRef2.get()
    let dropdown = await dropdownRef.get()
    let trueFalse = await trueFalseRef.get()
    let fillInTheBlank = await fillBlankRef.get()

    
    if (multipleChoice.exists){
      questionData.set('multipleChoice', multipleChoice.data());
      state.multChoices1 = multipleChoice.data().Choices
      state.multQuestion1 = multipleChoice.data().Question
    }
    if (multipleChoice2.exists){
      questionData.set('multipleChoice2', multipleChoice2.data());
      state.multChoices2 = multipleChoice2.data().Choices
      state.multQuestion2 = multipleChoice2.data().Question
    }
    if (dropdown.exists){
      questionData.set('dropdown', dropdown.data());
      state.dropdownChoices = dropdown.data().Choices
      state.dropdownQuestion = dropdown.data().Question
    }
    if (trueFalse.exists){
      questionData.set('trueFalse', trueFalse.data());
      state.trueFalseQuestion = trueFalse.data().Question
    }
    if (fillInTheBlank.exists){
      questionData.set('fillInTheBlank', fillInTheBlank.data());
      state.fillBlankQuestion = fillInTheBlank.data().Question
      state.fetched = true
    }
    // await multRef.get().then(async (doc) => {
    //   if (doc.exists) {
    //     data.push(doc.data())
    //     state.multChoices1 = doc.data().Choices
    //     state.multQuestion1 = doc.data().Question
    //     await multRef2.get().then(async (doc) => {
    //       if (doc.exists) {
    //         data.push(doc.data())
    //         state.multChoices2 = doc.data().Choices,
    //         state.multQuestion2 = doc.data().Question
    //         await dropdownRef.get().then(async (doc) => {
    //           if (doc.exists) {
    //               data.push(doc.data())
    //               state.dropdownChoices = doc.data().Choices
    //               state.dropdownQuestion = doc.data().Question
    //             await trueFalseRef.get().then(async (doc) => {
    //               if (doc.exists) {
    //                 data.push(doc.data())
    //                 state.trueFalseQuestion = doc.data().Question

    //                 await fillBlankRef.get().then(async (doc) => {
    //                   if (doc.exists) {
    //                     data.push(doc.data())
    //                     state.fetched = true,
    //                     state.fillBlankQuestion = doc.data().Question
    //                   }
    //                 }).catch(function(error){
    //                   console.log("Error getting document:", error)
    //                 })
    //               }
    //             }).catch(function(error) {
    //               console.log("Error getting document:", error)
    //             })
    //           }
    //         }).catch(function(error) {
    //           console.log("Error getting document:", error);
    //         });
    //       }
    //     }).catch(function(error) {
    //       console.log("Error getting document:", error)
    //     })
    //   }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // }); 
    console.log(state)
    console.log(questionData)
    return (
      [state,
      questionData]
    )

  }

