"use client";
import { Form, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { createContext } from "react";
import { api } from "~/trpc/react";

export const LoanContext = createContext<any>({});

const LoansLayout = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [activeTabKey1, setActiveTabKey1] = useState<string>("approved");
  const [searchTextIndex, setSearchTextIndex] = useState("");

  const { data: loan_types } = api.loans.getAllLoanTypes.useQuery();
  const { data: loan_plans } = api.loans.getAllLoanPlans.useQuery();
  const { data: borrowers } = api.loans.getBorrowers.useQuery({ searchText });

  const { mutate: createLoan, isLoading: createLoanLoading } =
    api.loans.createLoan.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetchLoans();
        setAddModal(false);
        toast.success("Loan added! (Approved Loans)");
      },
    });

  const { data: loans, refetch: refetchLoans } =
    api.loans.getLoanByStatus.useQuery({
      searchText: searchTextIndex,
      status: activeTabKey1,
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
      status: "approved",
      borrowerId: e.borrowersIdNo,
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

  const getTotalPayableAmount = (amount: number, interest: number) => {
    return (amount + (interest / 100) * amount).toFixed(2);
  };

  const getMonthlyPayableAmount = (
    amount: number,
    interest: number,
    months: number,
  ) => {
    return ((amount + (interest / 100) * amount) / months).toFixed(2);
  };

  const getMonthlyOverduePenalty = (
    amount: number,
    interest: number,
    months: number,
    penalty: number,
  ) => {
    return (
      ((amount + (interest / 100) * amount) / months) *
      (penalty / 100)
    ).toFixed(2);
  };

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
                <div>Borrower :</div>
                <div className=" flex w-full flex-row gap-1">
                  <Form.Item
                    name={"borrowersIdNo"}
                    className="w-full"
                    rules={[{ required: true }]}
                  >
                    <Select
                      size="large"
                      showSearch
                      placeholder="Search Borrowers ID"
                      optionFilterProp="children"
                      onSearch={(e) => {
                        console.log(e);
                        setSearchText(e);
                      }}
                      filterOption={(input, option) => {
                        return true;
                      }}
                      options={borrowers}
                    />
                  </Form.Item>
                </div>
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
                  {createLoanLoading ? "Adding ..." : "Add Loan"}
                </button>
              </Form>
            </div>
          </div>
        </Modal>
        <div className=" flex flex-1 flex-col">
          <div className=" mb-5 flex flex-row justify-between gap-3 text-2xl text-gray-500">
            Loan Lists
            <button
              onClick={onOpenAddModal}
              className=" flex flex-row items-center gap-3 rounded bg-green-500 p-2 px-5 text-base text-white shadow-md hover:brightness-110"
            >
              <IoMdAdd className={"text-2xl"} />
              Add New Loan
            </button>
          </div>
          {children}
        </div>
      </div>
    </LoanContext.Provider>
  );
};

export default LoansLayout;
