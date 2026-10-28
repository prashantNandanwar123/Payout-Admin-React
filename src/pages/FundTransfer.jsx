import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchApi } from "../assets/js/functions";
import { CountDown, ModalBodyData } from "../components/MiniComps";
import { Navbar } from "../components/Navbar";
import { typeNumber } from "../assets/js/validationRHF";

const FundTransfer = ({ setIsAuth }) => {
  const [fundData, setFundData] = useState([]);
  const [payForm, setPayForm] = useState({});
  const [isResend, setIsResend] = useState(false);
  const [isOtpverified, setIsOtpverified] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const [tableDataStatus, setTableDataStatus] = useState("");

  const otpMsgRef = useRef();
  const otpRef = useRef();
  const openOtpModalRef = useRef();
  const closeOtpModalRef = useRef();
  const procNameRef = useRef();

  useEffect(() => {
    (async () => {
      setTableDataStatus("Loading...");
      let [res, result] = await fetchApi("getAllInitiatedTransaction", "GET");
      if (res.status === 200) {
        if (result.respData.length > 0) {
          setFundData(result.respData);
          setTableDataStatus("");
        } else {
          setTableDataStatus("Not Found");
        }
      }
    })();
  }, [refreshData]);

  const payHandler = (id) => {
    let filterData = fundData.filter((item) => item.id === id);
    setPayForm(filterData[0]);
  };

  //console.log(fundData)

  const modalPayAct = async () => {
    let procName = procNameRef.current.value;
    // console.log(procName)
    if (
      procName === "SANYUKTPAY" ||
      procName === "SAMBHAVPAY" ||
      procName === "BENAKPAY" ||
      procName === "RUPIXPE"
    ) {
      let loadId = toast.loading("Please wait transaction in process...");
      let [res, result] = await fetchApi("payToBeneficiary", "POST", {
        ...payForm,
        procName,
      });
      if (res.status === 200) {
        if (result.respCode === 1) {
          // toast.error(result.respMsg, { toastId: 1 })
          toast.update(loadId, {
            render: result.respMsg,
            type: "error",
            isLoading: false,
            autoClose: true,
          });
        } else {
          // toast.success(result.respMsg, { toastId: 0 })
          toast.update(loadId, {
            render: result.respMsg,
            type: "success",
            isLoading: false,
            autoClose: true,
          });
          setRefreshData((data) => !data);
        }
      }
    } else if (procName === "FIDYPAY") {
      otpGenerated("openotpmodal");
    } else {
      toast.error("Please Select Processor", { toastId: 1 });
    }
  };

  const verifyOTP = async (e) => {
    // if(isOtpverified){
    //     e.target.value = e.target.value.replace(/[^]/g, '');
    // }
    let otp = e.target.value;
    let { txnRefId } = payForm;
    if (e.target.value.length === 6) {
      let [res, result] = await fetchApi("api/verifyOtpForPay", "POST", {
        txnRefId,
        otp,
      });
      if (res.status !== 200) {
        otpMsgRef.current.textContent = "something went wrong";
      } else {
        if (result.respCode === 1) {
          setIsOtpverified(false);
          otpMsgRef.current.textContent = result.respMsg;
        } else {
          setIsOtpverified(true);
        }
      }
    } else {
      otpMsgRef.current.textContent = "";
      setIsOtpverified(false);
    }
  };

  const otpGenerated = async (openotpmodal) => {
    let [res, result] = await fetchApi("api/sendOtpForPay", "POST", payForm);
    //console.log(res)
    //console.log(result)
    if (res.status !== 200) {
      toast.error(`Something went wrong ( status : ${res.status} )`, {
        toastId: 1,
      });
    } else {
      if (result.respCode === 1) {
        toast.error(result.respMsg, { toastId: 1 });
      } else {
        toast.success(result.respMsg, { toastId: 0 });
        setIsResend(true);
        if (openotpmodal) {
          openOtpModalRef.current.click();
        }
      }
    }
  };

  const submitOtpForm = async (e) => {
    e.preventDefault();
    if (!isOtpverified) {
      otpMsgRef.current.textContent = "Please verify your OTP";
      return false;
    }
    let otp = otpRef.current.value;
    let [res, result] = await fetchApi("api/payToBeneficiary", "POST", {
      ...payForm,
      otp,
    });
    if (res.status !== 200) {
      console.log("something went wrong");
    } else {
      if (result.respCode === 1) {
        toast.error(result.respMsg, { toastId: 1 });
      } else {
        closeOtpModalRef.current.click();
        toast.success(result.respMsg, { toastId: 0 });
        setRefreshData((data) => !data);
        otpModalReset();
      }
    }
  };

  const modalPayActReject = async () => {
    let procName = procNameRef.current.value;
    let [res, result] = await fetchApi("rejectTransferRequest", "POST", {
      ...payForm,
      procName,
    });
    if (res.status !== 200) {
      console.log("something went wrong");
    } else {
      if (result.respCode === 1) {
        toast.error(result.respMsg, { toastId: 1 });
      } else {
        toast.success(result.respMsg, { toastId: 0 });
        setRefreshData((data) => !data);
      }
    }
  };

  const otpModalReset = () => {
    setIsOtpverified(false);
    otpRef.current.value = "";
    otpMsgRef.current.textContent = "";
    setIsResend(false);
  };

  // console.log(payForm)

  // console.log('fund data..')
  // console.log(fundData)

  return (
    <>
      <div className="fundtransfer-page">
        {/* <SidebarNavigation /> */}
        <div className="container-fluid">
          <div className="main-content pt-3">
            <Navbar title="fund transfer" setIsAuth={setIsAuth} />
            <div className="table-responsive mt-4">
              <table className="table table-bordered payout-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>User Id</th>
                    <th>Txn Ref Id</th>
                    <th>Beneficiary Name</th>
                    <th>Transfer Type</th>
                    <th>Amount</th>
                    <th>Company Name</th>
                    <th>Beneficiary Account No</th>
                    <th>Beneficiary Address</th>
                    <th>Beneficiary Pincode</th>
                    <th>Beneficiary Bank Name</th>
                    <th>Beneficiary Branch Address</th>
                    <th>Beneficiary Email Address</th>
                    <th>Beneficiary Ifsc Code</th>
                    <th>Beneficiary Mobile No</th>
                    <th>Source</th>
                    <th>Txn Note</th>
                    <th>Initiated Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fundData.length < 1 ? (
                    <tr>
                      <td colSpan={16}>
                        <h6>{tableDataStatus}</h6>
                      </td>
                    </tr>
                  ) : (
                    fundData.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.userId}</td>
                          <td>{item.txnRefId}</td>
                          <td>{item.beneficiaryName}</td>
                          <td>{item.transferType}</td>
                          <td>{item.amount}</td>
                          <td>{item.payerName}</td>
                          <td>{item.beneficiaryAccNo}</td>
                          <td>{item.beneficiaryAddress}</td>
                          <td>{item.beneficiaryPincode}</td>
                          <td>{item.beneficiaryBankName}</td>
                          <td>{item.beneficiaryBranchAddress}</td>
                          <td>{item.beneficiaryEmailAddress}</td>
                          <td>{item.beneficiaryIfscCode}</td>
                          <td>{item.beneficiaryMobileNo}</td>
                          <td>{item.source}</td>
                          <td>{item.txnNote}</td>
                          <td>{item.requestInitiateddate}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm border-0 text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#payModal"
                              onClick={() => payHandler(item.id)}
                            >
                              PAY
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <input
        type="button"
        className="d-none"
        data-bs-toggle="modal"
        data-bs-target="#otpModal"
        ref={openOtpModalRef}
      />

      <div
        className="modal fade viewmodal"
        id="payModal"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-sm modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Please Re-Check Details :</h5>
            </div>
            <div className="modal-body">
              <div className="border p-2 mb-2">
                <h6>
                  Processor Name <span className="text-danger fw-bold"> *</span>
                </h6>
                <select
                  className="form-select shadow-none rounded-0"
                  ref={procNameRef}
                >
                  <option value="SANYUKTPAY"> SANYUKTPAY </option>
                  <option value="SAMBHAVPAY"> SAMBHAVPAY </option>
                  <option value="BENAKPAY"> BENAKPAY </option>
                  <option value="RUPIXPE"> RUPIXPE </option>
                </select>
              </div>
              <ModalBodyData name="Transfer Type" data={payForm.transferType} />
              <ModalBodyData name="User Id" data={payForm.userId} />
              <ModalBodyData name="Txn Ref Id" data={payForm.txnRefId} />
              <ModalBodyData name="Company Name" data={payForm.payerName} />
              <ModalBodyData
                name="Beneficiary Name"
                data={payForm.beneficiaryName}
              />
              <ModalBodyData name="Amount" data={payForm.amount} />
              <ModalBodyData
                name="Beneficiary Account No"
                data={payForm.beneficiaryAccNo}
              />
              <ModalBodyData
                name="Beneficiary Ifsc Code"
                data={payForm.beneficiaryIfscCode}
              />
              <ModalBodyData
                name="Beneficiary Mobile No"
                data={payForm.beneficiaryMobileNo}
              />
              <ModalBodyData
                name="Beneficiary Email Address"
                data={payForm.beneficiaryEmailAddress}
              />
              <ModalBodyData
                name="Beneficiary Bank Name"
                data={payForm.beneficiaryBankName}
              />
              <ModalBodyData
                name="Beneficiary Address"
                data={payForm.beneficiaryAddress}
              />
            </div>
            <div className="modal-footer flex-nowrap">
              <button
                type="button"
                className="btn btn-sm btn-success mx-1 w-100"
                data-bs-dismiss="modal"
                onClick={modalPayAct}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger mx-1 w-100"
                data-bs-dismiss="modal"
                onClick={modalPayActReject}
              >
                Reject
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary mx-1 w-100"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade viewmodal"
        id="otpModal"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <form onSubmit={submitOtpForm} autoComplete="off">
                <div className="border p-3 mb-2">
                  <div className="d-flex justify-content-between">
                    <h6>
                      Enter OTP <span className="text-danger fw-bold"> *</span>
                    </h6>
                    {!isOtpverified ? (
                      isResend ? (
                        <small className="text-secondary">
                          <CountDown
                            minutes={0}
                            seconds={60}
                            reSend={setIsResend}
                          />
                        </small>
                      ) : (
                        <small type="button" onClick={() => otpGenerated()}>
                          Resend
                        </small>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control shadow-none ${
                        isOtpverified && "cursor-not-allow"
                      }`}
                      placeholder="Type 6 digit otp.."
                      maxLength={6}
                      ref={otpRef}
                      readOnly={isOtpverified && true}
                      onChange={(e) => {
                        typeNumber(e);
                        verifyOTP(e);
                      }}
                    />
                    {isOtpverified && (
                      <span className="input-group-text">
                        <i className="fas fa-check-circle text-success"></i>
                      </span>
                    )}
                  </div>
                  <strong className="text-danger w-100">
                    <small ref={otpMsgRef}></small>
                  </strong>
                  <div className="d-flex mt-2">
                    <button
                      type="submit"
                      className="btn theme-btn text-white w-100 m-1"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary text-white w-100 m-1"
                      data-bs-dismiss="modal"
                      ref={closeOtpModalRef}
                      onClick={otpModalReset}
                    >
                      Close
                    </button>
                  </div>
                  {/* <span className="d-none" data-bs-dismiss="modal" ref={closeOtpModalRef}></span> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FundTransfer;
