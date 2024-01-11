"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

const RootTemplate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!localStorage.getItem("userId") && pathname !== "/signup") {
      router.push("/login");
    } else if (
      localStorage.getItem("userType") === "admin" &&
      !pathname.includes("admin")
    ) {
      router.push("/admin");
    } else if (
      localStorage.getItem("userType") === "borrower" &&
      !pathname.includes("borrower")
    ) {
      router.push("/borrower");
    }
  }, []);
  return <div>{children}</div>;
};

export default RootTemplate;
