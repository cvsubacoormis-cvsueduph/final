import React from "react";
import { Grades, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Grades[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      studentNumber: 120,
      firstName: "John",
      lastName: "Doe",
      middleInit: "D",
      email: "m@example.com",
      phone: "1234567890",
      address: "1234 Main St",
      course: "BSIT",

      status: "REGULAR",
    },
    {
      id: "489e1d42",
      studentNumber: 125,
      firstName: "Jane",
      lastName: "Doe",
      middleInit: "D",
      email: "example@gmail.com",
      phone: "1234567890",
      address: "1234 Main St",
      course: "BSIT",

      status: "REGULAR",
    },
    {
      id: "f7b3a2a1",
      studentNumber: 130,
      firstName: "Richard",
      lastName: "Roe",
      middleInit: "R",
      email: "richard@example.com",
      phone: "1234567890",
      address: "5678 Oak St",
      course: "BSCS",
      status: "REGULAR",
    },
    {
      id: "a7c5e5f3",
      studentNumber: 135,
      firstName: "Alexander",
      lastName: "Smith",
      middleInit: "A",
      email: "alex@example.com",
      phone: "1234567890",
      address: "9012 Maple St",
      course: "BSBA",
      status: "REGULAR",
    },
    {
      id: "34c3a5a4",
      studentNumber: 140,
      firstName: "Elizabeth",
      lastName: "Johnson",
      middleInit: "E",
      email: "elizabeth@example.com",
      phone: "1234567890",
      address: "1111 Pine St",
      course: "BSP",
      status: "REGULAR",
    },
    {
      id: "b2a2c1a2",
      studentNumber: 145,
      firstName: "Michael",
      lastName: "Williams",
      middleInit: "M",
      email: "michael@example.com",
      phone: "1234567890",
      address: "2222 Cedar St",
      course: "BSHM",
      status: "REGULAR",
    },
    {
      id: "61f2a5c6",
      studentNumber: 150,
      firstName: "Sarah",
      lastName: "Lee",
      middleInit: "S",
      email: "sarah@example.com",
      phone: "1234567890",
      address: "3333 Elm St",
      course: "BSIT",

      status: "REGULAR",
    },
    {
      id: "c4b2a3e7",
      studentNumber: 155,
      firstName: "Olivia",
      lastName: "Brown",
      middleInit: "O",
      email: "olivia@example.com",
      phone: "1234567890",
      address: "4444 Oak St",
      course: "BSCS",
      status: "REGULAR",
    },
    {
      id: "e9d2a1a2",
      studentNumber: 160,
      firstName: "Lucas",
      lastName: "Davis",
      middleInit: "L",
      email: "lucas@example.com",
      phone: "1234567890",
      address: "5555 Maple St",
      course: "BSBA",
      status: "REGULAR",
    },
    {
      id: "f1c3e5f3",
      studentNumber: 165,
      firstName: "Mia",
      lastName: "Miller",
      middleInit: "M",
      email: "mia@example.com",
      phone: "1234567890",
      address: "6666 Pine St",
      course: "BSP",
      status: "REGULAR",
    },
    {
      id: "a3b2a5a4",
      studentNumber: 170,
      firstName: "Isabella",
      lastName: "Wilson",
      middleInit: "I",
      email: "isabella@example.com",
      phone: "1234567890",
      address: "7777 Cedar St",
      course: "BSHM",
      status: "REGULAR",
    },
    {
      id: "b5a2c1a2",
      studentNumber: 175,
      firstName: "Charlotte",
      lastName: "Moore",
      middleInit: "C",
      email: "charlotte@example.com",
      phone: "1234567890",
      address: "8888 Elm St",
      course: "BSIT",

      status: "REGULAR",
    },
    {
      id: "d1f2a5c6",
      studentNumber: 180,
      firstName: "Amelia",
      lastName: "Taylor",
      middleInit: "A",
      email: "amelia@example.com",
      phone: "1234567890",
      address: "9999 Oak St",
      course: "BSCS",
      status: "REGULAR",
    },
    {
      id: "e3b2a3e7",
      studentNumber: 185,
      firstName: "Harper",
      lastName: "White",
      middleInit: "H",
      email: "harper@example.com",
      phone: "1234567890",
      address: "10101 Maple St",
      course: "BSBA",
      status: "REGULAR",
    },
    {
      id: "f5c3e5f3",
      studentNumber: 190,
      firstName: "Evelyn",
      lastName: "Hall",
      middleInit: "E",
      email: "evelyn@example.com",
      phone: "1234567890",
      address: "11111 Pine St",
      course: "BSP",
      status: "REGULAR",
    },
    {
      id: "a5b2a5a4",
      studentNumber: 195,
      firstName: "Abigail",
      lastName: "Martin",
      middleInit: "A",
      email: "abigail@example.com",
      phone: "1234567890",
      address: "12121 Cedar St",
      course: "BSHM",
      status: "REGULAR",
    },
  ];
}

export default async function GradesListsPage() {
  const data = await getData();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="hidden md:block text-lg font-semibold">Grades Lists</h1>
      <span className="text-xs flex text-gray-500 font-semibold">
        List of grades
      </span>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}


