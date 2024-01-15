import { Select } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { IoMdSearch } from "react-icons/io";
import { PesoFormat } from "~/app/_utils/helpers/phpFormatter";

const SearchRefPage = ({
  searchRefNo,
  setSearchText,
  setSearchRefNo,
  selectedLoanLoading,
  selectedLoan,
  searchedLoans,
}: any) => {
  const router = useRouter();
  const onClickProceed = () => {
    router.push(`/admin/payment/${selectedLoan.referenceNo}`);
  };
  return (
    <div className=" flex h-full w-full flex-1 items-center justify-center">
      <div className=" item-center flex w-2/3 flex-col justify-center rounded-xl  p-5">
        <div className=" flex flex-row items-center justify-center gap-2 text-4xl font-semibold text-gray-700">
          <span className=" text-5xl">
            <IoMdSearch />
          </span>
          Search Loan's Reference Number
        </div>
        <div className=" flex items-center justify-center">
          <Select
            size="large"
            showSearch
            defaultValue={searchRefNo}
            className=" my-4 w-2/3 text-2xl"
            placeholder="Search Borrowers ID"
            optionFilterProp="children"
            onSearch={(e) => {
              setSearchText(e);
            }}
            onChange={(e) => setSearchRefNo(e)}
            filterOption={(input, option) => {
              return true;
            }}
            options={searchedLoans}
          />
        </div>
        <div className=" flex  w-full items-center justify-center">
          <div className=" flex min-h-60 w-2/3 items-center justify-center rounded-3xl bg-gray-50 p-5 shadow">
            {selectedLoanLoading ? (
              <> Loading ...</>
            ) : !searchRefNo?.length ? (
              <div className=" text-base font-normal text-gray-500">
                No Searched Loan
              </div>
            ) : selectedLoan ? (
              <div className=" flex h-full w-full flex-col justify-between self-start ">
                <div>
                  <div className=" font-base text-3xl text-gray-600">
                    <span>#</span>
                    {"  "}
                    <span className=" font-bold">
                      {selectedLoan.referenceNo}
                    </span>
                  </div>
                  <div className=" font-base text-base text-gray-600">
                    <span>Loan Date Started :</span>
                    {"  "}
                    <span className=" font-bold">
                      {dayjs(selectedLoan.startDate).format("MMMM D, YYYY")}
                    </span>
                  </div>
                  <div className=" font-base mt-3 text-base text-gray-600">
                    <span>Borrower :</span>
                    {"  "}
                    <span className=" font-bold">
                      {`${selectedLoan.Borrower.firstName} ${selectedLoan.Borrower.middleName} ${selectedLoan.Borrower.lastName}`}
                    </span>
                  </div>
                  <div className=" font-base text-base text-gray-600">
                    <span>Loan Type :</span>
                    {"  "}
                    <span className=" font-bold">
                      {`${selectedLoan.LoanType.name}`}
                    </span>
                  </div>
                  <div className=" font-base text-base text-gray-600">
                    <span>Loan Plan :</span>
                    {"  "}
                    <span className=" font-bold">
                      {`${selectedLoan.LoanPlan.planMonth} (Month/s), ${selectedLoan.LoanPlan.interest}% (Interest), ${selectedLoan.LoanPlan.penalty}% (Overdue Penalty)`}
                    </span>
                  </div>

                  <div className=" font-base text-base text-gray-600">
                    <span>Loan Amount :</span>
                    {"  "}
                    <span className=" font-bold">
                      {` ${PesoFormat.format(selectedLoan.amount)}`}
                    </span>
                  </div>
                  <div className=" font-base text-base text-gray-600">
                    <span>Last Payment Date :</span>
                    {"  "}
                    <span className=" font-bold">
                      {`${
                        selectedLoan.Payment[0]
                          ? dayjs(selectedLoan.Payment[0].datePaid).format(
                              "MMMM D, YYYY",
                            )
                          : "No record of payment"
                      }`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClickProceed}
                  className=" mt-10 rounded bg-green-500 px-4 py-2 text-white hover:brightness-105"
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRefPage;
