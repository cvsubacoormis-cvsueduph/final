import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PreviewGradesProps = {
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: [];
  reExam?: string;
  remarks?: string;
  instructor: string;
  academicYear: string;
  semester: string;
};

export function PreviewGrades() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-none rounded-full">
          <EyeIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px] ">
        <DialogHeader>
          <DialogTitle>Preview Grades</DialogTitle>
          <DialogDescription>
            Preview and edit student grades.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3">
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableCaption>A list of the recent student grades.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Course Code</TableHead>
              <TableHead className="w-[150px]">Credit Unit</TableHead>
              <TableHead className="w-[150px]">Course Title</TableHead>
              <TableHead className="w-[150px]">Grade</TableHead>
              <TableHead className="w-[150px]">Re Exam</TableHead>
              <TableHead className="w-[150px]">Remarks</TableHead>
              <TableHead className="w-[150px]">Instructor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-xs">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
