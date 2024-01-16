import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "~/trpc/react";

const LoansReport = ({
  componentRef,
  startDate,
  endDate,
}: {
  componentRef: any;
  startDate: Date;
  endDate: Date;
}) => {
  const { data: loanReports } = api.reports.loanReport.useQuery({
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
  });
  const columns: ColumnsType<any> = [
    {
      title: "Reference No.",
      dataIndex: "referenceNo",
    },
    {
      title: "Borrower",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => {
        return (
          <div className="flex">
            {data === "done" ? (
              <div className=" flex-none rounded bg-cyan-500 px-2 text-xs text-white">
                DONE
              </div>
            ) : (
              <div className=" flex-none rounded bg-green-500 px-2 text-xs text-white">
                ACTIVE
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
    },
    {
      title: "Loan Plan",
      dataIndex: "loanPlan",
    },
  ];
  return (
    <div style={{ maxHeight: 650 }} className=" overflow-scroll">
      <div ref={componentRef as any} className="">
        <div
          id="printOnly"
          className=" mb-3  flex w-full flex-col items-center justify-center"
        >
          <div className=" text-3xl uppercase">Loan Management System</div>
          <div className=" text-xl">{`Loan Report from ${dayjs(
            startDate,
          ).format("MMMM DD, YYYY")} to ${dayjs(endDate).format(
            "MMMM DD, YYYY",
          )}`}</div>
        </div>
        <Table
          // rowSelection={rowSelection}
          pagination={false}
          columns={columns}
          dataSource={loanReports}
        />
      </div>
    </div>
  );
};

export default LoansReport;
