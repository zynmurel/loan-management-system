"use client";
import { Form, Input } from "antd";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const loginLocalStorage = (user: string, id: number, type: string) => {
    localStorage.setItem("userType", user),
      localStorage.setItem("userId", id.toString());
    localStorage.setItem("adminType", type);
  };
  const { mutate, isLoading } = api.login.login.useMutation({
    onSuccess: (data) => {
      router.refresh();
      if (data.userId === "error") {
        localStorage.clear();
        toast.error("User not found");
        form.setFields([
          {
            name: "username",
            errors: [""],
          },
          {
            name: "password",
            errors: [""],
          },
        ]);
      } else if (data.userType === "admin") {
        toast.success("Logged in as admin");
        loginLocalStorage(data.userType, data.userId, data.adminType);
      } else if (data.userType === "borrower") {
        loginLocalStorage(data.userType, data.userId, data.adminType);
        toast.success("Logged in as borrower");
      }
    },
  });
  const onLogin = (e: any) => {
    const { username, password } = e;
    mutate({
      username: username,
      password: password,
    });
  };
  return (
    <div className=" z-20 flex flex-col items-center justify-center rounded p-5">
      <div className=" text-5xl font-semibold uppercase text-white">
        Welcome
      </div>
      <div className=" mb-4 w-96 text-center text-white">
        MULTIPURPOSE COOPERATIVE WEB-BASED LOAN INFORMATION SYSTEM
      </div>

      <Form
        form={form}
        name="basic"
        onFinish={onLogin}
        autoComplete="off"
        className=" flex w-72 flex-col"
      >
        <Form.Item name={"username"} rules={[{ required: true }]}>
          <Input size="large" placeholder="Username or Email " />
        </Form.Item>
        <Form.Item name={"password"} rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>
        <button
          type="submit"
          className="h-10 w-full rounded-full border border-cyan-600 bg-cyan-300 text-lg text-cyan-800 hover:brightness-110"
        >
          {isLoading ? "Logging in ..." : "Login"}
        </button>
      </Form>
      <a href="/signup" className=" mt-3 text-white">
        Register
      </a>
    </div>
  );
};

export default LoginPage;
