"use client";

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex w-full flex-row justify-center gap-5">{children}</div>
  );
};

export default ReportsLayout;
