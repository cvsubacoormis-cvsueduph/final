"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchStudent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const sp = new URLSearchParams(searchParams);
    if (value === "") {
      sp.delete("query");
    } else {
      sp.set("query", value);
    }
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query") || ""}
      />
      <Image src="/search.png" alt="" width={14} height={14} />
    </div>
  );
}
