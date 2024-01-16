"use client";
import { Card } from "antd";
import { useRef, useState } from "react";
import { DatePicker } from "antd";
import { IoPrintOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import { Mutable } from "next/dist/client/components/router-reducer/router-reducer-types";
import LoansReport from "./components/Loans";
import PaymentReport from "./components/Payment";

const { RangePicker } = DatePicker;

const tabList = [
  {
    key: "loans",
    tab: "Loan Report",
  },
  {
    key: "payment",
    tab: "Payment Report",
  },
];

const Loans = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("loans");
  const dateNow = dayjs();
  const [datePickerData, setDatePickerData] = useState<any>([
    dateNow.subtract(1, "month"),
    dateNow,
  ]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current as any,
  });
  const contentList: Record<string, React.ReactNode> = {
    payment: (
      <PaymentReport
        componentRef={componentRef}
        startDate={datePickerData[0]}
        endDate={datePickerData[1]}
      />
    ),
    loans: (
      <LoansReport
        componentRef={componentRef}
        startDate={datePickerData[0]}
        endDate={datePickerData[1]}
      />
    ),
  };
  const onTab1Change = (e: any) => {
    setActiveTabKey1(e);
  };

  return (
    <div className=" flex max-h-full w-full flex-col">
      <div className=" flex flex-row justify-between py-2">
        <div className=" flex flex-row items-center justify-center gap-2">
          <RangePicker
            size="large"
            onChange={(e) => setDatePickerData(e)}
            defaultValue={datePickerData}
          />
        </div>
        <button
          onClick={handlePrint}
          className=" flex w-52 items-center justify-center gap-2 rounded bg-blue-500 px-5 py-2 text-base text-white"
        >
          <div ref={componentRef as any} className=" text-xl">
            <IoPrintOutline />
          </div>
          Print Report
        </button>
      </div>
      <Card
        className=" flex-1"
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  );
};

export default Loans;
