//generates the PDF with quiz results for the current user
import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (questionData, userName) => {
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
    const date = Date().split(" ");
    let dateStr = "";
    for (let i = 0; i <= 3; i++){
        if (i === 3){
            dateStr += date[i]
        }else{
            dateStr += date[i] + "-"
        }
    }

    doc.setFontSize(22);
    doc.text(`Quiz Results for ${userName}`, 14, 15)
    doc.setFontSize(16);
    doc.text(`Score: ${score}/5`, 14, 25);
    doc.save(`results_${dateStr}.pdf`);
};
export default generatePDF;