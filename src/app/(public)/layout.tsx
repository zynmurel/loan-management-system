"use client";
import { useRouter } from "next/navigation";

const PublicLayout = ({ children }: any) => {
  const router = useRouter();
  if (localStorage.getItem("userId")) {
    router.push("/");
  }
  return (
    <div className=" flex min-h-screen w-full items-center justify-center">
      <div className=" z-10 flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 opacity-80">
        {children}
      </div>
      <img
        src="/logo.png"
        alt="sample"
        className=" absolute left-9 z-0 opacity-35"
        width={680}
      />
    </div>
  );
};

export default PublicLayout;
