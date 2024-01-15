"use client";

import { Card } from "antd";
import { useState } from "react";
import { api } from "~/trpc/react";
import SearchRefPage from "./components/SearchRefNo";

const tabList = [
  {
    key: "pay",
    tab: <div className="px-2">Pay</div>,
  },
  // {
  //   key: "list",
  //   tab: "Payment List",
  // },
];
const PaymentPage = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>("pay");
  const [searchText, setSearchText] = useState("");
  const [searchRefNo, setSearchRefNo] = useState<string | null>(null);
  const { data: searchedLoans } = api.payment.getSearchLoans.useQuery({
    searchText,
  });
  const { data: selectedLoan, isLoading: selectedLoanLoading } =
    api.payment.getSearchedLoanByRefNo.useQuery({
      refNo: searchRefNo || "",
    });
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  console.log(selectedLoan);
  const contentList: Record<string, React.ReactNode> = {
    list: <></>,
    pay: (
      <SearchRefPage
        searchRefNo={searchRefNo}
        setSearchText={setSearchText}
        setSearchRefNo={setSearchRefNo}
        selectedLoanLoading={selectedLoanLoading}
        selectedLoan={selectedLoan}
        searchedLoans={searchedLoans}
      />
    ),
  };
  return (
    <div className=" w-full">
      <Card
        style={{ width: "100%", height: "100%" }}
        bodyStyle={{ height: "80%" }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        <div className=" flex h-full flex-col">
          {contentList[activeTabKey1]}
        </div>
      </Card>
    </div>
  );
};

export default PaymentPage;
