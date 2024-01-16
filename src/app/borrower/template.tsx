"use client";
import { Form, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { createContext } from "react";
import { api } from "~/trpc/react";
import {
  getMonthlyOverduePenalty,
  getMonthlyPayableAmount,
  getTotalPayableAmount,
} from "~/app/_utils/helpers/paymentComputations";

export const LoanContext = createContext<any>({});

const LoansLayout = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  const id = localStorage.getItem("userId");
  const [searchText, setSearchText] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [activeTabKey1, setActiveTabKey1] = useState<string>("active");
  const [searchTextIndex, setSearchTextIndex] = useState("");

  const { data: loan_types } = api.borrower_loan.getAllLoanTypes.useQuery();
  const { data: loan_plans } = api.borrower_loan.getAllLoanPlans.useQuery();
  const { data: borrowers } = api.borrower_loan.getBorrowers.useQuery({
    searchText,
  });
  const { data: borrower } = api.borrower_loan.getBorrowerById.useQuery({
    id: parseInt(id || "0"),
  });

  const { mutate: createLoan, isLoading: createLoanLoading } =
    api.borrower_loan.createLoan.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetchLoans();
        setAddModal(false);
        toast.success("Loan requested! ( Loan Requests )");
      },
    });
  const { data: loans, refetch: refetchLoans } =
    api.borrower_loan.getLoanByStatus.useQuery({
      searchText: searchTextIndex,
      status: activeTabKey1,
      id: parseInt(id || "0"),
    });
  const onCloseAddModal = () => {
    setAddModal(false);
    form.resetFields();
  };

  const onOpenAddModal = () => {
    setAddModal(true);
  };

  const onFinish = (e: any) => {
    createLoan({
      amount: e.amount,
      status: "request",
      borrowerId: borrower?.id || 0,
      loanPlanId: e.loanPlanId,
      loanTypeId: e.loanTypeId,
    });
  };

  const amountChecker = Form.useWatch((values) => {
    return values.amount;
  }, form);

  const loanPlanChecker = Form.useWatch((values) => {
    return values.loanPlanId;
  }, form);

  const activeLoanPlan = loan_plans?.find(
    (data) => data.value === loanPlanChecker,
  );

  const checker = !!amountChecker && !!loanPlanChecker;

  const values = {
    loans,
    activeTabKey1,
    searchTextIndex,
    setSearchTextIndex,
    setActiveTabKey1,
    refetchLoans,
  };
  return (
    <LoanContext.Provider value={values}>
      <div className=" flex w-full flex-row justify-center gap-5 pt-5">
        <Modal
          title="Add New Loan"
          open={addModal}
          onCancel={onCloseAddModal}
          width={500}
          footer={[]}
        >
          <div className=" flex flex-col ">
            <div className=" flex-col rounded bg-white p-3">
              <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                className=" flex w-full flex-col"
              >
                <div>Loan Type :</div>
                <div className=" flex w-full flex-row gap-1">
                  <Form.Item
                    name={"loanTypeId"}
                    className="w-full"
                    rules={[{ required: true }]}
                  >
                    <Select
                      size="large"
                      showSearch
                      placeholder="Select Loan Type"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return option?.label
                          .toLowerCase()
                          .includes(input.toLowerCase())
                          ? true
                          : false;
                      }}
                      options={loan_types}
                    />
                  </Form.Item>
                </div>
                <div>Loan Plan :</div>
                <div className=" flex w-full flex-row gap-1">
                  <Form.Item
                    name={"loanPlanId"}
                    className="w-full"
                    rules={[{ required: true }]}
                  >
                    <Select
                      size="large"
                      showSearch
                      placeholder="Select Loan Plan"
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return option?.label
                          .toLowerCase()
                          .includes(input.toLowerCase())
                          ? true
                          : false;
                      }}
                      options={loan_plans}
                    />
                  </Form.Item>
                </div>
                <div>Amout :</div>
                <div className=" flex w-full flex-row gap-1">
                  <Form.Item
                    className=" w-full"
                    name={"amount"}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      prefix={<div className=" pr-2 text-lg">₱</div>}
                      className=" w-full"
                      size="large"
                      placeholder="Amount"
                    />
                  </Form.Item>
                </div>

                <div className=" mb-4 flex flex-row justify-between rounded border border-green-500 bg-green-100 p-2 text-green-700">
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
                    {checker && activeLoanPlan ? (
                      <div>
                        <div>
                          {getTotalPayableAmount(
                            amountChecker,
                            activeLoanPlan.interest,
                          )}
                        </div>
                        <div>
                          {getMonthlyPayableAmount(
                            amountChecker,
                            activeLoanPlan.interest,
                            activeLoanPlan.planMonth,
                          )}
                        </div>
                        <div>
                          {getMonthlyOverduePenalty(
                            amountChecker,
                            activeLoanPlan.interest,
                            activeLoanPlan.planMonth,
                            activeLoanPlan.penalty,
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>- - - - -</div>
                        <div>- - - - -</div>
                        <div>- - - - -</div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createLoanLoading}
                  className=" h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110 disabled:bg-blue-300"
                >
                  {createLoanLoading ? "Submitting ..." : "Request Loan"}
                </button>
              </Form>
            </div>
          </div>
        </Modal>
        <div className=" flex flex-1 flex-col">
          <div className=" mb-5 flex flex-row justify-between gap-3 text-3xl uppercase text-gray-800">
            <div className=" flex flex-col">
              <div className=" -mb-1 flex flex-row items-center gap-2 text-xl text-gray-600">
                {`# ${borrower?.borrowerIdNo}`}{" "}
                {borrower?.status === "pending" ? (
                  <span className=" text-base text-orange-500">{`${"Account for Approval"}`}</span>
                ) : (
                  ""
                )}
              </div>
              <div>{`${borrower?.firstName} ${borrower?.middleName} ${borrower?.lastName}`}</div>
            </div>
            <button
              onClick={onOpenAddModal}
              disabled={borrower?.status === "pending"}
              className=" flex flex-row items-center gap-3 rounded-xl bg-green-500 p-2 px-5 text-base text-white shadow-md hover:brightness-105 disabled:bg-gray-300"
            >
              <IoMdAdd className={"text-2xl"} />
              Request a Loan
            </button>
          </div>
          {children}
        </div>
      </div>
    </LoanContext.Provider>
  );
};

export default LoansLayout;
