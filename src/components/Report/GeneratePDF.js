// services/reportGenerator.js

import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (questionData, userName) => {
    const doc = new jsPDF();

    const tableColumn = ["Question Type", "Question", "Answer", "Selected", "Points"];
    const tableRows = [];
    var score = 0
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