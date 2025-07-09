import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "./ui/button";

export default function GenerateCOG() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");

      // === HEADER ===
      const logoWidth = 18;
      const logoHeight = 15;
      const logoX = 40;
      const logoY = 5;

      doc.addImage(
        "/printLogo.png",
        "PNG",
        logoX,
        logoY,
        logoWidth,
        logoHeight
      );
      doc.setFontSize(9);
      doc.text("Republic of the Philippines", 105, 11, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("CAVITE STATE UNIVERSITY", 105, 16, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Bacoor City Campus", 105, 20, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("SHIV, Molino VI City of Bacoor", 105, 25, { align: "center" });
      doc.addImage("/phone.png", "PNG", 91, 28, 2, 2);
      doc.text("(046) 476-5029", 105, 30, { align: "center" });
      doc.text("cvsubacoor@cvsu.edu.ph", 105, 35, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("OFFICE OF THE CAMPUS REGISTRAR", 105, 45, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 139);
      doc.text("CERTIFICATE OF GRADES", 105, 50, { align: "center" });
      doc.setTextColor(0, 0, 0);

      // === STUDENT INFO ===
      doc.setFontSize(7);
      doc.setTextColor(139, 0, 0);
      doc.text("Fullname:", 20, 60);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      const name = "BORREROS, DANILO CARDINO";
      doc.text(name, 35, 60);
      doc.setLineWidth(0.1);
      // Calculate text width and draw line to match
      const textWidth = doc.getTextWidth(name);
      doc.line(35, 61, 35 + textWidth, 61);
      doc.setTextColor(139, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Student No.:", 120, 60);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      const studentNo = "19010825";
      doc.text(studentNo, 140, 60);
      const studentNoWidth = doc.getTextWidth(studentNo);
      doc.line(140, 61, 140 + studentNoWidth, 61);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(139, 0, 0);
      doc.text("Year Level:", 20, 65);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      doc.text("FIRST YEAR", 35, 65);
      doc.setTextColor(139, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Academic Year:", 120, 65);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      doc.text("FIRST-SEM AY-2024-2025", 140, 65);

      doc.setTextColor(139, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Degree:", 20, 70);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      doc.text("BACHELOR OF SCIENCE IN COMPUTER SCIENCE", 35, 70);

      doc.setTextColor(139, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Major:", 20, 75);
      doc.setTextColor(139, 0, 0);
      doc.text("Date:", 120, 70);
      doc.setTextColor(0, 0, 139);
      doc.setFont("helvetica", "italic");
      doc.text("July 9, 2025", 130, 70);

      // === TABLE ===
      autoTable(doc, {
        startY: 85,
        styles: { font: "helvetica", fontSize: 7, cellPadding: 1 },
        headStyles: {
          fillColor: [254, 240, 138],
          textColor: 0,
          halign: "center",
          lineWidth: 0.3,
          lineColor: 0,
        },
        bodyStyles: {
          lineWidth: 0.3,
          lineColor: 0,
          textColor: 0,
        },
        columnStyles: {
          2: { halign: "left", fontStyle: "italic" }, // Added italic style for course title column
          0: { halign: "center" },
          1: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "center" },
          6: { halign: "center" },
        },
        theme: "grid",
        tableLineWidth: 0.3,
        tableLineColor: 0,
        head: [
          [
            "CODE",
            "UNITS",
            "COURSE TITLE",
            "GRADE",
            "RE-EXAM",
            "REMARKS",
            "FACULTY",
          ],
        ],
        body: [
          [
            "INSY 50",
            "3",
            "INFORMATION SYSTEM",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "MATH 50",
            "3",
            "MATHEMATICS",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "ENGL 50",
            "3",
            "ENGLISH",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "PHIL 50",
            "3",
            "PHILOSOPHY",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "ENGL 50",
            "3",
            "ENGLISH",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "PHIL 50",
            "3",
            "PHILOSOPHY",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "MATH 50",
            "3",
            "MATHEMATICS",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "INSY 50",
            "3",
            "INFORMATION SYSTEM",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "ENGL 50",
            "3",
            "ENGLISH",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "PHIL 50",
            "3",
            "PHILOSOPHY",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "MATH 50",
            "3",
            "MATHEMATICS",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "ENGL 50",
            "3",
            "ENGLISH",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "PHIL 50",
            "3",
            "PHILOSOPHY",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "MATH 50",
            "3",
            "MATHEMATICS",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
          [
            "INSY 50",
            "3",
            "INFORMATION SYSTEM",
            "DRP",
            "",
            "DROPPED",
            "MR. MICHAEL D. ANSUAS",
          ],
        ],
      });
      // === TOTALS ===
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text(
        "Total Subjects Enrolled: 1",
        20,
        (doc as any).lastAutoTable.finalY + 10
      );
      doc.text(
        "Total Credits Enrolled: 3",
        150,
        (doc as any).lastAutoTable.finalY + 10
      );
      doc.text(
        "Total Credits Earned: 0",
        20,
        (doc as any).lastAutoTable.finalY + 16
      );
      doc.text(
        "Grade Point Average: 0.00",
        150,
        (doc as any).lastAutoTable.finalY + 16
      );

      // === PURPOSE ===
      doc.text(
        "PURPOSE: ENROLLMENT/EVALUATION PURPOSES",
        20,
        (doc as any).lastAutoTable.finalY + 38
      );
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const registrarName = "MICHAEL D. ANSUAS";
      doc.text(registrarName, 153, (doc as any).lastAutoTable.finalY + 38);
      doc.setLineWidth(0.5);
      // Calculate text width and draw line to match
      const registrarWidth = doc.getTextWidth(registrarName);
      doc.line(
        153,
        (doc as any).lastAutoTable.finalY + 39,
        153 + registrarWidth,
        (doc as any).lastAutoTable.finalY + 39
      );
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Registrar Clerk", 158, (doc as any).lastAutoTable.finalY + 42);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 55,
        styles: {
          font: "helvetica",
          fontSize: 7,
          halign: "center",
          lineWidth: 0.1,
          lineColor: 0,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          lineWidth: 0.1,
          lineColor: 0,
        },
        theme: "striped",
        tableLineWidth: 0.1,
        tableLineColor: 0,
        body: [
          ["Grading System", "", "", "", "", ""],
          [
            "1.00",
            "Marked Excellent",
            "96.7 - 100",
            "2.75",
            "Fair",
            "73.4 - 76.6",
          ],
          ["1.25", "Excellent", "93.4 - 96.6", "3.00", "Passed", "70.0 - 73.3"],
          [
            "1.50",
            "Very Superior",
            "90.1 - 93.3",
            "4.00",
            "Conditional Failure",
            "50.0 - 69.9",
          ],
          ["1.75", "Superior", "86.7 - 90.0", "5.00", "Failed", "below 50"],
          ["2.00", "Very Good", "83.4 - 86.6", "INC", "Incomplete", ""],
          ["2.25", "Good", "80.1 - 83.3", "DRP", "Dropped Subject", ""],
          ["2.50", "Satisfactory", "76.7 - 80.0", "", "", ""],
        ],
      });

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Note: Not Valid without school dry seal.",
        20,
        (doc as any).lastAutoTable.finalY + 8
      );

      // === FOOTER ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("ELECTRONIC COPY", 20, (doc as any).lastAutoTable.finalY + 15);

      doc.save("Certificate-of-Grades.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={generatePDF}
        disabled={isLoading}
        className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Generating..." : "Generate COG"}
      </Button>
    </div>
  );
}
