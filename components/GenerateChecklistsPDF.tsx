"use client";

import { jsPDF } from "jspdf";
import { useRef } from "react";
import { Button } from "./ui/button";

type CourseRowProps = {
  code: string;
  title: string;
  lecUnit: number;
  labUnit: number;
  lecHrs: number;
  labHrs: number;
  prereq?: string;
  semester?: string;
  grade?: string;
  instructor?: string;
};

const GenerateChecklistPDF = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const generateChecklistPDF = () => {
    if (!buttonRef.current) return;

    // Disable button during generation
    buttonRef.current.disabled = true;
    buttonRef.current.textContent = "Generating PDF...";

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set font styles
      doc.setFont("helvetica", "normal");

      // Header section
      doc.setFontSize(9);
      doc.text("Republic of the Philippines", 105, 11, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("CAVITE STATE UNIVERSITY", 105, 16, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Bacoor City Campus", 105, 20, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("BACHELOR OF SCIENCE IN COMPUTER SCIENCE", 105, 25, {
        align: "center",
      });
      doc.text("CHECKLIST OF COURSES", 105, 30, { align: "center" });

      // Student information section
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Name of Student : DANILO CARDINO BORREROS", 20, 42);
      doc.text("Date of Admission :", 120, 42);
      doc.text("Student Number : 19010825", 20, 48);
      doc.text("Contact Number : 09517563114", 120, 48);
      doc.text("Address : testAddress11", 20, 54);
      doc.text("Name of Adviser :", 120, 54);

      // Table headers
      const tableHeaders = [
        "Course Code",
        "Course Title",
        "Credit Unit",
        "Contact Hrs",
        "Pre-Requisite",
        "AY/SEM Taken",
        "Final Grade",
        "Instructor",
      ];

      const creditUnitSubHeaders = ["Lec", "Lab"];
      const contactHrsSubHeaders = ["Lec", "Lab"];

      // Start position for the table
      let yPos = 55;

      // Function to draw table headers
      const drawTableHeaders = () => {
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");

        // Main headers
        doc.text(tableHeaders[0], 10, yPos);
        doc.text(tableHeaders[1], 25, yPos);

        // Credit Unit sub-header
        doc.text(tableHeaders[2], 77, yPos - 5);
        doc.text(creditUnitSubHeaders[0], 75, yPos);
        doc.text(creditUnitSubHeaders[1], 85, yPos);

        // Contact Hrs sub-header
        doc.text(tableHeaders[3], 95, yPos - 5);
        doc.text(contactHrsSubHeaders[0], 95, yPos);
        doc.text(contactHrsSubHeaders[1], 105, yPos);

        doc.text(tableHeaders[4], 115, yPos);
        doc.text(tableHeaders[5], 135, yPos);
        doc.text(tableHeaders[6], 155, yPos);
        doc.text(tableHeaders[7], 170, yPos);

        // Horizontal line
        doc.line(10, yPos + 2, 200, yPos + 2);
        yPos += 5;
      };

      // Function to add a course row with auto-fitting
      const addCourseRow = ({
        code,
        title,
        lecUnit,
        labUnit,
        lecHrs,
        labHrs,
        prereq,
        semester,
        grade,
        instructor,
      }: CourseRowProps) => {
        if (yPos > 270) {
          // Check if we need a new page
          doc.addPage();
          yPos = 20;
          drawTableHeaders();
        }

        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");

        // Calculate the required height for the row
        const titleLines = doc.splitTextToSize(title, 50); // 50mm width for title
        const prereqLines = doc.splitTextToSize(prereq || "-", 20); // 20mm width for prereq
        const maxLines = Math.max(titleLines.length, prereqLines.length);
        const rowHeight = maxLines * 4; // 3.5mm per line

        // Draw all cell content
        doc.text(code, 10, yPos);
        doc.text(titleLines, 25, yPos);
        doc.text(lecUnit.toString(), 76, yPos);
        doc.text(labUnit.toString(), 86, yPos);
        doc.text(lecHrs.toString(), 96, yPos);
        doc.text(labHrs.toString(), 106, yPos);
        doc.text(prereqLines, 115, yPos);
        doc.text(semester || "-", 135, yPos);
        doc.text(grade || "-", 155, yPos);
        doc.text(instructor || "-", 170, yPos);

        // Draw horizontal line below the row
        doc.line(10, yPos + rowHeight - 2, 200, yPos + rowHeight - 2);

        yPos += rowHeight;
      };

      // Function to add semester header
      const addSemesterHeader = (semester: string) => {
        if (yPos > 270) {
          // Check if we need a new page
          doc.addPage();
          yPos = 20;
        } else {
          yPos += 5;
        }

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(semester, 12, yPos);
        yPos += 5;
        drawTableHeaders();
      };

      // Function to add summary table
      const addSummaryTable = () => {
        if (yPos > 250) {
          // Leave space for the summary table
          doc.addPage();
          yPos = 30; // Increased initial margin
        } else {
          yPos += 10; // Add extra space before the summary table
        }

        // Table configuration
        const tableStartX = 40;
        const columnWidths = [30, 10, 10, 10, 10, 15, 15, 15]; // Widths for each column
        const totalTableWidth = columnWidths.reduce(
          (sum, width) => sum + width,
          0
        );

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        // Main headers
        doc.setFontSize(6);
        doc.text("SUMMARY", tableStartX, yPos - 3);
        doc.text("1st Sem", tableStartX + columnWidths[0], yPos - 3);
        doc.text(
          "2nd Sem",
          tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2],
          yPos - 3
        );
        doc.text(
          "Summer",
          tableStartX +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3] +
            columnWidths[4],
          yPos - 3
        );
        doc.text(
          "TOTAL (Lec)",
          tableStartX +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3] +
            columnWidths[4] +
            columnWidths[5],
          yPos - 3
        );
        doc.text(
          "TOTAL (Lab)",
          tableStartX + totalTableWidth - columnWidths[7],
          yPos - 3
        );

        // Sub-headers
        doc.text("Year Level", tableStartX, yPos + 4);
        doc.text("Lec", tableStartX + columnWidths[0], yPos + 4);
        doc.text(
          "Lab",
          tableStartX + columnWidths[0] + columnWidths[1],
          yPos + 4
        );
        doc.text(
          "Lec",
          tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2],
          yPos + 4
        );
        doc.text(
          "Lab",
          tableStartX +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3],
          yPos + 4
        );

        yPos += 8;

        // Draw horizontal line centered
        const lineStartX = tableStartX - 5;
        const lineEndX = lineStartX + totalTableWidth + 10;
        doc.line(lineStartX, yPos, lineEndX, yPos);
        yPos += 3;

        // Summary data
        const summaryData = [
          {
            year: "First Year",
            sem1Lec: 21,
            sem1Lab: 3,
            sem2Lec: 20,
            sem2Lab: 3,
            summer: 0,
            totalLec: 41,
            totalLab: 6,
          },
          {
            year: "Second Year",
            sem1Lec: 20,
            sem1Lab: 3,
            sem2Lec: 20,
            sem2Lab: 3,
            summer: 0,
            totalLec: 40,
            totalLab: 6,
          },
          {
            year: "Third Year",
            sem1Lec: 16,
            sem1Lab: 5,
            sem2Lec: 19,
            sem2Lab: 2,
            summer: 3,
            totalLec: 38,
            totalLab: 7,
          },
          {
            year: "Fourth Year",
            sem1Lec: 13,
            sem1Lab: 2,
            sem2Lec: 11,
            sem2Lab: 1,
            summer: 0,
            totalLec: 24,
            totalLab: 3,
          },
        ];

        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");

        summaryData.forEach((row) => {
          doc.text(row.year, tableStartX, yPos);
          doc.text(row.sem1Lec.toString(), tableStartX + columnWidths[0], yPos);
          doc.text(
            row.sem1Lab.toString(),
            tableStartX + columnWidths[0] + columnWidths[1],
            yPos
          );
          doc.text(
            row.sem2Lec.toString(),
            tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2],
            yPos
          );
          doc.text(
            row.sem2Lab.toString(),
            tableStartX +
              columnWidths[0] +
              columnWidths[1] +
              columnWidths[2] +
              columnWidths[3],
            yPos
          );
          doc.text(
            row.summer.toString(),
            tableStartX +
              columnWidths[0] +
              columnWidths[1] +
              columnWidths[2] +
              columnWidths[3] +
              columnWidths[4],
            yPos
          );
          doc.text(
            row.totalLec.toString(),
            tableStartX +
              columnWidths[0] +
              columnWidths[1] +
              columnWidths[2] +
              columnWidths[3] +
              columnWidths[4] +
              columnWidths[5],
            yPos
          );
          doc.text(
            row.totalLab.toString(),
            tableStartX + totalTableWidth - columnWidths[7],
            yPos
          );
          yPos += 5;
        });

        // Grand Total - centered under the totals
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total", tableStartX, yPos);
        doc.text(
          "165",
          tableStartX +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3] +
            columnWidths[4] +
            columnWidths[5],
          yPos
        );
        yPos += 10; // Extra space after table
      };
      addSemesterHeader("First Year");
      addSemesterHeader("First Semester");
      addCourseRow({
        code: "COSC 50",
        title: "Discrete Structures I",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "CVSU 101",
        title: "Institutional Orientation",
        lecUnit: 1,
        labUnit: 0,
        lecHrs: 1,
        labHrs: 0,
      });
      addCourseRow({
        code: "DCT 21",
        title: "Introduction to Computing",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
      });
      addCourseRow({
        code: "DCT 22",
        title: "Computer Programming I",
        lecUnit: 1,
        labUnit: 2,
        lecHrs: 1,
        labHrs: 2,
      });
      addCourseRow({
        code: "FIT 1",
        title: "Movement Enhancement",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 02",
        title: "Ethics",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 05",
        title: "Purposive Communication",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 11",
        title: "Yontesktwallsadong Komunikasyon sa Filipino",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "NSTP 1",
        title: "National Service Training Program 1",
        lecUnit: 2,
        labUnit: 0,
        lecHrs: 2,
        labHrs: 0,
      });

      // Second Semester Courses
      addSemesterHeader("Second Semester");
      addCourseRow({
        code: "DCT 23",
        title: "Computer Programming II",
        lecUnit: 1,
        labUnit: 2,
        lecHrs: 1,
        labHrs: 2,
        prereq: "DCT 22",
      });
      addCourseRow({
        code: "FIT 2",
        title: "Fitness Exercises",
        lecUnit: 2,
        labUnit: 0,
        lecHrs: 2,
        labHrs: 0,
        prereq: "FIT 1",
      });
      addCourseRow({
        code: "GNED 01",
        title: "Art Appreciation",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 03",
        title: "Mathematics in the Modern World",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 06",
        title: "Science, Technology and Society",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 12",
        title: "Dalumat Ng/Sa Filipino",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "GNED 11",
      });
      addCourseRow({
        code: "ITEC 50",
        title: "Web Systems and Technologies",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 21",
      });
      addCourseRow({
        code: "NSTP 2",
        title: "National Service Training Program 2",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "NSTP 1",
      });

      // Second Year - First Semester
      addSemesterHeader("Second Year");
      addSemesterHeader("First Semester");
      addCourseRow({
        code: "COSC 55",
        title: "Discrete Structures II",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "COSC 50",
      });
      addCourseRow({
        code: "COSC 60",
        title: "Digital Logic Design",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "COSC 50, DCT 23",
      });
      addCourseRow({
        code: "DCT 24",
        title: "Information Management",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 23",
      });
      addCourseRow({
        code: "DCT 50",
        title: "Object Oriented Programming",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 23",
      });
      addCourseRow({
        code: "FIT 3",
        title: "Physical Activities towards Health and Fitness 1",
        lecUnit: 2,
        labUnit: 0,
        lecHrs: 2,
        labHrs: 0,
        prereq: "FIT 1",
      });
      addCourseRow({
        code: "GNED 04",
        title: "Mga Babasahin Hirogil sa Kassysayan ng Pilipinas",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "NSY 50",
        title: "Fundamentals of Information Systems",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "DCT 21",
        semester: "1ST/AY_24-25",
        grade: "1.25",
        instructor: "MR. MICHAEL D. ANSUAS MIT",
      });
      addCourseRow({
        code: "MAIH 1",
        title: "Analytic Geometry",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "GNED 03",
      });

      // Second Year - Second Semester
      addSemesterHeader("Second Semester");
      addCourseRow({
        code: "COSC 65",
        title: "Architecture and Organization",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "COSC 60",
      });
      addCourseRow({
        code: "COSC 70",
        title: "Software Engineering I",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "DCT 50 & 24",
      });
      addCourseRow({
        code: "DCT 25",
        title: "Data Structures and Algorithms",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 23",
      });
      addCourseRow({
        code: "DCT 55",
        title: "Advanced Database Management System",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 24",
      });
      addCourseRow({
        code: "FIT 4",
        title: "Physical Activities towards Health and Fitness 2",
        lecUnit: 2,
        labUnit: 0,
        lecHrs: 2,
        labHrs: 0,
        prereq: "FIT 1",
      });
      addCourseRow({
        code: "GNED 08",
        title: "Understanding the Self",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 14",
        title: "Partillating Parlipunan",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "MAIH 2",
        title: "Calculus",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "MAIH 1",
      });

      // Third Year - First Semester
      addSemesterHeader("Third Year");
      addSemesterHeader("First Semester");
      addCourseRow({
        code: "COSC 101",
        title: "CS Bechive 1 (Computer Graphics and Visual Computing)",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 23",
      });
      addCourseRow({
        code: "COSC 75",
        title: "Software Engineering II",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "COSC 70",
      });
      addCourseRow({
        code: "COSC 80",
        title: "Operating Systems",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "DCT 25",
      });
      addCourseRow({
        code: "COSC 85",
        title: "Networks and Communication",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "ITEC 50",
      });
      addCourseRow({
        code: "DCT 26",
        title: "Applications Dev't and Emerging Technologies",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "ITEC 50",
      });
      addCourseRow({
        code: "DCT 65",
        title: "Social and Professional Issues",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "MAIH 3",
        title: "Linear Algebra",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "MAIH 2",
      });

      // Third Year - Second Semester
      addSemesterHeader("Second Semester");
      addCourseRow({
        code: "COSC 106",
        title: "CS Elective 2 (Introduction to Game Development)",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "MAIH 3, COSC 101",
      });
      addCourseRow({
        code: "COSC 90",
        title: "Design and Analysis of Algorithm",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "DCT 25",
      });
      addCourseRow({
        code: "COSC 95",
        title: "Programming Languages",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "DCT 25",
      });
      addCourseRow({
        code: "DCT 60",
        title: "Methods of Research",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "3rd yr. Standing",
      });
      addCourseRow({
        code: "GNED 09",
        title: "Life and Works of Rizal",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "GNED 04",
      });
      addCourseRow({
        code: "ITEC 85",
        title: "Information Assurance and Security",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "DCT 24",
      });
      addCourseRow({
        code: "MAIH 4",
        title: "Experimental Statistics",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "MAIH 2",
      });

      // Mid-year
      addSemesterHeader("Mid-year");
      addCourseRow({
        code: "COSC 199",
        title: "Practicum (240 hours)",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "Incoming 4th yr.",
      });

      // Fourth Year - First Semester
      addSemesterHeader("Fourth Year");
      addSemesterHeader("First Semester");
      addCourseRow({
        code: "COSC 100",
        title: "Automata Theory and Formal Languages",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "COSC 90",
      });
      addCourseRow({
        code: "COSC 105",
        title: "Intelligent Systems",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "MAIH 4, COSC 55, DCT 50",
      });
      addCourseRow({
        code: "COSC 111",
        title: "CS Elective 3 (Internet of Things)",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "COSC 60",
      });
      addCourseRow({
        code: "COSC 200A",
        title: "Undergraduate Thesis I",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "4th year Standing",
      });
      addCourseRow({
        code: "ITEC 80",
        title: "Human Computer Interaction",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "ITEC 85",
      });

      // Fourth Year - Second Semester
      addSemesterHeader("Second Semester");
      addCourseRow({
        code: "COSC 110",
        title: "Numerical and Symbolic Computation",
        lecUnit: 2,
        labUnit: 1,
        lecHrs: 2,
        labHrs: 1,
        prereq: "COSC 60",
      });
      addCourseRow({
        code: "COSC 200B",
        title: "Undergraduate Thesis II",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
        prereq: "COSC 200A",
      });
      addCourseRow({
        code: "GNED 07",
        title: "The Contemporary World",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });
      addCourseRow({
        code: "GNED 10",
        title: "Gender and Society",
        lecUnit: 3,
        labUnit: 0,
        lecHrs: 3,
        labHrs: 0,
      });

      addSummaryTable();

      // Save the PDF
      doc.save("BSCS_Checklist_of_Courses.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Re-enable button
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.textContent = "Download Course Checklist";
      }
    }
  };

  return (
    <Button
      ref={buttonRef}
      className="bg-blue-700 hover:bg-blue-900 text-white"
      onClick={generateChecklistPDF}
    >
      Download Course Checklist
    </Button>
  );
};

export default GenerateChecklistPDF;
