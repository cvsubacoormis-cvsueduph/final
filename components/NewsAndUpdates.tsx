"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";

// Update the component function to include pagination state and logic
export function NewsAndUpdates() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<NewsUpdate | null>(null);
  const [newsItems, setNewsItems] = useState<NewsUpdate[]>(newsUpdates);

  const { user } = useUser();

  const role = user?.publicMetadata.role;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  // Form state
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementCategory, setNewAnnouncementCategory] =
    useState("Academic");
  const [newAnnouncementImportant, setNewAnnouncementImportant] =
    useState(false);

  // Get current date in format "Month Day, Year"
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Handle opening the read more modal
  const handleReadMore = (announcement: NewsUpdate) => {
    setSelectedAnnouncement(announcement);
    setReadMoreModalOpen(true);
  };

  // Handle posting a new announcement
  const handlePostAnnouncement = () => {
    const newAnnouncement: NewsUpdate = {
      id: newsItems.length + 1,
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      date: currentDate,
      category: newAnnouncementCategory,
      author: "Admin User",
      important: newAnnouncementImportant,
    };

    // Add to the beginning of the array if it's important, otherwise after important items
    if (newAnnouncementImportant) {
      setNewsItems([newAnnouncement, ...newsItems]);
    } else {
      const importantItems = newsItems.filter((item) => item.important);
      const regularItems = newsItems.filter((item) => !item.important);
      setNewsItems([...importantItems, newAnnouncement, ...regularItems]);
    }

    // Reset form
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementCategory("Academic");
    setNewAnnouncementImportant(false);
    setIsPostModalOpen(false);

    // Reset to first page when adding a new announcement
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get current news items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  // Separate important and regular announcements for the current page
  const importantItems = currentItems.filter((item) => item.important);
  const regularItems = currentItems.filter((item) => !item.important);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">News & Updates</CardTitle>
            <CardDescription>
              Latest news and updates from university
            </CardDescription>
          </div>
          {/* Admin would have access to this button */}
          {role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Post News and Updates
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Important announcements first */}
            {importantItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-700 hover:bg-amber-100"
                      >
                        Important
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  {item.content.length > 200
                    ? `${item.content.substring(0, 200)}...`
                    : item.content}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Posted by: {item.author}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleReadMore(item)}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            ))}

            {/* Regular announcements */}
            {regularItems.map((item, index, filteredItems) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getBadgeStyles(item.category)}
                      >
                        {item.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-medium">{item.title}</h3>
                  </div>
                </div>
                <p className="text-sm">
                  {item.content.length > 200
                    ? `${item.content.substring(0, 200)}...`
                    : item.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Posted by: {item.author}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleReadMore(item)}
                  >
                    Read More
                  </Button>
                </div>
                {index !== filteredItems.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}

            {/* Pagination controls */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, newsItems.length)} of{" "}
                {newsItems.length} announcements
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Announcement Modal */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Post New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to share with students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newAnnouncementTitle}
                onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                placeholder="Announcement title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newAnnouncementCategory}
                onValueChange={setNewAnnouncementCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                placeholder="Announcement content"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="important"
                checked={newAnnouncementImportant}
                onChange={(e) => setNewAnnouncementImportant(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePostAnnouncement}>Post Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Read More Modal */}
      <Dialog open={readMoreModalOpen} onOpenChange={setReadMoreModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedAnnouncement.important
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        : getBadgeStyles(selectedAnnouncement.category)
                    }
                  >
                    {selectedAnnouncement.important
                      ? "Important"
                      : selectedAnnouncement.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedAnnouncement.date}
                  </span>
                </div>
                <DialogTitle className="mt-2">
                  {selectedAnnouncement.title}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm">{selectedAnnouncement.content}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Posted by: {selectedAnnouncement.author}
              </div>
              <DialogFooter>
                <Button onClick={() => setReadMoreModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Types
interface NewsUpdate {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  author: string;
  important?: boolean;
}

// Sample news data
const newsUpdates: NewsUpdate[] = [
  {
    id: 1,
    title: "Spring Break Schedule Change",
    content:
      "Due to campus renovations, spring break will be extended by two days. Classes will resume on Wednesday, April 16th instead of Monday, April 14th. Please adjust your schedules accordingly. All faculty have been notified of this change and will adjust their syllabi as needed. Campus facilities will remain open during the extended break for students who stay on campus. The library will maintain regular hours, and dining services will operate on a weekend schedule.",
    date: "April 1, 2025",
    category: "Academic",
    author: "Dean Williams",
    important: true,
  },
  {
    id: 2,
    title: "New Library Hours",
    content:
      "Starting next week, the main library will extend its hours to 11 PM on weekdays to accommodate students during midterm preparation. Weekend hours remain unchanged. The extended hours will be in effect until the end of the semester. Study rooms can be reserved up to one week in advance. The library café will also extend its hours to 10 PM on weekdays. Additional staff will be available to assist with research and technology questions during evening hours.",
    date: "March 30, 2025",
    category: "Facilities",
    author: "Library Services",
  },
  {
    id: 3,
    title: "Summer Registration Opens",
    content:
      "Registration for summer courses will open on April 10th. Please check your student portal for your specific registration time slot. Early registration is available for seniors and honors students. Summer courses will be offered in two six-week sessions and one twelve-week session. Online, hybrid, and in-person options are available for most core courses. Financial aid for summer courses is limited, so please consult with the financial aid office before registering if you need assistance.",
    date: "March 28, 2025",
    category: "Academic",
    author: "Registrar's Office",
  },
  {
    id: 4,
    title: "Campus Career Fair",
    content:
      "The annual Spring Career Fair will be held on April 20th in the Student Union Building from 10 AM to 3 PM. Over 50 employers will be present. Bring your resume and dress professionally. Pre-registration is available through the Career Services portal and is highly recommended as some employers will be scheduling on-site interviews. Resume review sessions are available the week before the fair - sign up early as spots fill quickly. A list of participating employers is available on the Career Services website.",
    date: "March 25, 2025",
    category: "Events",
    author: "Career Services",
  },
  {
    id: 5,
    title: "New Mental Health Resources",
    content:
      "The Student Wellness Center has expanded its mental health services. Free counseling sessions are now available to all students. Visit the Wellness Center website to schedule an appointment. In addition to individual counseling, new group therapy sessions focusing on stress management, anxiety, and depression will begin next week. The Wellness Center has also launched a 24/7 crisis hotline for students needing immediate support. All services are confidential and included in your student health fee.",
    date: "March 22, 2025",
    category: "Wellness",
    author: "Student Health Services",
  },
];

// Helper function for badge styles
function getBadgeStyles(category: string) {
  switch (category) {
    case "Academic":
      return "bg-blue-50 text-blue-700 hover:bg-blue-50";
    case "Events":
      return "bg-purple-50 text-purple-700 hover:bg-purple-50";
    case "Facilities":
      return "bg-green-50 text-green-700 hover:bg-green-50";
    case "Wellness":
      return "bg-rose-50 text-rose-700 hover:bg-rose-50";
    default:
      return "bg-gray-50 text-gray-700 hover:bg-gray-50";
  }
}
