// services/reportGenerator.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

const generatePDF = questionData => {
    
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


    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    let dateStr = "";
    for (let i = 0; i <= 3; i++){
        if (i === 3){
            dateStr += date[i]
        }else{
            dateStr += date[i] + "-"
        }
    }
    doc.text(`Score: ${score}/5`, 14, 15);
    doc.save(`results_${dateStr}.pdf`);
};

export default generatePDF;