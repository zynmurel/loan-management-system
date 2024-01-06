"use client";
import { Form, Input, Modal, Table } from "antd";
import Search from "antd/es/input/Search";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const LoanType = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [activeLoanType, setActiveLoanType] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const { mutate: createLoanType, isLoading: createIsLoading } =
    api.loanType.createLoanType.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetch();
        toast.success("Loan type added!");
      },
    });
  const { mutate: deleteLoanType, isLoading: deleteIsLoading } =
    api.loanType.deleteLoanType.useMutation({
      onSuccess: () => {
        form.resetFields();
        setActiveLoanType(null);
        refetch();
        toast.success("Loan type deleted!");
      },
    });
  const { mutate: editLoanType, isLoading: editIsLoading } =
    api.loanType.editLoanType.useMutation({
      onSuccess: () => {
        form2.resetFields();
        refetch();
        toast.success("Loan type edited!");
        setActiveLoanType(null);
      },
    });

  const { data, refetch } = api.loanType.getAllLoanTypes.useQuery({
    searchText,
  });
  const onFinish = (e: { name: string; description: string }) => {
    createLoanType({
      ...e,
    });
  };
  const onFinishEdit = (e: { name: string; description: string }) => {
    editLoanType({
      ...e,
      id: activeLoanType.data.id,
    });
  };
  const onCloseModal = () => {
    setActiveLoanType(null);
  };
  const openModal = (type: string, data: any) => {
    setActiveLoanType({
      type,
      data,
    });
  };
  const onDeleteLoanType = () => {
    deleteLoanType({
      id: activeLoanType.data.id,
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
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
    if (activeLoanType?.data) {
      const data = activeLoanType.data;
      form2.setFieldsValue({
        name: data.name,
        description: data.description,
      });
    }
  }, [activeLoanType]);
  return (
    <div className=" flex w-full flex-row justify-center gap-5 pt-5">
      <div className=" flex w-1/4  flex-col ">
        <div className=" mb-5 text-2xl text-gray-500">Add Loan Type</div>
        <div className=" flex-col rounded bg-white p-3">
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            className=" flex w-full flex-col"
          >
            <div className=" mb-2 mt-2 text-sm text-gray-500">Loan Name</div>
            <Form.Item
              name={"name"}
              rules={[{ required: true, message: "Loan name is blank" }]}
            >
              <Input size="large" placeholder="Input loan name" />
            </Form.Item>
            <div className=" mb-2 mt-2 text-sm text-gray-500">
              Loan Description
            </div>
            <Form.Item
              name={"description"}
              rules={[{ required: true, message: "Loan description is blank" }]}
            >
              <TextArea size="large" placeholder="Input loan description" />
            </Form.Item>
            <button
              type="submit"
              disabled={createIsLoading}
              className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
            >
              {createIsLoading ? "Adding ..." : "Add Loan Type"}
            </button>
          </Form>
        </div>
      </div>
      <div className=" flex flex-1 flex-col">
        <div className=" mb-5 text-2xl text-gray-500">Loan Types</div>
        <div className=" flex min-h-96 flex-col rounded  bg-white">
          <div className=" w-1/3 p-5 px-2">
            <Search
              width={10}
              className=" flex-none"
              size="large"
              placeholder="Search"
              onSearch={(e) => setSearchText(e)}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearchText("");
                }
              }}
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
            open={activeLoanType?.type === "delete"}
            onCancel={onCloseModal}
            width={350}
            footer={[]}
          >
            {activeLoanType?.data && (
              <div>
                {activeLoanType.data.Loans.length ? (
                  <div className=" flex flex-col">
                    <div>
                      You cant delete Loan Types that is already connected to
                      other loans?
                    </div>
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
            open={activeLoanType?.type === "edit"}
            onCancel={onCloseModal}
            width={350}
            footer={[]}
          >
            {activeLoanType?.data && (
              <div>
                <Form
                  form={form2}
                  name="basic"
                  onFinish={onFinishEdit}
                  autoComplete="off"
                  className=" flex w-full flex-col"
                >
                  <div className=" mb-2 mt-2 text-sm text-gray-500">
                    Loan Name
                  </div>
                  <Form.Item
                    name={"name"}
                    rules={[{ required: true, message: "Loan name is blank" }]}
                  >
                    <Input size="large" placeholder="Input loan name" />
                  </Form.Item>
                  <div className=" mb-2 mt-2 text-sm text-gray-500">
                    Loan Description
                  </div>
                  <Form.Item
                    name={"description"}
                    rules={[
                      { required: true, message: "Loan description is blank" },
                    ]}
                  >
                    <TextArea
                      size="large"
                      placeholder="Input loan description"
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
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LoanType;
