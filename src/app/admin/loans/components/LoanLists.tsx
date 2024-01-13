import { Table } from "antd";
import Search from "antd/es/input/Search";

const LoanLists = ({
  setSearchTextIndex,
  searchTextIndex,
  columns,
  loans,
}: {
  setSearchTextIndex: any;
  searchTextIndex: string;
  columns: any;
  loans: any;
}) => {
  return (
    <div className=" flex min-h-96 flex-col rounded  bg-white">
      <div className=" w-1/3 p-5 px-2">
        <Search
          width={10}
          className=" flex-none"
          size="large"
          defaultValue={searchTextIndex}
          placeholder="Search Loan Reference Number"
          onSearch={(e) => setSearchTextIndex(e)}
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchTextIndex("");
            }
          }}
        />
      </div>
      <Table
        // rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
        columns={columns}
        dataSource={loans}
      />
    </div>
  );
};

export default LoanLists;
