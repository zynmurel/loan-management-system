"use client";
import { Form, Input } from "antd";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImageUpload from "~/app/admin/borrowers/components/imageUpload";
import { imageDB } from "~/app/_utils/firebase/firebaseupload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<any>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const loginLocalStorage = (user: string, id: number) => {
    localStorage.setItem("userType", user),
      localStorage.setItem("userId", id.toString());
  };
  const registration = api.signup.register.useMutation({
    onSuccess: (data) => {
      toast.success("Successfully Registered");
      form.resetFields();
      loginLocalStorage("borrower", data.id);
      router.refresh();
      setSubmitLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
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
  const handleUpload = async () => {
    if (imageFile !== null) {
      const imageRef = ref(imageDB, `loanManagementSystem/${v4()}`);
      return uploadBytes(imageRef, imageFile).then((val) => {
        return getDownloadURL(val.ref).then((url) => {
          return url;
        });
      });
    } else {
      return null;
    }
  };
  const onLogin = async (e: any) => {
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
        registration.mutateAsync({
          ...e,
          imageBase64: imageUrl,
          status: "approved",
        });
      }
    });
  };
  return (
    <div className=" z-20 flex flex-col items-center justify-center rounded p-5">
      <div className=" text-5xl font-semibold uppercase text-white">
        REGISTER
      </div>
      <div className=" mb-4 w-96 text-center text-white">
        MULTIPURPOSE COOPERATIVE WEB-BASED LOAN INFORMATION SYSTEM
      </div>

      <Form
        form={form}
        name="basic"
        onFinish={onLogin}
        autoComplete="off"
        className=" flex w-auto flex-col text-lg text-white"
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
          className="h-10 w-full rounded-full border border-cyan-600 bg-cyan-300 text-lg text-cyan-800 hover:brightness-110"
        >
          {submitLoading ? "Loading..." : "Register"}
        </button>
      </Form>
      <div className=" mt-3  text-cyan-300">
        or{" "}
        <a href="/login" className=" text-sm text-white">
          Login
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
