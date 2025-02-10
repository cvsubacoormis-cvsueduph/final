import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Image src={"/logo.png"} alt="logo" width={45} height={45} className="ml-20 mb-2" />
        <span className="hidden lg:block font-bold ml-12">Student Portal</span>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
