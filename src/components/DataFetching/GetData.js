getData = async() => {
    this.setState({
      fetched: false
    })
    await this.multRef.get().then(async (doc) => {
      if (doc.exists) {
        this.multData = doc.data()
        this.setState({
          multChoices1: doc.data().Choices,
          multQuestion1: doc.data().Question,
        }) 
        await this.multRef2.get().then(async (doc) => {
          if (doc.exists) {
            this.multData2 = doc.data()
            this.setState({
              multChoices2: doc.data().Choices,
              multQuestion2: doc.data().Question,
            })
            await this.dropdownRef.get().then(async (doc) => {
              if (doc.exists) {
                this.dropdownData = doc.data()
                this.setState({
                  dropdownChoices: doc.data().Choices,
                  dropdownQuestion: doc.data().Question,
                })
                await this.trueFalseRef.get().then(async (doc) => {
                  if (doc.exists) {
                    this.truefalseData = doc.data()
                    this.setState({
                      trueFalseQuestion: doc.data().Question
                    })
                    await this.fillBlankRef.get().then(async (doc) => {
                      if (doc.exists) {
                        this.fillBlankData = doc.data()
                        this.setState({
                          fetched: true,
                          fillBlankQuestion: doc.data().Question
                        })
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

  }

export default getData;