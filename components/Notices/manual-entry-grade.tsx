import { AlertCircle } from "lucide-react";
import React from "react";

export default function ManualEntryGradeNotice() {
  return (
    <div>
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-blue-800">
              Important: Verify Student Information
            </h3>
            <p className="text-blue-700 text-sm">
              Before adding grades manually, please ensure all student
              information is accurate:
            </p>
            <ul className="text-blue-700 text-sm space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                <strong>Student Number</strong> - Verify the student number is
                correct and exists in the system
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                <strong>Student Name</strong> - Confirm first name and last name
                spelling match official records
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                <strong>Course Information</strong> - Ensure course code and
                title are valid and current
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                <strong>Grade Values</strong> - Use only approved grade values
                from the dropdown
              </li>
            </ul>
            <div className="mt-3 p-3 bg-blue-100 rounded-md">
              <p className="text-blue-800 text-sm font-medium">
                💡 Use the search function to find and verify student
                information before entering grades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
