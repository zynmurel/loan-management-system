"use client";
import { Card } from "antd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const Loans = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>("active");
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const tabList = [
    {
      key: "active",
      tab: "Active Loans",
    },
    {
      key: "approved",
      tab: "Approved Loans",
    },
    {
      key: "pending",
      tab: "For Approval Loans",
    },
    {
      key: "done",
      tab: "Completed Loans",
    },
  ];
  const contentList: Record<string, React.ReactNode> = {
    approved: <></>,
    pending: <></>,
  };
  return (
    <div className=" flex w-full flex-row justify-center gap-5 pt-5">
      <div className=" flex flex-1 flex-col">
        <div className=" mb-5 flex flex-row justify-between gap-3 text-2xl text-gray-500">
          Loan Lists
          <button
            onClick={() => {}}
            className=" flex flex-row items-center gap-3 rounded bg-green-500 p-2 px-5 text-base text-white shadow-md hover:brightness-110"
          >
            <IoMdAdd className={"text-2xl"} />
            Add New Loan
          </button>
        </div>
        <Card
          style={{ width: "100%" }}
          tabList={tabList}
          activeTabKey={activeTabKey1}
          onTabChange={onTab1Change}
        >
          {contentList[activeTabKey1]}
        </Card>
      </div>
    </div>
  );
};

export default Loans;
