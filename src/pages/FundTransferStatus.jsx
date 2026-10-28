import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  dateInNumbers,
  fetchApi,
  sortDateSwitch,
} from "../assets/js/functions";
import {
  PagiPageCount,
  PagiSearch,
  SortTableHeader,
} from "../components/PaginateTable";
import { DateInput } from "../components/RHF";
import { CheckInput } from "../components/MiniComps";
import * as XLSX from "xlsx";

const FundTransferStatus = ({ setIsAuth }) => {
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const [fundStatusData, setFundStatusData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [startOffset, setStartOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [tableDataStatus, setTableDataStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const itemsPerPage = 10;
  const searchData = fundStatusData.filter((item) =>
    Object.values(item)
      .join("")
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const endOffset = startOffset + itemsPerPage;
  const currentItems = searchData.slice(startOffset, endOffset);
  const pageCount = Math.ceil(searchData.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      commonReportData("getAllTransaction", "GET");
    })();
  }, []);

  const sortByDate = (e, action) => {
    let sortData = sortDateSwitch(e, searchData, action);
    setFundStatusData(sortData);
  };

  const changeHandler = () => {
    let countries = document.querySelectorAll(".fts_filter input");
    let choices = [];
    countries.forEach((item) => (item.checked ? choices.push(item.value) : ""));
    let filteredArray = dataFilter.filter((item) =>
      choices.length > 0 ? choices.includes(item.respMsg) : item
    );
    setFundStatusData(filteredArray);
    if (filteredArray.length < 1) setTableDataStatus("Not Found");
  };

  const searchDataByDate = async (e) => {
    e.preventDefault();
    let fromDate = fromDateRef.current.value;
    let toDate = toDateRef.current.value;
    setFundStatusData([]);
    setDataFilter([]);
    commonReportData("getAllTransactionByDate", "POST", { fromDate, toDate });
  };

  // common method ( report data ) start
  const commonReportData = async (url, method, data) => {
    setTableDataStatus("Loading...");
    let [res, result] = await fetchApi(url, method, data);
    // console.log(result)
    if (res.status === 200) {
      if (result.respData.length > 0) {
        let data = result.respData.sort(function (a, b) {
          let c = new Date(a.requestInitiateddate);
          let d = new Date(b.requestInitiateddate);
          return d - c;
        });
        setTableDataStatus("");
        setFundStatusData(data);
        setDataFilter(data);
      } else {
        setTableDataStatus("Not Found");
      }
    }
  };

  const exportToDownloadReport = () => {
    const date = dateInNumbers();
    const workbook = XLSX.utils.book_new();

    // Build map of key → label for easy lookup
    const labelMap = allColumns.reduce((acc, col) => {
      acc[col.key] = col.label;
      return acc;
    }, {});

    // Create dynamic heading row using visibleColumns
    const Heading = [visibleColumns.map((key) => labelMap[key] || key)];

    // Prepare report data
    const reportData = searchData?.map(
      ({
        companyName,
        id,
        requestAmount,
        respCode,
        txnresponseDate,
        userRemark,
        beneficiaryPincode,
        ...rest
      }) => rest
    );

    // Filter data based on visibleColumns
    const filteredReportData = reportData.map((item) => {
      const filteredItem = {};
      visibleColumns.forEach((key) => {
        if (item.hasOwnProperty(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredReportData, {
      origin: "A2",
      skipHeader: true,
    });

    // Add dynamic heading
    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });

    // Append and export
    XLSX.utils.book_append_sheet(workbook, worksheet, "TxnReport");
    XLSX.writeFile(workbook, `TxnReport_${date}.xlsx`);
  };

  useEffect(() => {
    if (searchData.length > 0) {
      let totalAmt = searchData
        ?.map((item) => parseFloat(item.finalAmount))
        .reduce((a, b) => a + b)
        .toFixed(2);
      setTotalAmount(totalAmt);
    } else {
      setTotalAmount(0);
    }
  }, [searchData]);

  // -----------------------------------------------------------------------------------

  const allColumns = [
    { key: "userId", label: "User Id" },
    { key: "amount", label: "Request Amount" },
    { key: "beneficiaryName", label: "Payee Name" },
    { key: "beneficiaryAccNo", label: "Payee Account Number" },
    { key: "beneficiaryIfscCode", label: "Payee Ifsc" },
    { key: "transferType", label: "Payment Mode" },
    { key: "beneficiaryEmailAddress", label: "Payee Email" },
    { key: "beneficiaryMobileNo", label: "Payee Mobile" },
    { key: "beneficiaryAddress", label: "Payee Address" },
    { key: "beneficiaryBankName", label: "Payee Bank Name" },
    { key: "beneficiaryBranchAddress", label: "Payee Bank Branch Address" },
    { key: "txnNote", label: "Remark" },
    { key: "payerName", label: "company Name" },
    { key: "txnRefId", label: "Txn Ref Id" },
    { key: "userName", label: "User Name" },
    { key: "requestInitiateddate", label: "Initiated Date" },
    { key: "txnRequestDate", label: "Request Date" },
    { key: "respMsg", label: "Status" },
    { key: "prevBal", label: "Previous Ballance" },
    { key: "finalAmount", label: "Final Amount" },
    { key: "availBal", label: "Available Amount" },
    { key: "reversalStatus", label: "reversal Status" },
    { key: "settlementAmount", label: "Settlement Amount" },
    { key: "mdr", label: "MDR" },
    { key: "gst", label: "GST" },
    { key: "description", label: "Description" },
    { key: "source", label: "Source" },
    { key: "orderNo", label: "Order Id" },
    { key: "rrn", label: "RRN No" },
    { key: "procTxnRefId", label: "Proc Txn Ref Id" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.map((col) => col.key)
  );

  const handleColumnToggle = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const showColumn = (key) => visibleColumns.includes(key);

  // -----------------------------------------------------------------------------------

  return (
    <div className="fundtranstatus-page">
      {/* <SidebarNavigation /> */}
      <div className="container-fluid">
        <div className="main-content pt-3">
          <Navbar title="fund transfer status" setIsAuth={setIsAuth} />

          <form className="" onSubmit={searchDataByDate}>
            <div className="row">
              <div className="col-md-4 col-lg-2 mb-2">
                <DateInput dateRef={fromDateRef} />
              </div>
              <div className="col-md-4 col-lg-2 mb-2">
                <DateInput dateRef={toDateRef} />
              </div>
              <div className="col-md-4 col-lg-8 mb-2">
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-sm border-0 text-white theme-btn me-2"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm border-0 text-white theme-btn d-flex align-items-center"
                    onClick={exportToDownloadReport}
                  >
                    Report{" "}
                    <i
                      className="fa-solid fa-download ms-1"
                      style={{ fontSize: "10px" }}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </form>

          <ul className="list-group list-group-horizontal-md mb-3 mt-2 fts_filter">
            <li className="list-group-item">
              <CheckInput
                id="flrcheck1"
                val="SUCCESS"
                label="SUCCESS"
                change={changeHandler}
              />
            </li>
            <li className="list-group-item">
              <CheckInput
                id="flrcheck2"
                val="FAILED"
                label="FAILED"
                change={changeHandler}
              />
            </li>
            <li className="list-group-item">
              <CheckInput
                id="flrcheck3"
                val="Rejected by Bank"
                label="REJECTED"
                change={changeHandler}
              />
            </li>
            <li className="list-group-item">
              <CheckInput
                id="flrcheck4"
                val="In Process"
                label="IN PROCESS"
                change={changeHandler}
              />
            </li>
            <li className="list-group-item">
              <CheckInput
                id="flrcheck5"
                val="INPROGRESS"
                label="IN PROGRESS"
                change={changeHandler}
              />
            </li>
          </ul>

          <PagiSearch
            setSearch={setSearch}
            totalEntries={searchData.length}
            setStartOffset={setStartOffset}
            setTableDataStatus={setTableDataStatus}
            totalAmount={totalAmount}
            allColumns={allColumns}
            visibleColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />

          <div className="table-responsive my-2">
            <table className="table table-bordered payout-table">
              <thead>
                <tr>
                  {showColumn("sno") && <th>S.No.</th>}
                  {showColumn("txnRefId") && <th>Txn Ref Id</th>}
                  {showColumn("procTxnRefId") && <th>Proc Txn Ref Id</th>}
                  {showColumn("orderNo") && <th>Order Id</th>}
                  {showColumn("userId") && <th>User Id</th>}
                  {showColumn("userName") && <th>User Name</th>}
                  {showColumn("respMsg") && <th>Status</th>}
                  {showColumn("description") && <th>Description Status</th>}
                  {showColumn("payerName") && <th>company Name</th>}
                  {showColumn("beneficiaryName") && <th>Payee Name</th>}
                  {showColumn("beneficiaryAddress") && <th>Payee Address</th>}
                  {showColumn("beneficiaryEmailAddress") && (
                    <th>Payee Email</th>
                  )}
                  {showColumn("beneficiaryMobileNo") && <th>Payee Mobile</th>}
                  {showColumn("beneficiaryBankName") && (
                    <th>Payee Bank Name</th>
                  )}
                  {showColumn("beneficiaryAccNo") && (
                    <th>Payee Account Number</th>
                  )}
                  {showColumn("beneficiaryIfscCode") && <th>Payee Ifsc</th>}
                  {showColumn("beneficiaryBranchAddress") && (
                    <th>Payee Bank Branch Address</th>
                  )}
                  {showColumn("transferType") && <th>Payment Mode</th>}
                  {showColumn("amount") && <th>Request Amount</th>}
                  {showColumn("gst") && <th>GST</th>}
                  {showColumn("mdr") && <th>MDR</th>}
                  {showColumn("prevBal") && <th>Previous Balance</th>}
                  {showColumn("finalAmount") && <th>Final Amount</th>}
                  {showColumn("availBal") && <th>Available Balance</th>}
                  {showColumn("reversalStatus") && <th>Reversal Status</th>}
                  {showColumn("settlementAmount") && <th>Settlement Amount</th>}
                  {showColumn("source") && <th>Source</th>}
                  {showColumn("rrn") && <th>RRN No</th>}
                  {showColumn("requestInitiateddate") && (
                    <th>
                      <SortTableHeader
                        text="Initiated Date"
                        change={(e) => sortByDate(e, "InitiatedDate")}
                      />
                    </th>
                  )}
                  {showColumn("txnRequestDate") && (
                    <th>
                      <SortTableHeader
                        text="Request Date"
                        change={(e) => sortByDate(e, "TxnReqDate")}
                      />
                    </th>
                  )}
                  {showColumn("txnNote") && <th>Remark</th>}
                </tr>
              </thead>
              <tbody>
                {currentItems.length < 1 ? (
                  <tr>
                    <td colSpan={16}>
                      <h6>{tableDataStatus}</h6>
                    </td>
                  </tr>
                ) : (
                  currentItems?.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        {showColumn("sno") && (
                          <td>{startOffset + index + 1}</td>
                        )}
                        {showColumn("txnRefId") && <td>{item.txnRefId}</td>}
                        {showColumn("procTxnRefId") && (
                          <td>{item.procTxnRefId}</td>
                        )}
                        {showColumn("orderNo") && <td>{item.orderNo}</td>}
                        {showColumn("userId") && <td>{item.userId}</td>}
                        {showColumn("userName") && <td>{item.userName}</td>}
                        {showColumn("respMsg") && <td>{item.respMsg}</td>}
                        {showColumn("description") && (
                          <td>{item.description}</td>
                        )}
                        {showColumn("payerName") && <td>{item.payerName}</td>}
                        {showColumn("beneficiaryName") && (
                          <td>{item.beneficiaryName}</td>
                        )}
                        {showColumn("beneficiaryAddress") && (
                          <td>{item.beneficiaryAddress}</td>
                        )}
                        {showColumn("beneficiaryEmailAddress") && (
                          <td>{item.beneficiaryEmailAddress}</td>
                        )}
                        {showColumn("beneficiaryMobileNo") && (
                          <td>{item.beneficiaryMobileNo}</td>
                        )}
                        {showColumn("beneficiaryBankName") && (
                          <td>{item.beneficiaryBankName}</td>
                        )}
                        {showColumn("beneficiaryAccNo") && (
                          <td>{item.beneficiaryAccNo}</td>
                        )}
                        {showColumn("beneficiaryIfscCode") && (
                          <td>{item.beneficiaryIfscCode}</td>
                        )}
                        {showColumn("beneficiaryBranchAddress") && (
                          <td>{item.beneficiaryBranchAddress}</td>
                        )}
                        {showColumn("transferType") && (
                          <td>{item.transferType}</td>
                        )}
                        {showColumn("amount") && <td>{item.amount}</td>}
                        {showColumn("gst") && <td>{item.gst}</td>}
                        {showColumn("mdr") && <td>{item.mdr}</td>}
                        {showColumn("prevBal") && <td>{item.prevBal}</td>}
                        {showColumn("finalAmount") && (
                          <td>{item.finalAmount}</td>
                        )}
                        {showColumn("availBal") && <td>{item.availBal}</td>}
                        {showColumn("reversalStatus") && (
                          <td>{item.reversalStatus}</td>
                        )}
                        {showColumn("settlementAmount") && (
                          <td>{item.settlementAmount}</td>
                        )}
                        {showColumn("source") && <td>{item.source}</td>}
                        {showColumn("rrn") && <td>{item.rrn}</td>}
                        {showColumn("requestInitiateddate") && (
                          <td>{item.requestInitiateddate}</td>
                        )}
                        {showColumn("txnRequestDate") && (
                          <td>{item.txnRequestDate}</td>
                        )}
                        {showColumn("txnNote") && <td>{item.txnNote}</td>}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <PagiPageCount
            setStartOffset={setStartOffset}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FundTransferStatus;
