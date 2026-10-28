import { useForm } from "react-hook-form";
import {
  alphaNumericRex,
  alphaNumSpaceRex,
  alphaRex,
  blankSpace,
  typeFloatNumber,
} from "../assets/js/validationRHF";
import { Input, Label, SelectInput, CstmInput } from "./RHF";
import { RadioCheckInput } from "./MiniComps";
import { fetchApi } from "../assets/js/functions";
import { toast } from "react-toastify";
import { createContext, useEffect, useState, useRef } from "react";
import "../assets/css/modalCss.css";
import ToggleSwitch from "./ToggleSwitch";

export const UsrMgmtContext = createContext();

const UserMgmtModal = ({ userData, userAct, setUserRefresh }) => {
  const [statusData, setStatusData] = useState({
    status: "",
    userId: "",
  });

  const [checked, setChecked] = useState();

  const activation = async (statusData) => {
    try {
      let status = statusData.status == 1 ? 0 : 1;
      let userId = statusData.userId;
      let [res, result] = await fetchApi("updateCallbackStatus", "POST", {
        userId,
        status,
      });

      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          toast.success(result.respMsg, { toastId: 0 });
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleToggle = () => {
    activation(statusData);
    setChecked((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [callbackUrl, setCallbackUrl] = useState("");

  const [chargeData, setChargeData] = useState([]);
  const [tableRefresh, setTableRefresh] = useState(false);

  const ipCheckRef = useRef(null);
  const ipRef = useRef(null);
  const resellerNameRef = useRef(null);
  const resellerIdRef = useRef(null);

  const { userId, accountStatus, mode } = userData;

  const [resellerName, setResellerName] = useState([]);
  const [resellerId, setResellerId] = useState([]);
  const [mapResellerData, setMapResellerData] = useState({
    resellerName: "",
    resellerId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let [res, result] = await fetchApi(`fetchCallback`, "POST", { userId });

        // console.log("result--", result);
        if (res.status !== 200 || result.respCode === 1) {
          document.getElementById("callbackUrl").style.background = "white";
          document.getElementById("callbackUrl").value = "";

          setCallbackUrl("");
        } else {
          setCallbackUrl(result.respData.webhookPayoutUrl);
          setStatusData({
            status: result.respData.status,
            userId: result.respData.userId,
          });
          setChecked(
            result.respData && result.respData?.status === "0" ? true : false
          );
          // setTimeout(() => {
          //   console.log("checked-", checked);
          // }, 1000);
          document.getElementById("callbackUrl").value =
            result.respData.webhookPayoutUrl;
          // console.log("callbackurl--", result.respData.webhookPayoutUrl);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    setResellerName([]);
    setResellerId([]);
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      (async () => {
        let [res, result] = await fetchApi(
          `fetchPayOutCharges/${userId}`,
          "GET"
        );
        if (res.status === 200) {
          if (result.respCode === 0) {
            setChargeData(result.respData);
          } else {
            console.log(result.respMsg);
          }
        }
      })();
    }
  }, [userData, tableRefresh]);

  useEffect(() => {
    if (userData.ipCheck === "No") {
      ipCheckRef.current.checked = false;
      ipRef.current.style.display = "none";
    } else {
      ipCheckRef.current.checked = true;
      ipRef.current.style.display = "block";
    }
  }, [userData]);

  const chargesHandler = async (data) => {
    try {
      let [res, result] = await fetchApi("AddPayOutCharges", "POST", {
        ...data,
        userId,
      });
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          toast.success(result.respMsg, { toastId: 0 });
          setTableRefresh((status) => !status);
          reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCharge = async (e, transferType) => {
    let target = e.target.closest("tr");
    let procName = target.querySelector("._proc").value;
    let gst = target.querySelector("._gst").value;
    let mdr = target.querySelector("._mdr").value;
    let slab = target.querySelector("._slab").value;
    let flat = target.querySelector("._flat").value;
    let chargeType = target.querySelector("._charge").value;
    let accLimit = target.querySelector("._acc_limit").value;
    let resellerCommision = target.querySelector("._reseller_commision").value;
    try {
      let [res, result] = await fetchApi("UpdatePayOutCharges", "POST", {
        userId,
        procName,
        transferType,
        gst,
        mdr,
        slab,
        resellerCommision,
        chargeType,
        flat,
        accLimit
      });
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          toast.success(result.respMsg, { toastId: 0 });
          setTableRefresh((status) => !status);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async () => {
    let action = document.querySelector('input[name="status"]:checked').value;
    //let resellerName = resellerNameRef.current.value;
    //let resellerId = resellerIdRef.current.value;
    let resellerId = userData.userId;
    // console.log({userId, action, resellerName, resellerId})

    // return false;
    try {
      let [res, result] = await fetchApi("usrActivate", "POST", {
        userId,
        action,
      });
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          // console.log(result);
          toast.success(result.respMsg, { toastId: 0 });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateMode = async () => {
    let ipCheck = "Yes";
    let ip = ipRef.current.value;
    if (!ipCheckRef.current.checked) {
      ipCheck = "No";
      ip = "";
    }
    let mode = document.querySelector('input[name="mode"]:checked').value;
    //console.log(userId +"--"+ mode)
    try {
      let [res, result] = await fetchApi("usrModeEnable", "POST", {
        userId,
        mode,
        ip,
        ipCheck,
      });
      //console.log(res)
      //console.log(result)
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          toast.success(result.respMsg, { toastId: 0 });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCharge = async (transferType) => {
    try {
      let [res, result] = await fetchApi("DeletePayOutCharges", "POST", {
        userId,
        transferType,
      });
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          toast.error(result.respMsg, { toastId: 1 });
        } else {
          toast.success(result.respMsg, { toastId: 0 });
          setTableRefresh((status) => !status);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ipCheckHandler = (e) => {
    if (e.target.checked) {
      ipRef.current.style.display = "block";
    } else {
      ipRef.current.style.display = "none";
    }
  };

  const callbackHandelar = async (e) => {
    const buttonClicked = e.target.id;
    const webhookPayoutUrl = document.getElementById("callbackUrl").value;

    if (buttonClicked === "addCallbackBtn" && webhookPayoutUrl) {
      try {
        let [res, result] = await fetchApi("addCallback", "POST", {
          userId,
          webhookPayoutUrl,
        });
        if (res.status !== 200) {
          toast.error("something went wrong", { toastId: 1 });
        } else {
          if (result.respCode === 1) {
            toast.error(result.respMsg, { toastId: 1 });
          } else {
            toast.success(result.respMsg, { toastId: 0 });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (buttonClicked === "editCallbackBtn" && webhookPayoutUrl) {
      try {
        let [res, result] = await fetchApi("updateCallback", "POST", {
          userId,
          webhookPayoutUrl,
        });
        if (res.status !== 200) {
          console.log("something went wrong updateCallback");
          toast.error("something went wrong", { toastId: 1 });
        } else {
          if (result.respCode === 1) {
            toast.error(result.respMsg, { toastId: 1 });
          } else {
            toast.success(result.respMsg, { toastId: 0 });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (buttonClicked === "dltCallbackBtn") {
      try {
        let [res, result] = await fetchApi(
          `deleteCallback/${userId}`,
          "DELETE",
          { userId }
        );
        if (res.status !== 200) {
          console.log("something went wrong deleteCallback --", res);
          toast.error("something went wrong", { toastId: 1 });
        } else {
          if (result.respCode === 1) {
            toast.error(result.respMsg, { toastId: 1 });
          } else {
            setCallbackUrl("");

            document.getElementById("callbackUrl").style.background = "white";
            document.getElementById("callbackUrl").value = "";
            toast.success(result.respMsg, { toastId: 0 });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (!webhookPayoutUrl) {
      toast.error("Url box is Empty", { toastId: 1 });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let [res, result] = await fetchApi("fetchReseller", "GET");
        if (res.status !== 200) {
          console.log("something went wrong");
        } else {
          setResellerName(result.respData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userId]);

  async function loadresellerId(reName) {
    setMapResellerData((prev) => ({
      ...prev,
      resellerName: reName,
    }));

    try {
      let [res, result] = await fetchApi("fetchResellerId", "POST", { reName });
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        setResellerId(result.respData);
        // console.log("result -->", resellerId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function mapReseller() {
    const payload = {
      ...mapResellerData,
      userId: userId,
    };

    try {
      let [res, result] = await fetchApi("mapReseller", "POST", payload);

      if (res.status !== 200) {
        toast.error(result.respMsg, { toastId: 1 });
      } else {
        toast.success(result.respMsg, { toastId: 0 });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <UsrMgmtContext.Provider value={userAct}>
      <div className="modal viewmodal" id="userModal" data-bs-backdrop="static">
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable main-modal-div"
          style={{ marginTop: "15px !important" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                YOU CAN {userAct === "edit" ? "EDIT" : "VIEW"} HERE :
              </h5>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">USER DETAILS</h6>
                  </div>
                </div>

                <div className="row mb-2">
                  <UserInputBox label="User Id" data={userData.userId} />
                  <UserInputBox label="First Name" data={userData.firstName} />
                  <UserInputBox label="Last Name" data={userData.lastName} />
                  <UserInputBox label="Email Id" data={userData.emailId} />
                  <UserInputBox label="Address" data={userData.address} />
                  <UserInputBox label="Aadhar No" data={userData.adharNo} />
                  <UserInputBox label="City" data={userData.city} />
                  <UserInputBox
                    label="Company Name"
                    data={userData.companyName}
                  />
                  <UserInputBox
                    label="Company Address"
                    data={userData.companyAddress}
                  />
                  <UserInputBox
                    label="Creation Date"
                    data={userData.creationDate}
                  />
                  <UserInputBox label="Gender" data={userData.gender} />
                  <UserInputBox
                    label="Merchant Bank Name"
                    data={userData.merchantBankName}
                  />
                  <UserInputBox
                    label="Bank Account Number"
                    data={userData.merchantBankAccountNumber}
                  />
                  <UserInputBox
                    label="Merchant Bank Ifsc"
                    data={userData.merchantBankIfsc}
                  />
                  <UserInputBox label="Pan No" data={userData.panNo} />
                  <UserInputBox label="Pin Code" data={userData.pincode} />
                  <UserInputBox label="State" data={userData.state} />
                  <UserInputBox
                    label="Account Status"
                    data={userData.accountStatus}
                  />
                  <UserInputBox
                    label="Aadhar Document"
                    data={userData.adharDocument}
                  />
                  <UserInputBox
                    label="Pan Document"
                    data={userData.panDocument}
                  />
                </div>

                {/* resellerName,resellerId */}
                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">MAP RESELLER</h6>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-4 mb-2">
                    <Label name="Reseller Name" req={false} />
                    <select
                      className="form-select shadow-none"
                      disabled={userAct === "view" ? true : false}
                      onChange={(e) => loadresellerId(e.target.value)}
                    >
                      {userData.resellerName ? (
                        <option value="">{userData.resellerName}</option>
                      ) : (
                        <option value="">Select</option>
                      )}

                      {resellerName &&
                        resellerName.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-2">
                    <Label name="Reseller Id" req={false} />
                    <select
                      className="form-select shadow-none"
                      disabled={userAct === "view" ? "disabled" : ""}
                      onChange={(e) =>
                        setMapResellerData((prev) => ({
                          ...prev,
                          resellerId: e.target.value,
                        }))
                      }
                    >
                      {userData.resellerId ? (
                        <option value="">{userData.resellerId}</option>
                      ) : (
                        <option value="">Select</option>
                      )}

                      {resellerId &&
                        resellerId.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-2 align-content-end">
                    <button
                      type="button"
                      className="btn btn-md theme-btn text-white"
                      onClick={mapReseller}
                    >
                      Map Reseller
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">STATUS</h6>
                  </div>
                </div>

                <ul className="list-group list-group-horizontal-md mb-3 mt-2">
                  <li className="list-group-item">
                    <RadioCheckInput
                      id="usrcheck1"
                      val="Pending"
                      name="status"
                      label="PENDING"
                      status={accountStatus}
                    />
                  </li>
                  <li className="list-group-item">
                    <RadioCheckInput
                      id="usrcheck2"
                      val="Activated"
                      name="status"
                      label="ACTIVATED"
                      status={accountStatus}
                    />
                  </li>
                  <li className="list-group-item">
                    <RadioCheckInput
                      id="usrcheck3"
                      val="Deactivated"
                      name="status"
                      label="DEACTIVATED"
                      status={accountStatus}
                    />
                  </li>
                  {userAct === "edit" ? (
                    <li className="list-group-item">
                      <button
                        type="button"
                        className="btn btn-sm theme-btn text-white"
                        onClick={updateStatus}
                      >
                        Update
                      </button>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>

                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">MODE</h6>
                  </div>
                </div>

                <div className="d-flex">
                  <ul className="list-group list-group-horizontal-md mb-3 mt-2 me-3">
                    <li className="list-group-item">
                      <RadioCheckInput
                        id="modecheck1"
                        val="Direct"
                        name="mode"
                        label="DIRECT"
                        status={mode}
                      />
                    </li>
                    <li className="list-group-item">
                      <RadioCheckInput
                        id="modecheck2"
                        val="Admin"
                        name="mode"
                        label="BY ADMIN"
                        status={mode}
                      />
                    </li>
                  </ul>

                  <ul className="list-group list-group-horizontal-md mb-3 mt-2 me-3">
                    <li className="list-group-item d-flex align-items-center">
                      <input
                        className="form-check-input bg-white rounded-1 check-bg ms-2"
                        type="checkbox"
                        value="Yes"
                        ref={ipCheckRef}
                        onChange={ipCheckHandler}
                        disabled={userAct === "view" ? "disabled" : ""}
                      />
                      <label className="form-check-label ms-2">IP</label>
                      <input
                        type="text"
                        className="form-control form-control-sm shadow-none ms-2"
                        disabled={userAct === "view" ? "disabled" : ""}
                        defaultValue={userData.ip || ""}
                        ref={ipRef}
                        style={{ display: "none" }}
                      />
                    </li>
                  </ul>

                  {userAct === "edit" ? (
                    <ul className="list-group list-group-horizontal-md mb-3 mt-2">
                      <li className="list-group-item">
                        <button
                          type="button"
                          className="btn btn-sm theme-btn text-white"
                          onClick={updateMode}
                        >
                          Update
                        </button>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </div>

                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">WEBHOOK URL</h6>
                  </div>
                </div>

                <div
                  className="d-flex my-3     "
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="col-md-7 col-lg-8">
                    {/* <Label name="Only one webhook URL can be added at a time" req={true} /> */}

                    <CstmInput
                      register={register}
                      // req={true}
                      id="callbackUrl"
                      name="webhookPayoutUrl"
                      errors={errors.webhookPayoutUrl}
                      // regex={{ pattern: /^[\w-_.]+@([\w-]+\.)+[a-z]{2,4}$/ }}
                      style={{ background: callbackUrl ? "#e9ecef" : "" }}
                      defaultValue={callbackUrl}
                      holder="Only one webhook URL can be added at a time"
                    />
                  </div>

                  {userAct === "edit" ? (
                    <div
                      className="list-group list-group-horizontal-md d-flex"
                      style={{ alignItems: "center", gap: "8px" }}
                    >
                      <button
                        type="button"
                        className="btn btn-sm theme-btn  text-white"
                        disabled={userAct === "view" ? "disabled" : ""}
                        id="addCallbackBtn"
                        onClick={callbackHandelar}
                        style={{ height: "32px" }}
                      >
                        ADD
                      </button>
                      {/* <div style={{ transform: "scale(0.8)" }}> */}
                      {/* </div> */}
                      <button
                        type="button"
                        className="btn btn-sm border-success text-success "
                        disabled={userAct === "view" ? "disabled" : ""}
                        id="editCallbackBtn"
                        onClick={callbackHandelar}
                        style={{ height: "32px" }}
                        title="Edit Url"
                      >
                        {" "}
                        <i
                          className="fa-solid fa-pen-to-square"
                          id="editCallbackBtn"
                        ></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm border-danger  text-danger"
                        disabled={userAct === "view" ? "disabled" : ""}
                        id="dltCallbackBtn"
                        onClick={callbackHandelar}
                        style={{ height: "32px" }}
                      >
                        <i
                          className="fa-solid fa-trash-can"
                          id="dltCallbackBtn"
                        ></i>
                      </button>
                      {callbackUrl && (
                        <ToggleSwitch
                          status={statusData}
                          setChecked={setChecked}
                          handleToggle={handleToggle}
                          checked={checked}
                        />
                      )}

                      {/* {console.log("statusData?.status--", statusData?.status)} */}
                      {/* <button type="button" className="btn btn-sm border-success text-success mx-1" disabled={userAct === 'view' ? "disabled" : ""}  id="editCallbackBtn" onClick={callbackHandelar}>
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                </button> 
                                                                    
                                                                <button type="button" className="btn btn-sm border-danger text-danger mx-1" disabled={userAct === 'view' ? "disabled" : ""}  id="dltCallbackBtn" onClick={callbackHandelar} >
                                                                    <i className="fa-solid fa-trash-can"></i>
                                                                </button> */}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="row">
                  <div className="col-12 px-1">
                    <h6 className="theme-btn text-white p-2">PROCESSOR</h6>
                  </div>
                </div>
                {userAct === "edit" ? (
                  <form
                    className="mt-2 mb-2 usrchargeform"
                    onSubmit={handleSubmit(chargesHandler)}
                  >
                    <div className="row">
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Transfer Type" req={true} />
                        <SelectInput
                          register={register}
                          req={true}
                          option={["NEFT", "IMPS", "RTGS", "UPI"]}
                          name="transferType"
                          regex={alphaRex}
                          onInput={blankSpace}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Processor" req={true} />
                        {/* option={["SANYUKTPAY","NSDL","BENAKPAY","SAMBHAVPAY","RUPIXPE"] */}
                        <SelectInput
                          register={register}
                          req={true}
                          option={["SANYUKTPAY", "BENAKPAY", "SAMBHAVPAY","PRUPIXPE"]}
                          name="procName"
                          regex={alphaRex}
                          onInput={blankSpace}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="GST" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="gst"
                          errors={errors.gst}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="MDR" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="mdr"
                          errors={errors.mdr}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Slab" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="slab"
                          errors={errors.slab}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Charge Type(below rs.1000)" req={true} />
                        <SelectInput
                          register={register}
                          req={true}
                          option={["FLAT", "PERCENT"]}
                          name="chargeType"
                          regex={alphaRex}
                          onInput={blankSpace}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Flat (below rs.1000)" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="flat"
                          errors={errors.slab}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Reseller Commission (%)" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="resellerCommision"
                          errors={errors.slab}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                      <div className="col-md-6 col-lg-4 mb-2">
                        <Label name="Acc Limit (₹)" req={true} />
                        <Input
                          register={register}
                          req={true}
                          name="accLimit"
                          errors={errors.accLimit}
                          regex={""}
                          onInput={typeFloatNumber}
                        />
                      </div>
                    </div>
                     <div className="row justify-content-center">
  <div className="col-md-6 col-lg-4">
    <button
      type="submit"
      className="btn theme-btn text-white d-block w-100 mb-2"
      disabled={userAct === "view"}
    >
      ADD
    </button>
  </div>
</div>

                  </form>
                ) : (
                  ""
                )}

                <div className="table-responsive my-2">
                  <table className="table table-bordered payout-table mb-0 charges-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Tran Type</th>
                        <th>Processor</th>
                        <th>GST</th>
                        <th>MDR</th>
                        <th>Slab</th>
                        <th>Charge Type</th>
                        <th>Flat</th>
                         <th>Reseller Comm.</th>
                         <th>Acc Limit .</th>
                        
                        <th>Creation Date</th>
                        <th>Modified Date</th>
                        {userAct === "edit" ? <th>Action</th> : ""}
                      </tr>
                    </thead>
                    <tbody>
                      {chargeData.length < 1 ? (
                        <tr>
                          <td colSpan={16}>
                            <h6>Not Found</h6>
                          </td>
                        </tr>
                      ) : (
                        chargeData.map((item, index) => {
                          return (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.transfer_type}</td>
                              <td>
                                <select
                                  className="form-select shadow-none form-select-sm _proc"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.proc_name}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                >
                                  <option value="SANYUKTPAY">SANYUKTPAY</option>
                                  {/* <option value="NSDL">NSDL</option> */}
                                  <option value="BENAKPAY">BENAKPAY</option>
                                  <option value="SAMBHAVPAY">SAMBHAVPAY</option>
                                  <option value="RUPIXPE">RUPIXPE</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _gst"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.gst}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _mdr"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.mdr}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _slab"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.slab}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>
                              <td>
                                <select
                                  className="form-select shadow-none form-select-sm _charge"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.charge_type}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                >
                                  <option value="FLAT">FLAT</option>
                                  <option value="PERCENT">PERCENT</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _flat"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.flat}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _reseller_commision"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.reseller_commision}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control shadow-none form-select-sm _acc_limit"
                                  style={{ minWidth: "100px" }}
                                  defaultValue={item.acc_limit}
                                  onChange={typeFloatNumber}
                                  disabled={
                                    userAct === "view" ? "disabled" : ""
                                  }
                                />
                              </td>

                              {/* <td>{item.reseller_commision}</td> */}
                              <td>{item.creation_date}</td>
                              <td>{item.modification_date}</td>
                              {userAct === "edit" ? (
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm border-success text-success mx-1"
                                    onClick={(e) =>
                                      updateCharge(e, item.transfer_type)
                                    }
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-sm border-danger text-danger mx-1"
                                    onClick={() =>
                                      deleteCharge(item.transfer_type)
                                    }
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </td>
                              ) : (
                                ""
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer flex-nowrap">
              <button
                type="button"
                className="btn btn-sm btn-secondary mx-1 w-100"
                data-bs-dismiss="modal"
                onClick={() => setUserRefresh((status) => !status)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </UsrMgmtContext.Provider>
  );
};

export default UserMgmtModal;

const UserInputBox = ({ label, data }) => {
  return (
    <div className="col-12 col-sm-4 mb-2">
      <label className="form-label fw-bold text-secondary form_label">
        {label}
      </label>
      <input
        type="text"
        className="form-control shadow-none"
        defaultValue={data}
        disabled
      />
    </div>
  );
};
