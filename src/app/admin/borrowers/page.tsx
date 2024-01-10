/* eslint-disable @typescript-eslint/prefer-for-of */
"use client";
import { Card, Form, Image, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "~/trpc/react";
import { IoMdAdd } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BorrowerAccounts from "./components/BorrowerAccounts";
import ImageUpload from "./components/imageUpload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDB } from "~/app/_utils/firebase/firebaseupload";
import { v4 } from "uuid";

const Borrowers = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [activeBorrower, setActiveBorrower] = useState<any>(null);
  const [addModal, setAddModal] = useState(false);
  const [showPassId, setShowPassId] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeTabKey1, setActiveTabKey1] = useState<string>("approved");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const adminId = localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : "0";

  const { mutate: createAccount, isLoading: createIsLoading } =
    api.borrower.createBorrower.useMutation({
      onSuccess: () => {
        form.resetFields();
        refetchApprovedBorrowers();
        setAddModal(false);
        toast.success("Borrower added!");
        setSubmitLoading(false);
      },
      onError: () => {
        toast.error("This borrowers email or phone number is already used");
        form.setFields([
          {
            name: "email",
            errors: [""],
          },
          {
            name: "contact",
            errors: [""],
          },
        ]);
        setSubmitLoading(false);
      },
    });

  const { data: approvedBorrowers, refetch: refetchApprovedBorrowers } =
    api.borrower.getBorrowersByStatus.useQuery({
      searchText,
      status: "approved",
    });
  const { data: pendingBorrowers, refetch: refetchPendingBorrowers } =
    api.borrower.getBorrowersByStatus.useQuery({
      searchText,
      status: "pending",
    });
  const onFinish = async (e: {
    imageBase64: string;
    firstName: string;
    middleName: string;
    lastName: string;
    status: string;
    contact: string;
    address: string;
    email: string;
    taxNo: string;
    password: string;
  }) => {
    setSubmitLoading(true);
    await handleUpload().then((imageUrl) => {
      if (!imageUrl) {
        form.setFields([
          {
            name: "imageBase64",
            errors: ["Photo required"],
          },
        ]);
        setSubmitLoading(false);
      } else {
        createAccount({
          ...e,
          imageBase64: imageUrl,
          status: "approved",
        });
      }
    });
  };
  //dooonnneeee upp
  const { mutate: deleteBorrower, isLoading: deleteIsLoading } =
    api.borrower.deleteBorrower.useMutation({
      onSuccess: () => {
        form.resetFields();
        setActiveBorrower(null);
        refetchApprovedBorrowers();
        toast.success("Borrower deleted!");
      },
    });
  const { mutate: approveBorrower, isLoading: approveIsLoading } =
    api.borrower.approvedBorrower.useMutation({
      onSuccess: () => {
        form.resetFields();
        setActiveBorrower(null);
        refetchApprovedBorrowers();
        refetchPendingBorrowers();
        toast.success("Borrower Approved!");
      },
    });
  const { mutate: editBorrower, isLoading: editIsLoading } =
    api.borrower.editBorrower.useMutation({
      onSuccess: () => {
        form2.resetFields();
        refetchApprovedBorrowers();
        toast.success("Borrower details edited!");
        setActiveBorrower(null);
        setSubmitLoading(false);
      },
      onError: () => {
        toast.error("This borrowers email or phone number is already used");
        form2.setFields([
          {
            name: "email",
            errors: [""],
          },
          {
            name: "contact",
            errors: [""],
          },
        ]);
        setSubmitLoading(false);
      },
    });
  const onFinishEdit = async (e: {
    imageBase64: string;
    firstName: string;
    middleName: string;
    lastName: string;
    status: string;
    contact: string;
    address: string;
    email: string;
    taxNo: string;
    password: string;
  }) => {
    setSubmitLoading(true);
    if (!imageUrl) {
      console.log("sample");
      await handleUpload().then((imageUrl) => {
        if (!imageUrl) {
          form2.setFields([
            {
              name: "imageBase64",
              errors: ["Photo required"],
            },
          ]);
          setSubmitLoading(false);
        } else {
          editBorrower({
            ...e,
            imageBase64: imageUrl,
            id: activeBorrower.data.id,
          });
        }
      });
    } else {
      editBorrower({
        ...e,
        imageBase64: activeBorrower.data.imageBase64,
        id: activeBorrower.data.id,
      });
    }
  };
  const onCloseModal = () => {
    setActiveBorrower(null);
    setImageUrl(null);
  };
  const onCloseAddAdminModal = () => {
    setAddModal(false);
    form.resetFields();
  };
  const openModal = (type: string, data: any) => {
    setActiveBorrower({
      type,
      data,
    });
  };
  const onDeleteBorrower = () => {
    deleteBorrower({
      id: activeBorrower.data.id,
    });
  };
  const onApproveBorrower = () => {
    approveBorrower({
      id: activeBorrower.data.id,
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
      <div className=" flex w-40 items-center justify-between">
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
  useEffect(() => {
    if (activeBorrower?.data) {
      const data = activeBorrower.data;
      setImageUrl(data.imageBase64);
      form2.setFieldsValue({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        contact: data.contact,
        address: data.address,
        email: data.email,
        taxNo: data.taxNo,
        password: data.password,
      });
    }
  }, [activeBorrower]);
  const tabList = [
    {
      key: "approved",
      tab: "Borrowers List",
    },
    {
      key: "pending",
      tab: "For Approval Borrowers",
    },
  ];

  const handleUpload = async () => {
    if (imageFile !== null) {
      try {
        const imageRef = ref(imageDB, `loanManagementSystem/${v4()}`);
        return uploadBytes(imageRef, imageFile).then((val) => {
          return getDownloadURL(val.ref).then((url) => {
            return url;
          });
        });
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  };
  const contentList: Record<string, React.ReactNode> = {
    approved: (
      <BorrowerAccounts
        showPassword={showPassword}
        openModal={openModal}
        setSearchText={setSearchText}
        borrowers={approvedBorrowers}
        activeTabKey1={activeTabKey1}
        approveBorrower={approveBorrower}
      />
    ),
    pending: (
      <BorrowerAccounts
        showPassword={showPassword}
        openModal={openModal}
        setSearchText={setSearchText}
        borrowers={pendingBorrowers}
        activeTabKey1={activeTabKey1}
        approveBorrower={approveBorrower}
      />
    ),
  };
  return (
    <div className=" flex w-full flex-row justify-center gap-5 pt-5">
      <Modal
        title="Add New Borrower"
        open={addModal}
        onCancel={onCloseAddAdminModal}
        width={600}
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
              <div>Borrower's Photo</div>
              <ImageUpload setImageFile={setImageFile} />
              <div>Borrower's Name</div>
              <div className=" flex w-full flex-row gap-1">
                <Form.Item name={"firstName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="First name" />
                </Form.Item>
                <Form.Item name={"middleName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Middle Name" />
                </Form.Item>
                <Form.Item name={"lastName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
              </div>

              <div>Borrower's Details</div>
              <Form.Item name={"address"} rules={[{ required: true }]}>
                <Input size="large" placeholder="Home Address" />
              </Form.Item>
              <div className=" flex w-full flex-row gap-1">
                <Form.Item name={"email"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Email address" />
                </Form.Item>
                <Form.Item name={"contact"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Phone number" />
                </Form.Item>
                <Form.Item name={"taxNo"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Tax ID" />
                </Form.Item>
              </div>
              <div>Password</div>
              <Form.Item name={"password"} rules={[{ required: true }]}>
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>
              <button
                type="submit"
                disabled={createIsLoading || submitLoading}
                className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
              >
                {createIsLoading || submitLoading
                  ? "Adding ..."
                  : "Add Borrower"}
              </button>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal
        title="Delete"
        open={activeBorrower?.type === "delete"}
        onCancel={onCloseModal}
        width={350}
        footer={[]}
      >
        {activeBorrower?.data && (
          <div>
            <div className=" flex flex-col">
              <div>Are you sure you want to delete this Borrower?</div>
              <div className=" mt-3 flex flex-row gap-2">
                <button
                  onClick={onDeleteBorrower}
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
        )}
      </Modal>
      <Modal
        title="Approve"
        open={activeBorrower?.type === "approve"}
        onCancel={onCloseModal}
        width={350}
        footer={[]}
      >
        {activeBorrower?.data && (
          <div>
            <div className=" flex flex-col">
              <div>Approve this borrower?</div>
              <div className=" mt-3 flex flex-row gap-2">
                <button
                  onClick={onApproveBorrower}
                  className="  flex-1 rounded bg-green-500 py-1 text-white"
                >
                  Approve
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
        )}
      </Modal>
      <Modal
        title="Edit"
        open={activeBorrower?.type === "edit"}
        onCancel={onCloseModal}
        width={600}
        footer={[]}
      >
        {activeBorrower?.data && (
          <div>
            <Form
              form={form2}
              name="basic"
              onFinish={onFinishEdit}
              autoComplete="off"
              className=" flex w-full flex-col"
            >
              <div>Borrower's Photo</div>
              {!imageUrl ? (
                <>
                  <ImageUpload setImageFile={setImageFile} />
                </>
              ) : (
                <div className=" flex w-full flex-col items-center justify-center gap-1">
                  <Image
                    width={200}
                    alt="borrowers_image"
                    src={imageUrl}
                    className=" rounded"
                  />
                  <button
                    type="button"
                    className=" rounded border border-gray-900 p-1 px-4"
                    onClick={() => setImageUrl(null)}
                  >
                    Change Photo
                  </button>
                </div>
              )}
              <div>Borrower's Name</div>
              <div className=" flex w-full flex-row gap-1">
                <Form.Item name={"firstName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="First name" />
                </Form.Item>
                <Form.Item name={"middleName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Middle Name" />
                </Form.Item>
                <Form.Item name={"lastName"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
              </div>

              <div>Borrower's Details</div>
              <Form.Item name={"address"} rules={[{ required: true }]}>
                <Input size="large" placeholder="Home Address" />
              </Form.Item>
              <div className=" flex w-full flex-row gap-1">
                <Form.Item name={"email"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Email address" />
                </Form.Item>
                <Form.Item name={"contact"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Phone number" />
                </Form.Item>
                <Form.Item name={"taxNo"} rules={[{ required: true }]}>
                  <Input size="large" placeholder="Tax ID" />
                </Form.Item>
              </div>
              <div>Password</div>
              <Form.Item name={"password"} rules={[{ required: true }]}>
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>
              <button
                type="submit"
                disabled={createIsLoading || submitLoading}
                className="h-10 w-full rounded border border-cyan-600 bg-blue-500 text-lg text-white hover:brightness-110"
              >
                {createIsLoading || submitLoading ? "Submitting ..." : "Submit"}
              </button>
            </Form>
          </div>
        )}
      </Modal>
      <div className=" flex flex-1 flex-col">
        <div className=" mb-5 flex flex-row justify-between gap-3 text-2xl text-gray-500">
          Borrowers
          <button
            onClick={() => setAddModal(true)}
            className=" flex flex-row items-center gap-3 rounded bg-green-500 p-2 px-5 text-base text-white shadow-md hover:brightness-110"
          >
            <IoMdAdd className={"text-2xl"} />
            Add New Borrower
          </button>
        </div>
        <Card
          style={{ width: "100%" }}
          tabList={tabList}
          activeTabKey={activeTabKey1}
          onTabChange={onTab1Change}
        >
          {contentList[activeTabKey1]}
        </Card>
      </div>
    </div>
  );
};

export default Borrowers;
