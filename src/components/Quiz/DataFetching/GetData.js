import firebase from 'firebase';

//this function gets the question data from the database and passes it for display
export default async function GetData(props) {  
    var state = props;
    var questionData = new Map();
    var selection = state.selection
    let firebaseApp= firebase.apps[0];
    let db = firebaseApp.firestore();

    //pick a random question index from the database for each question type
    let multChoiceQuestions = db.collection("MultipleChoice").doc(selection).collection("Questions")
    var snap = await multChoiceQuestions.get()
    let multChosen = Math.floor(Math.random() * snap.size) + 1
    let multRef = db.collection("MultipleChoice").doc(selection).collection("Questions").doc("" + multChosen);
    
    let multChosen2 = Math.floor(Math.random() * snap.size) + 1
    while (multChosen2 === multChosen){
      multChosen2 = Math.floor(Math.random() * snap.size) + 1
    }
    let multRef2 = db.collection("MultipleChoice").doc(selection).collection("Questions").doc("" + multChosen2);


    let trueFalseQuestions = db.collection("TrueFalse").doc(selection).collection("Questions")
    var snap = await trueFalseQuestions.get()
    let trueFalseRef = db.collection("TrueFalse").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap.size) + 1));
    
    let fillBlankQuestions = db.collection("FillInTheBlank").doc(selection).collection("Questions")
    snap = await fillBlankQuestions.get()
    let fillBlankRef = db.collection("FillInTheBlank").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap.size) + 1));
 
    let dropdownQuestions = db.collection("DropDown").doc(selection).collection("Questions")
    snap = await dropdownQuestions.get()
    let dropdownRef = db.collection("DropDown").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap.size) + 1));

    //wait for the data
    let [multipleChoice, multipleChoice2, dropdown, trueFalse, fillInTheBlank] = await Promise.all([multRef.get(), multRef2.get(), dropdownRef.get(), trueFalseRef.get(), fillBlankRef.get()])

    //For each question, return the data of the question document for checking against
    //user's submitted answers later, and return the question and choices for display.
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
      state.fetched = true;
    }

    // var index = 1;
    // await db.collection("DropDown").get().then((querySnapshot) => {
      
    //   querySnapshot.forEach((doc) => {
    //     if(!isNaN(doc.id)){
    //       var documentData = doc.data()
    //       console.log(documentData)
    //       db.collection("DropDown").doc("Potpourri").collection("Questions").doc("" + index).set({
    //         Answer: documentData.Answer,
    //         Question: documentData.Question,
    //         Choices: documentData.Choices
    //       })
    //       index += 1
    //     }
        
    //   })

    // })

    // index = 1
    // await db.collection("FillInTheBlank").get().then((querySnapshot) => {
      
    //   querySnapshot.forEach((doc) => {
    //     console.log('hi')
    //     if(!isNaN(doc.id)){
    //       var documentData = doc.data()
    //       console.log(documentData)
    //       db.collection("FillInTheBlank").doc("Potpourri").collection("Questions").doc("" + index).set({
    //         Answer: documentData.Answer,
    //         Question: documentData.Question,
    //       })
    //       index += 1
    //     }
        
    //   })

    // })

    // index = 1
    // await db.collection("MultipleChoice").get().then((querySnapshot) => {
      
    //   querySnapshot.forEach((doc) => {
    //     if(!isNaN(doc.id)){
    //       var documentData = doc.data()
    //       console.log(documentData)
    //       db.collection("MultipleChoice").doc("Potpourri").collection("Questions").doc("" + index).set({
    //         Answer: documentData.Answer,
    //         Question: documentData.Question,
    //         Choices: documentData.Choices
    //       })
    //       index += 1
    //     }
        
    //   })

    // })

    // index = 1
    // await db.collection("TrueFalse").get().then((querySnapshot) => {
      
    //   querySnapshot.forEach((doc) => {
    //     if(!isNaN(doc.id)){
    //       var documentData = doc.data()
    //       console.log(documentData)
    //       db.collection("TrueFalse").doc("Potpourri").collection("Questions").doc("" + index).set({
    //         Answer: documentData.Answer,
    //         Question: documentData.Question,
    //       })
    //       index += 1
    //     }
        
    //   })

    // })
    // index = 1;
    // await db.collection("DropDown").where("Topic", "==", "Know Your Numbers").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     var documentData = doc.data()
    //     console.log(documentData)
    //     db.collection("DropDown").doc("Know Your Numbers").collection("Questions").doc("" + index).set({
    //       Answer: documentData.Answer,
    //       Question: documentData.Question,
    //       Choices: documentData.Choices
    //     })
    //     index += 1
    //   })
    // })

    // index = 1;

    // await db.collection("DropDown").where("Topic", "==", "People").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     var documentData = doc.data()
    //     console.log(documentData)
    //     db.collection("DropDown").doc("People").collection("Questions").doc("" + index).set({
    //       Answer: documentData.Answer,
    //       Question: documentData.Question,
    //       Choices: documentData.Choices
    //     })
    //     index += 1
    //   })
    // })
    // index = 1;

    // await db.collection("DropDown").where("Topic", "==", "Places").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     var documentData = doc.data()
    //     console.log(documentData)
    //     db.collection("DropDown").doc("Places").collection("Questions").doc("" + index).set({
    //       Answer: documentData.Answer,
    //       Question: documentData.Question,
    //       Choices: documentData.Choices
    //     })
    //     index += 1
    //   })
    // })
    // index = 1;

    // await db.collection("DropDown").where("Topic", "==", "Potpourri").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     var documentData = doc.data()
    //     console.log(documentData)
    //     db.collection("DropDown").doc("Potpourri").collection("Questions").doc("" + index).set({
    //       Answer: documentData.Answer,
    //       Question: documentData.Question,
    //       Choices: documentData.Choices
    //     })
    //     index += 1
    //   })
    // })
    // index = 1;

    // await db.collection("DropDown").where("Topic", "==", "Terms, Creeds, Mottos").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     var documentData = doc.data()
    //     console.log(documentData)
    //     db.collection("DropDown").doc("Terms, Creeds, Mottos").collection("Questions").doc("" + index).set({
    //       Answer: documentData.Answer,
    //       Question: documentData.Question,
    //       Choices: documentData.Choices
    //     })
    //     index += 1
    //   })
    // })

    console.log(state, questionData)
    return (
      [state, questionData]
    )
  }

