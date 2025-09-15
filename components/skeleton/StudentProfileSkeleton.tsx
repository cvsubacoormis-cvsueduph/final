"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentProfileSkeleton() {
  return (
    <section aria-label="Student profile loading">
      <Card className="overflow-hidden border-0 shadow-sm">
        {/* Header */}
        <CardHeader className="pb-4 sm:pb-5 md:pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <Skeleton className="size-16 sm:size-20 md:size-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48 sm:w-64" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 lg:grid-cols-5">
          {/* Overview + Grades */}
          <div className="space-y-6 lg:col-span-3">
            {/* Academic overview */}
            <div className="rounded-lg border p-4 sm:p-5">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
            </div>

            {/* Grades table placeholder */}
            <div className="rounded-lg border p-4 sm:p-5 space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border p-4 sm:p-5 space-y-3">
              <Skeleton className="h-5 w-32 mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
