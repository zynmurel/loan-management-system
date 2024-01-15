"use client";
import { Card, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useContext, useState } from "react";
import { api } from "~/trpc/react";
import { LoanContext } from "./layout";
import LoanLists from "./components/LoanLists";
import toast from "react-hot-toast";
import {
  getMonthlyOverduePenalty,
  getMonthlyPayableAmount,
  getTotalPayableAmount,
} from "~/app/_utils/helpers/paymentComputations";
import { useRouter } from "next/navigation";

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

const Loans = () => {
  const {
    loans,
    activeTabKey1,
    searchTextIndex,
    setSearchTextIndex,
    setActiveTabKey1,
    refetchLoans,
  } = useContext(LoanContext);
  const router = useRouter();
  const [openModal, setOpenModal] = useState<any>({
    type: null,
    data: null,
  });
  const { mutate: changeLoanStatus } = api.loans.changeLoanStatus.useMutation({
    onSuccess: () => {
      refetchLoans?.();
      toast.success("Loan Request Approved (Approved Loans)");
      onCloseModal();
    },
  });

  const { mutate: setLoanActive } = api.loans.changeLoanToActive.useMutation({
    onSuccess: () => {
      refetchLoans?.();
      toast.success("Loan Started Now (Active Loans)");
      onCloseModal();
    },
  });

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
    setSearchTextIndex("");
  };

  const onChangeLoanStatus = (id: number, status: string) => {
    changeLoanStatus({
      id,
      status,
    });
  };

  const onCloseModal = () => {
    setOpenModal({
      type: null,
      data: null,
    });
  };

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
    activeTabKey1 === "request"
      ? {
          title: "Loan Details",
          render: (data) => {
            return (
              <button
                onClick={() => setOpenModal({ type: "viewLoanDetails", data })}
                className=" rounded border border-orange-500 bg-orange-100 px-2 py-0.5 text-orange-600 hover:brightness-105"
              >
                View Loan Details
              </button>
            );
          },
        }
      : {},
    activeTabKey1 === "request"
      ? {
          title: "Action",
          render: (data) => {
            return (
              <button
                onClick={() => setOpenModal({ type: "approveLoan", data })}
                className=" rounded border bg-blue-500 px-2 py-0.5 text-white hover:brightness-105"
              >
                Approve Request
              </button>
            );
          },
        }
      : {},
    activeTabKey1 === "approved" || activeTabKey1 === "active"
      ? {
          title: "Loan Details",
          render: (data) => {
            return (
              <button
                onClick={() => setOpenModal({ type: "viewLoanDetails", data })}
                className=" rounded border border-green-500 bg-green-100 px-2 py-0.5 text-green-600 hover:brightness-105"
              >
                View Loan Details
              </button>
            );
          },
        }
      : {},
    activeTabKey1 === "done"
      ? {
          title: "Loan Details",
          dataIndex: "referenceNo",
          render: (data) => {
            return (
              <button
                onClick={() => router.push(`/admin/payment/${data}`)}
                className=" rounded border border-green-500 bg-green-500 px-2 py-0.5 text-white hover:brightness-105"
              >
                Proceed to Loan Details
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
    <>
      <Modal
        title="Approve Loan Request"
        open={openModal.type === "approveLoan"}
        onCancel={onCloseModal}
        width={300}
        footer={[
          <button
            className=" mx-1 rounded border px-3 py-1"
            onClick={onCloseModal}
          >
            Cancel
          </button>,
          <button
            className=" mx-1 rounded bg-blue-500 px-3 py-1 text-white"
            onClick={() => onChangeLoanStatus(openModal.data.id, "approved")}
          >
            Confirm
          </button>,
        ]}
      ></Modal>
      <Modal
        title={`Loan Details`}
        open={openModal.type === "viewLoanDetails"}
        onCancel={onCloseModal}
        width={500}
        footer={[
          <button
            className=" mx-1 rounded border px-3 py-1"
            onClick={onCloseModal}
          >
            Close
          </button>,
          activeTabKey1 === "approved" ? (
            <button
              className=" mx-1 rounded border border-green-500 bg-green-100 px-3 py-1 text-green-600 hover:brightness-95"
              onClick={() =>
                setLoanActive({
                  id: openModal.data.id,
                  months: openModal.data.LoanPlan.planMonth,
                  monthlyAmount: parseFloat(
                    getMonthlyPayableAmount(
                      openModal.data.amount,
                      openModal.data.LoanPlan.interest,
                      openModal.data.LoanPlan.planMonth,
                    ),
                  ),
                  monthlyPenalty: parseFloat(
                    getMonthlyOverduePenalty(
                      openModal.data.amount,
                      openModal.data.LoanPlan.interest,
                      openModal.data.LoanPlan.planMonth,
                      openModal.data.LoanPlan.penalty,
                    ),
                  ),
                })
              }
            >
              Start Loan
            </button>
          ) : (
            <></>
          ),
          activeTabKey1 === "active" ? (
            <button
              className=" mx-1 rounded bg-green-500 px-2 py-1 text-white"
              onClick={() => {
                router.push(`/admin/payment/${openModal.data.referenceNo}`);
              }}
            >
              Proceed to Payment
            </button>
          ) : (
            <></>
          ),
        ]}
      >
        {openModal.data && (
          <div className=" flex flex-col text-sm">
            <div className=" flex text-base font-medium text-gray-700">
              Borrower
            </div>
            <div className=" rounded border border-gray-300 bg-gray-50 p-2">
              <div>
                <span>Name :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.Borrower.firstName} ${openModal.data.Borrower.middleName} ${openModal.data.Borrower.lastName}`}</span>
              </div>
              <div>
                <span>Address :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.Borrower.address}`}</span>
              </div>
              <div>
                <span>Contact :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.Borrower.contact}`}</span>
              </div>
              <div>
                <span>Email :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.Borrower.email}`}</span>
              </div>
            </div>

            <div className=" mt-2 flex text-base font-medium text-gray-700">
              Loan Details{" "}
            </div>
            <div className=" rounded border border-gray-300 bg-gray-50 p-2">
              <div>
                <span>Reference No :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.referenceNo}`}</span>
              </div>
              <div>
                <span>Loan Type :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.LoanType.name.toUpperCase()}`}</span>
              </div>
              <div>
                <span>Loan Plan :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.LoanPlan.planMonth} (Month/s), ${openModal.data.LoanPlan.interest}% (Interest), ${openModal.data.LoanPlan.penalty}% (Overdue Penalty)`}</span>
              </div>
              <div>
                <span>Amount :</span>{" "}
                <span className=" font-semibold">{`${openModal.data.amount}`}</span>
              </div>
              <div className=" mt-2 flex flex-row justify-between rounded border border-green-500 bg-green-100 p-2 text-green-700">
                <div>
                  <div>Total Payable Amount :</div>
                  <div>Monthly Payable Amount :</div>
                  <div>Overdue Penalty (Per month) :</div>
                </div>
                <div className=" flex min-w-20 flex-row justify-start gap-2">
                  <div>
                    <div>₱</div>
                    <div>₱</div>
                    <div>₱</div>
                  </div>
                  {
                    <div>
                      <div>
                        {getTotalPayableAmount(
                          openModal.data.amount,
                          openModal.data.LoanPlan.interest,
                        )}
                      </div>
                      <div>
                        {getMonthlyPayableAmount(
                          openModal.data.amount,
                          openModal.data.LoanPlan.interest,
                          openModal.data.LoanPlan.planMonth,
                        )}
                      </div>
                      <div>
                        {getMonthlyOverduePenalty(
                          openModal.data.amount,
                          openModal.data.LoanPlan.interest,
                          openModal.data.LoanPlan.planMonth,
                          openModal.data.LoanPlan.penalty,
                        )}
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
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

export default Loans;
