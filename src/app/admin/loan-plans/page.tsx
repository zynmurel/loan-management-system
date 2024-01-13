"use client";
import { Form, Input, InputNumber, Modal, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";

const LoanPlan = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [activeLoanPlan, setActiveLoanPlan] = useState<any>(null);
  const [sort, setSort] = useState("asc");
  const { mutate: createLoanPlan, isLoading: createIsLoading } =
    api.loanPlan.createLoanPlan.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetch();
        toast.success("Loan plan added!");
      },
    });
  const { mutate: deleteLoanPlan, isLoading: deleteIsLoading } =
    api.loanPlan.deleteLoanPlan.useMutation({
      onSuccess: () => {
        form.resetFields();
        setActiveLoanPlan(null);
        refetch();
        toast.success("Loan plan deleted!");
      },
    });
  const { mutate: editLoanPlan, isLoading: editIsLoading } =
    api.loanPlan.editLoanPlan.useMutation({
      onSuccess: () => {
        form2.resetFields();
        refetch();
        toast.success("Loan plan edited!");
        setActiveLoanPlan(null);
      },
    });

  const { data, refetch } = api.loanPlan.getAllLoanPlans.useQuery({
    sort,
  });
  const onFinish = (e: {
    planMonth: number;
    interest: number;
    penalty: number;
  }) => {
    createLoanPlan({
      ...e,
    });
  };
  const onFinishEdit = (e: {
    planMonth: number;
    interest: number;
    penalty: number;
  }) => {
    editLoanPlan({
      ...e,
      id: activeLoanPlan.data.id,
    });
  };
  const onCloseModal = () => {
    setActiveLoanPlan(null);
  };
  const openModal = (type: string, data: any) => {
    setActiveLoanPlan({
      type,
      data,
    });
  };
  const onDeleteLoanType = () => {
    deleteLoanPlan({
      id: activeLoanPlan.data.id,
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: "Plan (months)",
      dataIndex: "planMonth",
    },
    {
      title: "Interest (%)",
      dataIndex: "interest",
    },
    {
      title: "Monthly Overdue Penalty (%)",
      dataIndex: "penalty",
    },
    {
      title: "Action",
      align: "center",
      render: (data: any) => (
        <div className=" flex flex-row items-center justify-center gap-2">
          <button
            onClick={() => openModal("edit", data)}
            className="  flex-1 rounded bg-orange-400 py-1 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => openModal("delete", data)}
            className=" flex-1 rounded bg-red-400 py-1 text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (activeLoanPlan?.data) {
      const data = activeLoanPlan.data;
      form2.setFieldsValue({
        planMonth: data.planMonth,
        interest: data.interest,
        penalty: data.penalty,
      });
    }
  }, [activeLoanPlan]);
  return (
    <div className=" flex w-full flex-row justify-center gap-5 pt-5">
      <div className=" flex w-1/4  flex-col ">
        <div className=" mb-5 text-2xl text-gray-500">Add Loan Plan</div>
        <div className=" flex-col rounded bg-white p-3">
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            className=" flex w-full flex-col"
          >
            <div className=" mb-2 mt-2 text-sm text-gray-500">
              Plans (months)
            </div>
            <Form.Item
              name={"planMonth"}
              rules={[{ required: true, message: "Plan is blank" }]}
            >
              <InputNumber
                min={1}
                addonAfter={<>Month/s</>}
                className="w-full flex-1"
                size="large"
                placeholder="Input count of months"
              />
            </Form.Item>
            <div className=" mb-2 mt-2 text-sm text-gray-500">Interest</div>
            <Form.Item
              name={"interest"}
              rules={[{ required: true, message: "Interest is blank" }]}
            >
              <InputNumber
                addonAfter={<>%</>}
                className="w-full flex-1"
                size="large"
                placeholder="Input interest"
              />
            </Form.Item>
            <div className=" mb-2 mt-2 text-sm text-gray-500">
              Monthly Overdue Penalty
            </div>
            <Form.Item
              name={"penalty"}
              rules={[
                { required: true, message: "Monthly overdue penalty is blank" },
              ]}
            >
              <InputNumber
                addonAfter={<>%</>}
                className="w-full flex-1"
                size="large"
                placeholder="Input monthly overdue penalty"
              />
            </Form.Item>
            <button
              type="submit"
              disabled={createIsLoading}
              className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
            >
              {createIsLoading ? "Adding ..." : "Add Loan Plan"}
            </button>
          </Form>
        </div>
      </div>
      <div className=" flex flex-1 flex-col">
        <div className=" mb-5 text-2xl text-gray-500">Loan Plans</div>
        <div className=" flex min-h-96 flex-col rounded  bg-white">
          <div className=" w-1/3 gap-2 p-5 px-5">
            Sort By Month:
            <Select
              defaultValue={sort}
              style={{ width: 120 }}
              onChange={(e) => setSort(e)}
              className=" ml-3"
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
            />
          </div>
          <Table
            // rowSelection={rowSelection}
            pagination={{ pageSize: 5 }}
            columns={columns}
            dataSource={data}
          />
          <Modal
            title="Delete"
            open={activeLoanPlan?.type === "delete"}
            onCancel={onCloseModal}
            width={350}
            footer={[]}
          >
            {activeLoanPlan?.data && (
              <div>
                {activeLoanPlan.data.Loans.length ? (
                  <div className=" flex flex-col">
                    <div>
                      You can't delete Loan Plans that is already connected to
                      other loans
                    </div>
                    <div className=" text-orange-600">{`Loans related to this plan : ${activeLoanPlan.data.Loans.length}`}</div>
                    <div className=" mt-3 flex flex-row gap-2">
                      <button
                        onClick={onCloseModal}
                        className="  flex-1 rounded border bg-white py-1 text-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className=" flex flex-col">
                    <div>Are you sure you want to delete this loan type?</div>
                    <div className=" mt-3 flex flex-row gap-2">
                      <button
                        onClick={onDeleteLoanType}
                        className="  flex-1 rounded bg-red-500 py-1 text-white"
                      >
                        Delete
                      </button>
                      <button
                        onClick={onCloseModal}
                        className="  flex-1 rounded border bg-white py-1 text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>
          <Modal
            title="Edit"
            open={activeLoanPlan?.type === "edit"}
            onCancel={onCloseModal}
            width={350}
            footer={[]}
          >
            {activeLoanPlan?.data && (
              <div>
                {activeLoanPlan.data.Loans.length ? (
                  <div className=" flex flex-col">
                    <div>
                      You can't edit Loan Plans that is already connected to
                      other loans
                    </div>
                    <div className=" text-orange-600">{`Loans related to this plan : ${activeLoanPlan.data.Loans.length}`}</div>
                    <div className=" mt-3 flex flex-row gap-2">
                      <button
                        onClick={onCloseModal}
                        className="  flex-1 rounded border bg-white py-1 text-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <Form
                    form={form2}
                    name="basic"
                    onFinish={onFinishEdit}
                    autoComplete="off"
                    className=" flex w-full flex-col"
                  >
                    <div className=" mb-2 mt-2 text-sm text-gray-500">
                      Plans (months)
                    </div>
                    <Form.Item
                      name={"planMonth"}
                      rules={[{ required: true, message: "Plan is blank" }]}
                    >
                      <InputNumber
                        min={1}
                        addonAfter={<>Month/s</>}
                        className="w-full flex-1"
                        size="large"
                        placeholder="Input count of months"
                      />
                    </Form.Item>
                    <div className=" mb-2 mt-2 text-sm text-gray-500">
                      Interest
                    </div>
                    <Form.Item
                      name={"interest"}
                      rules={[{ required: true, message: "Interest is blank" }]}
                    >
                      <InputNumber
                        addonAfter={<>%</>}
                        className="w-full flex-1"
                        size="large"
                        placeholder="Input interest"
                      />
                    </Form.Item>
                    <div className=" mb-2 mt-2 text-sm text-gray-500">
                      Monthly Overdue Penalty
                    </div>
                    <Form.Item
                      name={"penalty"}
                      rules={[
                        {
                          required: true,
                          message: "Monthly overdue penalty is blank",
                        },
                      ]}
                    >
                      <InputNumber
                        addonAfter={<>%</>}
                        className="w-full flex-1"
                        size="large"
                        placeholder="Input monthly overdue penalty"
                      />
                    </Form.Item>
                    <button
                      type="submit"
                      disabled={createIsLoading}
                      className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
                    >
                      {createIsLoading ? "Submitting ..." : "Submit"}
                    </button>
                  </Form>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LoanPlan;
