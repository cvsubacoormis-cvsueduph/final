"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsTableSkeleton({
  withActions = false,
}: {
  withActions?: boolean;
}) {
  return (
    <div className="mt-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="text-left text-gray-500 text-sm">
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Start Time</TableHead>
            <TableHead className="text-center">End Time</TableHead>
            {withActions && (
              <TableHead className="text-center">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[200px] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[100px] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[100px] mx-auto" />
              </TableCell>
              {withActions && (
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
