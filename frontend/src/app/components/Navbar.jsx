"use client";
import React from "react";
import Button from "./Button";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/document/")
  ) {
    return <></>;
  } else {
    return (
      <div className="px-8 py-2 border-b-2 flex justify-between items-center">
        <h2 className="cursor-pointer text-2xl text-blue-600 font-bold">
          DocEditor
        </h2>

        {/* <Button text="Login" action={() => {}} /> */}
      </div>
    );
  }
}

export default Navbar;
