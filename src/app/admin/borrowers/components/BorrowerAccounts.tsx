import { Image, Table } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";

const BorrowerAccounts = ({
  showPassword,
  openModal,
  setSearchText,
  borrowers,
  activeTabKey1,
}: any) => {
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "borrowerIdNo",
    },
    activeTabKey1 === "pending"
      ? {
          title: "Photo",
          align: "center",
          dataIndex: "imageBase64",
          render: (data: any) => (
            <Image src={data} alt="borrower_photo" width={50} />
          ),
        }
      : {},
    {
      title: "Name",
      render: (data) => {
        return `${data.firstName} ${data.middleName} ${data.lastName}`;
      },
    },
    {
      title: "Tax No.",
      dataIndex: "taxNo",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Contact No.",
      dataIndex: "contact",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    activeTabKey1 === "approved"
      ? {
          title: "Password",
          dataIndex: "password",
          render: (data, _) => {
            return showPassword(_.id, data);
          },
        }
      : {},
    activeTabKey1 === "approved"
      ? {
          title: "Action",
          align: "center",
          render: (data: any) => (
            <div className=" flex flex-row items-center justify-center gap-2">
              <button
                onClick={() => openModal("edit", data)}
                className=" flex-1  rounded bg-orange-400 px-2 py-1 text-white"
              >
                Edit
              </button>
              {/* <button
                  onClick={() => openModal("delete", data)}
                  className=" flex-1 rounded bg-red-400 px-2 py-1 text-white"
                >
                  Delete
                </button> */}
            </div>
          ),
        }
      : {},
    activeTabKey1 === "pending"
      ? {
          title: "Action",
          align: "center",
          render: (data: any) => (
            <div className=" flex flex-row items-center justify-center gap-2">
              <button
                onClick={() => openModal("approve", data)}
                className=" flex-1  rounded bg-green-500 px-2 py-1 text-white"
              >
                Approve
              </button>
              {/* <button
                      onClick={() => openModal("delete", data)}
                      className=" flex-1 rounded bg-red-400 px-2 py-1 text-white"
                    >
                      Delete
                    </button> */}
            </div>
          ),
        }
      : {},
  ];
  return (
    <div className=" flex min-h-96 flex-col rounded  bg-white">
      <div className=" w-1/3 p-5 px-2">
        <Search
          width={10}
          className=" flex-none"
          size="large"
          placeholder="Search"
          onSearch={(e) => setSearchText(e)}
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchText("");
            }
          }}
        />
      </div>
      <Table
        // rowSelection={rowSelection}
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={borrowers}
      />
    </div>
  );
};

export default BorrowerAccounts;
