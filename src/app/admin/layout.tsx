"use client";
import { Button, Dropdown, Layout, MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import MenuSider from "../_components/sider";
import { usePathname, useRouter } from "next/navigation";
import { BsDot } from "react-icons/bs";

import {
  FaHome,
  FaCommentDollar,
  FaCoins,
  FaBook,
  FaPiggyBank,
  FaCreditCard,
  FaUsersCog,
} from "react-icons/fa";
import { RiGitRepositoryFill } from "react-icons/ri";
import { RecoilRoot } from "recoil";
import { api } from "~/trpc/react";

const siderTitle = "Loan Management System";
const getSiderItems = (isSuper: boolean) => {
  return [
    {
      icon: <FaHome />,
      title: "Home",
      url: "/admin",
      key: "home",
    },
    {
      icon: <FaCommentDollar />,
      title: "Loans",
      url: "/admin/loans",
      key: "loans",
    },
    {
      icon: <FaCoins />,
      title: "Payment",
      url: "/admin/payment",
      key: "payment",
    },
    {
      icon: <FaBook />,
      title: "Borrowers",
      url: "/admin/borrowers",
      key: "borrowers",
    },
    {
      icon: <FaPiggyBank />,
      title: "Loan Plans",
      url: "/admin/loan-plans",
      key: "loan-plans",
    },
    {
      icon: <FaCreditCard />,
      title: "Loan Types",
      url: "/admin/loan-types",
      key: "loan-types",
    },
    {
      icon: <RiGitRepositoryFill />,
      title: "Reports",
      url: "/admin/report",
      key: "reports",
    },
    isSuper && {
      icon: <FaUsersCog />,
      title: "Admins",
      url: "/admin/accounts",
      key: "admins",
    },
  ];
};
const headerContent = {
  title: "Admin",
  icon: <FaUsersCog />,
};
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = async () => {
    const clearstorage = async () => {
      return await localStorage.clear();
    };
    clearstorage().then(() => router.push("/"));
  };
  const isSuper = localStorage.getItem("adminType") === "super_admin";
  const siderItems = getSiderItems(isSuper) as {
    icon: JSX.Element;
    title: string;
    url: string;
    key: string;
  }[];
  const userId = localStorage.getItem("userId");
  const { data: admin } = api.admin.getAdmin.useQuery({
    id: userId ? parseInt(userId) : 0,
  });

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
    if (pathname.includes("/admin/payment/")) {
      return `Payment - Loan Ref No. ${pathname.slice(15)}`;
    }
    const active = siderItems.find((data) => data.url === pathname);
    return active?.title || "";
  };
  return (
    <RecoilRoot>
      <div className=" flex min-h-screen w-full flex-row items-center justify-center">
        <div className=" flex min-h-screen min-w-64 max-w-64 flex-col items-center  bg-blue-500 p-5">
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
                <div className=" flex flex-row items-center text-sm">
                  {isSuper ? "Super Admin" : headerContent.title}{" "}
                  <div className=" flex flex-row items-center text-base">
                    <BsDot />
                    <div className=" text-xs uppercase text-green-600">
                      {admin?.name}
                    </div>
                  </div>
                </div>
                <div className=" text-2xl">{headerContent.icon}</div>
              </div>
            </Dropdown>
          </Header>
          <Content className=" flex p-4">{children}</Content>
        </Layout>
      </div>
    </RecoilRoot>
  );
};

export default AdminLayout;
