"use client";
import { Button, Dropdown, Layout, MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import MenuSider from "../_components/sider";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaCommentDollar,
  FaCoins,
  FaBook,
  FaPiggyBank,
  FaCreditCard,
  FaUsersCog,
  FaUser,
} from "react-icons/fa";

const siderTitle = "Loan Management System";
const siderItems = [
  {
    icon: <FaHome />,
    title: "Home",
    url: "/borrower",
    key: "borrower",
  },
];
const headerContent = {
  title: "Borrower",
  icon: <FaUser />,
};
const BorrowerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
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
  const findTitle = () => {
    const active = siderItems.find((data) => data.url === pathname);
    return active?.title || "";
  };
  return (
    <div className=" flex min-h-screen w-full flex-row items-center justify-center">
      <div className=" flex min-h-screen w-72 flex-col items-center  bg-blue-500 p-5">
        <MenuSider siderItems={siderItems} siderTitle={siderTitle} />
      </div>
      <Layout className=" min-h-screen">
        <Header className="flex flex-1 items-center justify-between  bg-white px-3 shadow-lg">
          <div className=" px-3 text-xl font-semibold text-gray-600">
            {findTitle()}
          </div>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <div className=" flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-gray-200 p-2 text-lg text-gray-800 hover:bg-slate-200 ">
              <div>{headerContent.title}</div>
              <div className=" text-2xl">{headerContent.icon}</div>
            </div>
          </Dropdown>
        </Header>
        <Content className=" p-4">{children}</Content>
      </Layout>
    </div>
  );
};

export default BorrowerLayout;
