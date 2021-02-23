import firebase from 'firebase';

export default async function GetData(props) {  
    var state = props;
    const data = [];
    var firebaseApp= firebase.apps[0];
    var db = firebaseApp.firestore();
    var multChosen = Math.floor(Math.random() * 20);
    var multRef = db.collection("MultipleChoice").doc("" + multChosen);
    var multChosen2 = Math.floor(Math.random() * 20);
    while (multChosen2 === multChosen){
      multChosen2 = Math.floor(Math.random() * 20)
    }
    var multRef2 = db.collection("MultipleChoice").doc("" + multChosen2);
    var dropdownRef = db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)));
    var trueFalseRef = db.collection("TrueFalse").doc( "" + Math.floor((Math.random() * 10)));
    var fillBlankRef = db.collection("FillInTheBlank").doc("" + Math.floor((Math.random() * 10)))
    await multRef.get().then(async (doc) => {
      if (doc.exists) {
        data.push(doc.data())
        state.multChoices1 = doc.data().Choices
        state.multQuestion1 = doc.data().Question
        await multRef2.get().then(async (doc) => {
          if (doc.exists) {
            data.push(doc.data())
            state.multChoices2 = doc.data().Choices,
            state.multQuestion2 = doc.data().Question
            await dropdownRef.get().then(async (doc) => {
              if (doc.exists) {
                  data.push(doc.data())
                  state.dropdownChoices = doc.data().Choices
                  state.dropdownQuestion = doc.data().Question
                await trueFalseRef.get().then(async (doc) => {
                  if (doc.exists) {
                    data.push(doc.data())
                    state.trueFalseQuestion = doc.data().Question

                    await fillBlankRef.get().then(async (doc) => {
                      if (doc.exists) {
                        data.push(doc.data())
                        state.fetched = true,
                        state.fillBlankQuestion = doc.data().Question
                      }
                    }).catch(function(error){
                      console.log("Error getting document:", error)
                    })
                  }
                }).catch(function(error) {
                  console.log("Error getting document:", error)
                })
              }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });
          }
        }).catch(function(error) {
          console.log("Error getting document:", error)
        })
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
    console.log(state)
    return (
      state,
      data
    )

  }

