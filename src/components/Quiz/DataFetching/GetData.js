import firebase from 'firebase';

//this function gets the question data from the database and passes it for display
export default async function GetData(props) {  
    var state = props;
    var questionData = new Map();
    let firebaseApp= firebase.apps[0];
    let db = firebaseApp.firestore();

    //pick a random question index from the database for each question type
    let multChosen = Math.floor(Math.random() * 20) + 1;
    let multRef = db.collection("MultipleChoice").doc("" + multChosen);
    let multChosen2 = Math.floor(Math.random() * 20) + 1;
    while (multChosen2 === multChosen){
      multChosen2 = Math.floor(Math.random() * 20) + 1
    }
    let multRef2 = db.collection("MultipleChoice").doc("" + multChosen2);
    let dropdownRef = db.collection("DropDown").doc("" + (Math.floor(Math.random() * 10) + 1));
    let trueFalseRef = db.collection("TrueFalse").doc( "" + (Math.floor(Math.random() * 10) + 1));
    let fillBlankRef = db.collection("FillInTheBlank").doc("" + (Math.floor(Math.random() * 10) + 1))

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
    return (
      [state, questionData]
    )
  }

