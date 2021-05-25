//generates the PDF with quiz results for the current user
import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (questionData, userName, showDialog) => {
    
    // if (!showDialog){
    //     let webviewSession = mainWindow.webContents.session;
    //     webviewSession.on('will-download', function(e, item, webContents) {
    //     if (item.getMimeType() === "application/pdf") {
    //         e.preventDefault()
    //         // logic
    //     }
    // })
    // }
    
    
    const doc = new jsPDF();

    const tableColumn = ["Question Type", "Question", "Answer", "Selected", "Points"];
    const tableRows = [];
    var score = 0

    //populate information and results for each question row-wise in the PDF table
    questionData.forEach(question => {
        const questionInfo = [
        question.type,
        question.question,
        question.answer,
        question.selected,
        question.points
        ];
        score += question.points
        tableRows.push(questionInfo);
    });
    

    //styling and generating name for the PDF file
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
   

    doc.setFontSize(22);
    doc.text(`Quiz Results for ${userName}`, 14, 15)
    doc.setFontSize(16);
    doc.text(`Score: ${score}/5`, 14, 25);
    if (showDialog){
        console.log("I will give a dialog")
        const date = Date().split(" ");
        let dateStr = "";
        for (let i = 0; i <= 4; i++){
            if (i === 4){
                dateStr += date[i]
            }else{
                dateStr += date[i] + "-"
            }
        }
        doc.save(`results_${dateStr}.pdf`);
    }
    

};
export default generatePDF;