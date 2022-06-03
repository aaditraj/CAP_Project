import firebase from 'firebase';

//this function gets the question data from the database and passes it for display
export default async function GetData(selected, multChoiceNo, dropdownNo, fillBlankNo, trueFalseNo) {  
    // var questionData = new Map();
    let fetchedData = false
    let selection = selected
    let firebaseApp= firebase.apps[0];
    let db = firebaseApp.firestore();

    //pick a random question index from the database for each question type
    let multChoiceInfo = db.collection("MultipleChoice").doc("collectionInfo").collection("Topics").doc(selection)
    let trueFalseInfo = db.collection("TrueFalse").doc("collectionInfo").collection("Topics").doc(selection)
    let fillBlankInfo = db.collection("FillInTheBlank").doc("collectionInfo").collection("Topics").doc(selection)
    let dropdownInfo = db.collection("DropDown").doc("collectionInfo").collection("Topics").doc(selection)


    let [snap, snap2, snap3, snap4] = await Promise.all([multChoiceInfo.get(), dropdownInfo.get(),  
      fillBlankInfo.get(), trueFalseInfo.get(),])
    
    let chosen = []
    let allRefs = []

    for (let i = 0; i < multChoiceNo; i++){
      let multChosen = Math.floor(Math.random() * snap.data().NoQuestions) + 1
      while (chosen.includes(multChosen)){
        multChosen = Math.floor(Math.random() * snap.data().NoQuestions) + 1
      }
      chosen.push(multChosen)
      let multRef = db.collection("MultipleChoice").doc(selection).collection("Questions").doc("" + multChosen);
      allRefs.push(multRef.get())
    }
    
    
    chosen = []
    for (let i = 0; i < dropdownNo; i++){
      let dropdownChosen = Math.floor(Math.random() * snap2.data().NoQuestions) + 1
      while (chosen.includes(dropdownChosen)){
        dropdownChosen = Math.floor(Math.random() * snap2.data().NoQuestions) + 1
      }
      chosen.push(dropdownChosen)
      let dropdownRef = db.collection("DropDown").doc(selection).collection("Questions").doc("" + dropdownChosen);
      allRefs.push(dropdownRef.get())
    }

    chosen = []
    for (let i = 0; i < fillBlankNo; i++){
      let fillBlankChosen = Math.floor(Math.random() * snap3.data().NoQuestions) + 1
      while (chosen.includes(fillBlankChosen)){
        fillBlankChosen = Math.floor(Math.random() * snap3.data().NoQuestions) + 1
      }
      chosen.push(fillBlankChosen)
      let fillBlankRef = db.collection("FillInTheBlank").doc(selection).collection("Questions").doc("" + fillBlankChosen);
      allRefs.push(fillBlankRef.get())
    }

    chosen = []
    for (let i = 0; i < trueFalseNo; i++){
      let trueFalseChosen = Math.floor(Math.random() * snap4.data().NoQuestions) + 1
      while (chosen.includes(trueFalseChosen)){
        trueFalseChosen = Math.floor(Math.random() * snap4.data().NoQuestions) + 1
      }
      chosen.push(trueFalseChosen)
      let trueFalseRef = db.collection("TrueFalse").doc(selection).collection("Questions").doc("" + trueFalseChosen);
      allRefs.push(trueFalseRef.get())
    }

    // let multChosen = Math.floor(Math.random() * snap.data().NoQuestions) + 1
    // let multRef = db.collection("MultipleChoice").doc(selection).collection("Questions").doc("" + multChosen);
    
    // let multChosen2 = Math.floor(Math.random() * snap.data().NoQuestions) + 1
    // while (multChosen2 === multChosen){
    //   multChosen2 = Math.floor(Math.random() * snap.data().NoQuestions) + 1
    // }
    // let multRef2 = db.collection("MultipleChoice").doc(selection).collection("Questions").doc("" + multChosen2);;

    // let trueFalseRef = db.collection("TrueFalse").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap2.data().NoQuestions) + 1));
    
    // let fillBlankRef = db.collection("FillInTheBlank").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap3.data().NoQuestions) + 1));
 
    // let dropdownRef = db.collection("DropDown").doc(selection).collection("Questions").doc("" + (Math.floor(Math.random() * snap4.data().NoQuestions) + 1));

    //wait for the data
    // let [multipleChoice, multipleChoice2, dropdown, trueFalse, fillInTheBlank] = await Promise.all([multRef.get(), multRef2.get(), dropdownRef.get(), trueFalseRef.get(), fillBlankRef.get()])

    let allQuestions = await Promise.all(allRefs)
    let fbStartingPos = multChoiceNo + dropdownNo
    let tfStartingPos = fbStartingPos + fillBlankNo
    let multChoiceQuestions = allQuestions.slice(0, multChoiceNo)
    let dropdownQuestions = allQuestions.slice(multChoiceNo, fbStartingPos)
    let fillBlankQuestions = allQuestions.slice(fbStartingPos, tfStartingPos)
    let trueFalseQuestions = allQuestions.slice(tfStartingPos)
    let multChoice = []
    let dropdown = []
    let fillBlank = []
    let trueFalse = []
    multChoiceQuestions.forEach((q) => {
      let data = q.data()
      multChoice.push({
        question: data.Question,
        choices: data.Choices,
        answer: data.Answer,
        selected: null,
        correct: 0
      })
    })
    dropdownQuestions.forEach((q) => {
      let data = q.data()
      dropdown.push({
        question: data.Question,
        choices: data.Choices,
        answer: data.Answer,
        selected: null,
        text: "Choose",
        correct: 0
      })
    })
    fillBlankQuestions.forEach((q) => {
      let data = q.data()
      fillBlank.push({
        question: data.Question,
        answer: data.Answer,
        selected: null,
        error: null,
        correct: 0
      })
    })
    trueFalseQuestions.forEach((q) => {
      let data = q.data()
      trueFalse.push({
        question: data.Question,
        answer: data.Answer,
        selected: null,
        correct: 0
      })
    })

    //For each question, return the data of the question document for checking against
    //user's submitted answers later, and return the question and choices for display.
    // if (multipleChoice.exists){ 
    //   questionData.set('multipleChoice', multipleChoice.data());
    //   state.multChoices1 = multipleChoice.data().Choices
    //   state.multQuestion1 = multipleChoice.data().Question
    // }
    // if (multipleChoice2.exists){
    //   questionData.set('multipleChoice2', multipleChoice2.data());
    //   state.multChoices2 = multipleChoice2.data().Choices
    //   state.multQuestion2 = multipleChoice2.data().Question
    // }
    // if (dropdown.exists){
    //   questionData.set('dropdown', dropdown.data());
    //   state.dropdownChoices = dropdown.data().Choices
    //   state.dropdownQuestion = dropdown.data().Question
    // }
    // if (trueFalse.exists){
    //   questionData.set('trueFalse', trueFalse.data());
    //   state.trueFalseQuestion = trueFalse.data().Question
    // }
    // if (fillInTheBlank.exists){
    //   questionData.set('fillInTheBlank', fillInTheBlank.data());
    //   state.fillBlankQuestion = fillInTheBlank.data().Question
    //   state.fetched = true;
    // }
    fetchedData = true;
    // allQuestions.forEach((q) => console.log(q.data()))
    let maxes = [snap, snap2, snap3, snap4].map((snap) => {
      return snap.data().NoQuestions
    })
    return (
      [fetchedData, multChoice, dropdown, fillBlank, trueFalse, maxes]
    )
  }

