"use client";
import { Button, Dropdown, Layout, MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { FaUsersCog } from "react-icons/fa";

const BorrowerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const id = localStorage.getItem("userId");

  const logout = async () => {
    const clearstorage = async () => {
      return await localStorage.clear();
    };
    clearstorage().then(() => router.push("/"));
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          onClick={logout}
          className=" w-full border-red-200 text-red-700"
        >
          Logout
        </Button>
      ),
    },
  ];
  const headerContent = {
    title: "Borrower",
    icon: <FaUsersCog />,
  };
  return (
    <div className=" flex min-h-screen w-full flex-row items-center justify-center">
      <Layout className=" min-h-screen">
        <Header className="flex flex-1 items-center justify-between  bg-blue-500 px-3 text-white shadow-lg">
          <div className=" px-3 text-xl font-semibold text-white">
            LOAN MANAGEMENT SYSTEM
          </div>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <div className=" flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-gray-50 p-2 text-lg text-white hover:bg-slate-200 ">
              <div>{headerContent.title}</div>
              <div className=" text-2xl">{headerContent.icon}</div>
            </div>
          </Dropdown>
        </Header>
        <Content className=" flex w-full justify-center p-4">
          <div className=" w-10/12">{children}</div>
        </Content>
      </Layout>
    </div>
  );
};

export default BorrowerLayout;
