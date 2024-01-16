import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { PesoFormat } from "~/app/_utils/helpers/phpFormatter";
import { api } from "~/trpc/react";

const PaymentReport = ({
  componentRef,
  startDate,
  endDate,
}: {
  componentRef: any;
  startDate: Date;
  endDate: Date;
}) => {
  const { data: payment } = api.reports.paymentReport.useQuery({
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
      title: "Amount",
      dataIndex: "amountValue",
      render: (data) => {
        return PesoFormat.format(data);
      },
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      render: (_, data) => {
        return (
          <div>
            {_ ? (
              <span>{PesoFormat.format(data.penaltyValue)}</span>
            ) : (
              <span>None</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Sub Total",
      dataIndex: "penalty",
      render: (_, data) => {
        return (
          <div>
            <span>
              {PesoFormat.format(
                (_ ? data.penaltyValue : 0) + data.amountValue,
              )}
            </span>
          </div>
        );
      },
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
          <div className=" text-xl">{`Payment Report from ${dayjs(
            startDate,
          ).format("MMMM DD, YYYY")} to ${dayjs(endDate).format(
            "MMMM DD, YYYY",
          )}`}</div>
        </div>
        <Table
          // rowSelection={rowSelection}
          pagination={false}
          columns={columns}
          dataSource={payment?.payment}
        />
        <div
          id="printOnly"
          className=" mt-5 flex justify-center px-5 text-2xl font-semibold"
        >
          Total Amount : {PesoFormat.format(payment?.totalAmount || 0)}
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;
