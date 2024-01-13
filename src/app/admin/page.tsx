"use client";
import { useRouter } from "next/navigation";
import {
  FaCommentDollar,
  FaCoins,
  FaBook,
  FaChevronRight,
} from "react-icons/fa";
import { api } from "~/trpc/react";
const AdminHome = () => {
  const { data } = api.home.getHomeDatas.useQuery();
  const router = useRouter();
  const dashboardDetails = [
    {
      title: "Active Loans",
      color: "#517DF6",
      data: `${data?.loans || 0}`,
      icon: <FaCommentDollar />,
      link: "/admin/loans",
      linkText: "View Loans",
    },
    {
      title: "Payments Today",
      color: "#3EB952",
      data: `₱ ${data?.payments?.toFixed(2) || 0.0}`,
      icon: <FaCoins />,
      link: "/admin/payment",
      linkText: "View Payments",
    },
    {
      title: "Borrowers",
      color: "#40BCBC",
      data: `${data?.borrowers || 0}`,
      icon: <FaBook />,
      link: "/admin/borrowers",
      linkText: "View Borrowers",
    },
  ];
  const goToLink = (url: string) => {
    router.push(url);
  };
  return (
    <div className=" flex w-full flex-1 flex-col p-5  text-gray-600">
      <div className=" mb-5 mt-32 text-5xl">Dashboard</div>
      <div className=" grid  w-full grid-cols-3  gap-2">
        {dashboardDetails.map((data) => {
          return (
            <div
              style={{ borderColor: data.color }}
              className={`overflow-hidden rounded-xl  border-l-4 bg-white shadow-md`}
            >
              <div className=" p-5">
                <div
                  style={{ color: data.color }}
                  className=" text-base font-bold uppercase"
                >
                  {data.title}
                </div>
                <div className=" relative flex flex-row">
                  <div className=" p-2 py-5 text-5xl font-bold">
                    {data.data}
                  </div>
                  <div className=" absolute right-0 text-7xl text-gray-200">
                    {data.icon}
                  </div>
                </div>
              </div>
              <div
                onClick={() => goToLink(data.link)}
                className=" flex cursor-pointer items-center justify-between border-t bg-gray-50 p-5"
              >
                <div className=" text-base text-gray-600">{data.linkText}</div>
                <div className=" text-lg text-gray-500">
                  <FaChevronRight />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome;
