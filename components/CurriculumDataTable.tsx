"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Courses, Major, Semester, yearLevels } from "@prisma/client";
import { toast } from "sonner";

interface CurriculumChecklist {
  id: string;
  course: Courses;
  major: Major;
  yearLevel: yearLevels;
  semester: Semester;
  courseCode: string;
  courseTitle: string;
  creditLec: number;
  creditLab: number;
  preRequisite?: string;
}

// Mock data for demonstration
const mockData: CurriculumChecklist[] = [
  {
    id: "1",
    course: "BSIT",
    major: "NONE",
    yearLevel: "FIRST",
    semester: "FIRST",
    courseCode: "IT101",
    courseTitle: "Introduction to Information Technology",
    creditLec: 3,
    creditLab: 0,
    preRequisite: undefined,
  },
  {
    id: "2",
    course: "BSIT",
    major: "NONE",
    yearLevel: "FIRST",
    semester: "FIRST",
    courseCode: "PROG101",
    courseTitle: "Programming Fundamentals",
    creditLec: 2,
    creditLab: 1,
    preRequisite: "IT101",
  },
  {
    id: "3",
    course: "BSCS",
    major: "NONE",
    yearLevel: "SECOND",
    semester: "SECOND",
    courseCode: "DS201",
    courseTitle: "Data Structures and Algorithms",
    creditLec: 3,
    creditLab: 1,
    preRequisite: "PROG101",
  },
];

const courseOptions: Courses[] = [
  "BSIT",
  "BSCS",
  "BSCRIM",
  "BSP",
  "BSHM",
  "BSBA",
  "BSED",
];
const majorOptions: Major[] = [
  "NONE",
  "ENGLISH",
  "HUMAN_RESOURCE_MANAGEMENT",
  "MATHEMATICS",
  "MARKETING_MANAGEMENT",
];
const yearLevelOptions: yearLevels[] = ["FIRST", "SECOND", "THIRD", "FOURTH"];
const semesterOptions: Semester[] = ["FIRST", "SECOND", "MIDYEAR"];

export function CurriculumDataTable() {
  const [data, setData] = useState<CurriculumChecklist[]>(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CurriculumChecklist | null>(
    null
  );

  const [formData, setFormData] = useState<Omit<CurriculumChecklist, "id">>({
    course: "BSIT",
    major: "NONE",
    yearLevel: "FIRST",
    semester: "FIRST",
    courseCode: "",
    courseTitle: "",
    creditLec: 0,
    creditLab: 0,
    preRequisite: "",
  });

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      course: "BSIT",
      major: "NONE",
      yearLevel: "FIRST",
      semester: "FIRST",
      courseCode: "",
      courseTitle: "",
      creditLec: 0,
      creditLab: 0,
      preRequisite: "",
    });
  };

  const handleCreate = () => {
    const newItem: CurriculumChecklist = {
      ...formData,
      id: Date.now().toString(), // Simple ID generation for demo
      preRequisite: formData.preRequisite || undefined,
    };

    setData([...data, newItem]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast("Curriculum item created successfully");
  };

  const handleEdit = (item: CurriculumChecklist) => {
    setEditingItem(item);
    setFormData({
      course: item.course,
      major: item.major,
      yearLevel: item.yearLevel,
      semester: item.semester,
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      creditLec: item.creditLec,
      creditLab: item.creditLab,
      preRequisite: item.preRequisite || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingItem) return;

    const updatedData = data.map((item) =>
      item.id === editingItem.id
        ? {
            ...formData,
            id: editingItem.id,
            preRequisite: formData.preRequisite || undefined,
          }
        : item
    );

    setData(updatedData);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    resetForm();
    toast("Curriculum item updated successfully");
  };

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    toast("Curriculum item deleted successfully");
  };

  const formatLabel = (value: string) => {
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search curriculum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-blue-700 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Curriculum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Curriculum Item</DialogTitle>
              <DialogDescription>
                Add a new curriculum checklist item to the database.
              </DialogDescription>
            </DialogHeader>
            <CurriculumForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(data.map((item) => item.course)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.reduce(
                (sum, item) => sum + item.creditLec + item.creditLab,
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Majors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(data.map((item) => item.major)).size}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Year Level</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Pre-requisite</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No curriculum items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.courseCode}
                      </TableCell>
                      <TableCell>{item.courseTitle}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.course}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatLabel(item.major)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatLabel(item.yearLevel)}</TableCell>
                      <TableCell>{formatLabel(item.semester)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Lec: {item.creditLec}</div>
                          <div>Lab: {item.creditLab}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.preRequisite || "None"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4 text-blue-700" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-700" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the curriculum item &ldquo;
                                  {item.courseCode} - {item.courseTitle}&quot;
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 focus:ring-red-600 hover:bg-red-500"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Curriculum Item</DialogTitle>
            <DialogDescription>
              Update the curriculum checklist item details.
            </DialogDescription>
          </DialogHeader>
          <CurriculumForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-blue-700 hover:bg-blue-600"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Form component for create/edit operations
function CurriculumForm({
  formData,
  setFormData,
}: {
  formData: Omit<CurriculumChecklist, "id">;
  setFormData: (data: Omit<CurriculumChecklist, "id">) => void;
}) {
  const formatLabel = (value: string) => {
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="courseCode">Course Code</Label>
        <Input
          id="courseCode"
          value={formData.courseCode}
          onChange={(e) =>
            setFormData({ ...formData, courseCode: e.target.value })
          }
          placeholder="e.g., IT101"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseTitle">Course Title</Label>
        <Input
          id="courseTitle"
          value={formData.courseTitle}
          onChange={(e) =>
            setFormData({ ...formData, courseTitle: e.target.value })
          }
          placeholder="e.g., Introduction to IT"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Program</Label>
        <Select
          value={formData.course}
          onValueChange={(value: Courses) =>
            setFormData({ ...formData, course: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="major">Major</Label>
        <Select
          value={formData.major}
          onValueChange={(value: Major) =>
            setFormData({ ...formData, major: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {majorOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {formatLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearLevel">Year Level</Label>
        <Select
          value={formData.yearLevel}
          onValueChange={(value: yearLevels) =>
            setFormData({ ...formData, yearLevel: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearLevelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {formatLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select
          value={formData.semester}
          onValueChange={(value: Semester) =>
            setFormData({ ...formData, semester: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {formatLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditLec">Lecture Credits</Label>
        <Input
          id="creditLec"
          type="number"
          min="0"
          value={formData.creditLec}
          onChange={(e) =>
            setFormData({
              ...formData,
              creditLec: Number.parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditLab">Laboratory Credits</Label>
        <Input
          id="creditLab"
          type="number"
          min="0"
          value={formData.creditLab}
          onChange={(e) =>
            setFormData({
              ...formData,
              creditLab: Number.parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="preRequisite">Pre-requisite (Optional)</Label>
        <Input
          id="preRequisite"
          value={formData.preRequisite}
          onChange={(e) =>
            setFormData({ ...formData, preRequisite: e.target.value })
          }
          placeholder="e.g., IT101"
        />
      </div>
    </div>
  );
}
