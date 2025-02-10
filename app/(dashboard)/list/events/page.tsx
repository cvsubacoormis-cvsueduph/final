import EventsTable from "@/components/EventsTable";
import CreateEvents from "@/components/events/create-event";
import { auth } from "@clerk/nextjs/server";

export default async function EventsLists() {
  const authResult = await auth();
  const { sessionClaims } = authResult;

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            All Events{" "}
            <span className="text-xs flex text-gray-500">Lists of Events</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              {role === "admin" && "superuser" && <CreateEvents />}
            </div>
          </div>
        </div>
        {/* LIST */}
        <EventsTable />
      </div>
    </>
  );
}
