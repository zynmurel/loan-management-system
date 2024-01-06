"use client";
import { usePathname, useRouter } from "next/navigation";

const MenuSider = ({ siderTitle, siderItems }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const changePage = (url: string) => {
    return () => router.push(url);
  };
  return (
    <div className=" flex w-full flex-col items-center justify-center">
      <div className=" w-full text-center text-xl font-bold uppercase text-white">
        {siderTitle}
      </div>
      <div className=" flex w-full flex-col items-center gap-5 py-5">
        {siderItems.map((menu: any) => {
          return (
            <div
              onClick={changePage(menu.url)}
              className={` item-center flex w-full cursor-pointer flex-row gap-5 rounded p-2 px-6  ${
                pathname === menu.url
                  ? "bg-white text-blue-500"
                  : "text-white hover:bg-blue-400"
              }`}
            >
              <div className="text-2xl ">{menu.icon}</div>
              <div className=" text-base font-medium ">{menu.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuSider;
