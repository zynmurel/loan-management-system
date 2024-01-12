"use client";
import { Card, Table } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { api } from "~/trpc/react";
import { LoanContext } from "./layout";
import LoanLists from "./components/LoanLists";
import toast from "react-hot-toast";

const Loans = () => {
  const {
    loans,
    activeTabKey1,
    searchTextIndex,
    setSearchTextIndex,
    setActiveTabKey1,
    refetchLoans,
  } = useContext(LoanContext);
  const { mutate: changeLoanStatus } = api.loans.changeLoanStatus.useMutation({
    onSuccess: () => {
      refetchLoans?.();
      toast.success("Loan Request Approved (Approved Loans)");
    },
  });

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };

  const onChangeLoanStatus = (id: number, status: string) => {
    changeLoanStatus({
      id,
      status,
    });
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
      key: "request",
      tab: "Loan Requests",
    },
    {
      key: "done",
      tab: "Completed Loans",
    },
  ];
  const columns: ColumnsType<any> = [
    {
      title: "Loan Reference No.",
      dataIndex: "referenceNo",
    },
    {
      title: "Borrower",
      render: (data) => {
        const borrower = data.Borrower;
        return `${borrower.firstName} ${borrower.middleName} ${borrower.lastName}`;
      },
    },
    {
      title: "Address",
      render: (data) => {
        const borrower = data.Borrower;
        return borrower.address;
      },
    },
    {
      title: "Contact No.",
      render: (data) => {
        const borrower = data.Borrower;
        return borrower.contact;
      },
    },
    {
      title: "Loan Details",
      render: (data) => {
        return (
          <button className=" rounded border border-orange-500 bg-orange-100 px-2 text-orange-600 hover:brightness-105">
            View Loan Details
          </button>
        );
      },
    },
    activeTabKey1 === "request"
      ? {
          title: "Action",
          dataIndex: "id",
          render: (data) => {
            return (
              <button
                onClick={() => onChangeLoanStatus(data, "approved")}
                className=" rounded border bg-blue-500 px-2 py-0.5 text-white hover:brightness-105"
              >
                Approve Request
              </button>
            );
          },
        }
      : {},
  ];
  const LoanListTemplate = () => (
    <LoanLists
      setSearchTextIndex={setSearchTextIndex}
      searchTextIndex={searchTextIndex}
      columns={columns}
      loans={loans}
    />
  );
  const contentList: Record<string, React.ReactNode> = {
    active: <LoanListTemplate />,
    approved: <LoanListTemplate />,
    request: <LoanListTemplate />,
    done: <LoanListTemplate />,
  };
  return (
    <Card
      style={{ width: "100%" }}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={onTab1Change}
    >
      {contentList[activeTabKey1]}
    </Card>
  );
};

export default Loans;
