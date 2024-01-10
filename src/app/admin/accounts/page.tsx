/* eslint-disable @typescript-eslint/prefer-for-of */
"use client";
import { Form, Input, Modal, Table } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
import { IoMdAdd } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface DataType {
  id: number;
  name: string;
  type: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminAccountsPage = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [activeAdmin, setActiveAdmin] = useState<any>(null);
  const [addModal, setAddModal] = useState(false);
  const [showPassId, setShowPassId] = useState(0);
  const [searchText, setSearchText] = useState("");
  const adminId = localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : "0";

  const { mutate: createAccount, isLoading: createIsLoading } =
    api.admin.createAccount.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetch();
        setAddModal(false);
        toast.success("Admin added!");
      },
      onError: () => {
        toast.error("This admin name or username is already used");
        form.setFields([
          {
            name: "name",
            errors: [""],
          },
          {
            name: "username",
            errors: [""],
          },
        ]);
      },
    });
  const { mutate: deleteAdmin, isLoading: deleteIsLoading } =
    api.admin.deleteAdmin.useMutation({
      onSuccess: () => {
        form.resetFields();
        setActiveAdmin(null);
        refetch();
        toast.success("Admin deleted!");
      },
    });
  const { mutate: editAdmin, isLoading: editIsLoading } =
    api.admin.editAdmin.useMutation({
      onSuccess: () => {
        form2.resetFields();
        refetch();
        toast.success("Admin details edited!");
        setActiveAdmin(null);
      },
      onError: () => {
        toast.error("This admin name or username is already used");
        form2.setFields([
          {
            name: "name",
            errors: [""],
          },
          {
            name: "username",
            errors: [""],
          },
        ]);
      },
    });

  const { data, refetch } = api.admin.getAllAdmin.useQuery({
    searchText,
  });
  const onFinish = (e: {
    name: string;
    username: string;
    password: string;
  }) => {
    createAccount({
      ...e,
    });
  };
  const onFinishEdit = (e: {
    name: string;
    username: string;
    password: string;
  }) => {
    editAdmin({
      ...e,
      id: activeAdmin.data.id,
    });
  };
  const onCloseModal = () => {
    setActiveAdmin(null);
  };
  const onCloseAddAdminModal = () => {
    setAddModal(false);
    form.resetFields();
  };
  const openModal = (type: string, data: any) => {
    setActiveAdmin({
      type,
      data,
    });
  };
  const onDeleteAdmin = () => {
    deleteAdmin({
      id: activeAdmin.data.id,
    });
  };
  const showPassword = (id: number, password: string) => {
    let hiddenPassword = "";
    for (let x = 0; x < password.length; x++) {
      hiddenPassword = hiddenPassword + "*";
    }
    const onClickEye = (pass: boolean) => {
      if (pass) {
        setShowPassId(0);
      } else {
        setShowPassId(id);
      }
    };
    const pass = id === showPassId;
    return (
      <div className=" flex w-48 items-center justify-between">
        {pass ? password : hiddenPassword}
        <div
          onClick={() => onClickEye(pass)}
          className=" cursor-pointer text-lg text-gray-600"
        >
          {pass ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    );
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (data) => {
        return data === "admin" ? "Admin" : "Super Admin";
      },
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (data, _) => {
        return showPassword(_.id, data);
      },
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
    if (activeAdmin?.data) {
      const data = activeAdmin.data;
      form2.setFieldsValue({
        name: data.name,
        username: data.username,
        password: data.password,
      });
    }
  }, [activeAdmin]);
  return (
    <div className=" flex w-full flex-row justify-center gap-5 pt-5">
      <Modal
        title="Add New Admin Account"
        open={addModal}
        onCancel={onCloseAddAdminModal}
        width={350}
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
              <div className=" mb-2 mt-2 text-sm text-gray-500">Admin Name</div>
              <Form.Item
                name={"name"}
                rules={[{ required: true, message: "Admin name is blank" }]}
              >
                <Input size="large" placeholder="Input admin assigned name" />
              </Form.Item>
              <div className=" mb-2 mt-2 text-sm text-gray-500">Username</div>
              <Form.Item
                name={"username"}
                rules={[{ required: true, message: "Username is blank" }]}
              >
                <Input size="large" placeholder="Input admin username" />
              </Form.Item>
              <div className=" mb-2 mt-2 text-sm text-gray-500">Password</div>
              <Form.Item
                name={"password"}
                rules={[{ required: true, message: "Password is blank" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Input admin password"
                />
              </Form.Item>
              <button
                type="submit"
                disabled={createIsLoading}
                className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
              >
                {createIsLoading ? "Adding ..." : "Add Admin"}
              </button>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal
        title="Delete"
        open={activeAdmin?.type === "delete"}
        onCancel={onCloseModal}
        width={350}
        footer={[]}
      >
        {activeAdmin?.data &&
          (activeAdmin?.data.type === "super_admin" ||
            activeAdmin?.data.id == adminId ? (
            <div>You can't delete Super Admin Account</div>
          ) : (
            <div>
              <div className=" flex flex-col">
                <div>Are you sure you want to delete this Admin?</div>
                <div className=" mt-3 flex flex-row gap-2">
                  <button
                    onClick={onDeleteAdmin}
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
            </div>
          ))}
      </Modal>
      <Modal
        title="Edit"
        open={activeAdmin?.type === "edit"}
        onCancel={onCloseModal}
        width={350}
        footer={[]}
      >
        {activeAdmin?.data && (
          <div>
            <Form
              form={form2}
              name="basic"
              onFinish={onFinishEdit}
              autoComplete="off"
              className=" flex w-full flex-col"
            >
              <div className=" mb-2 mt-2 text-sm text-gray-500">Admin Name</div>
              <Form.Item
                name={"name"}
                rules={[{ required: true, message: "Admin name is blank" }]}
              >
                <Input size="large" placeholder="Input admin assigned name" />
              </Form.Item>
              <div className=" mb-2 mt-2 text-sm text-gray-500">Username</div>
              <Form.Item
                name={"username"}
                rules={[{ required: true, message: "Username is blank" }]}
              >
                <Input size="large" placeholder="Input admin username" />
              </Form.Item>
              <div className=" mb-2 mt-2 text-sm text-gray-500">Password</div>
              <Form.Item
                name={"password"}
                rules={[{ required: true, message: "Password is blank" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Input admin password"
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
      <div className=" flex flex-1 flex-col">
        <div className=" mb-5 flex flex-row justify-between gap-3 text-2xl text-gray-500">
          Admin Accounts
          <button
            onClick={() => setAddModal(true)}
            className=" flex flex-row items-center gap-3 rounded bg-green-500 p-2 px-5 text-base text-white shadow-md hover:brightness-110"
          >
            <IoMdAdd className={"text-2xl"} />
            Add New Account
          </button>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default AdminAccountsPage;
