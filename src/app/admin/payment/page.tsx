"use client";

import { Card } from "antd";
import { useState } from "react";
const tabList = [
  {
    key: "pay",
    tab: <div className="px-2">Pay</div>,
  },
  {
    key: "list",
    tab: "Payment List",
  },
];
const PaymentPage = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>("pay");

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const contentList: Record<string, React.ReactNode> = {
    pay: <></>,
    list: <></>,
  };
  return (
    <>
      <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  );
};

export default PaymentPage;
