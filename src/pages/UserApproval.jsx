import { useEffect, useState } from "react";
import { fetchApi } from "../assets/js/functions";
// import BSModal from "../components/userModal";
import { Navbar } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import UserMgmtModal from "../components/UserMgmtModal";

const allColumns = [
  { key: "sno", label: "S.No." },
  { key: "userId", label: "User Id" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "emailId", label: "Email Id" },
  { key: "address", label: "Address" },
  { key: "companyName", label: "Company Name" },
  { key: "creationDate", label: "Creation Date" },
  { key: "accountStatus", label: "Account Status" },
  { key: "action", label: "Action" },
];

const UserApproval = ({ setIsAuth }) => {
  const [userData, setUserData] = useState([]);
  // const [userForm, setUserForm] = useState({});
  // const [approveAct, setApproveAct] = useState('');
  const [userDataById, setUserDataById] = useState({});
  const [userRefresh, setUserRefresh] = useState(false);
  const [startOffset, setStartOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [tableDataStatus, setTableDataStatus] = useState("");

  const [userAction, setUserAction] = useState("");

  const itemsPerPage = 10;
  const searchData = userData.filter((item) =>
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
      let [res, result] = await fetchApi("usrApr", "GET");
      if (res.status !== 200) {
        console.log("something went wrong");
      } else {
        if (result.respCode === 1) {
          console.log(result.respMsg);
        } else {
          setUserData(result.respData);
        }
      }
    })();
  }, [userRefresh]);

  const showUserData = (id, action) => {
    let filterData = userData.filter((item) => item.id === id);
    setUserDataById(filterData[0]);
    setUserAction(action);
  };

  // console.log(userDataById)
  // const statusHandler = (id,action) => {
  //     let filterData = userData.filter(item => item.id === id)
  //     setUserForm(filterData[0])
  //     setApproveAct(action)
  // }

  // const directActivateAccount = async (userId,action) => {
  //     let [res, result] = await fetchApi('usrActivate', 'POST', {userId,action})
  //     if (res.status !== 200) {
  //         toast.error(`Something went wrong ( status : ${res.status} )`, { toastId: 1 })
  //     } else {
  //         toast.success(result.respMsg, { toastId: 0 })
  //         setUserRefresh(status => !status)
  //     }
  // }

  // console.log(userDataById)

  // -----------------------------------------------------------------------------------

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
    <>
      <div className="userapproval-page">
        {/* <SidebarNavigation /> */}
        <div className="container-fluid">
          <div className="main-content pt-3">
            <Navbar title="User Approval" setIsAuth={setIsAuth} />
            <div className="row">
              <PagiSearch
                setSearch={setSearch}
                totalEntries={searchData.length}
                setStartOffset={setStartOffset}
                setTableDataStatus={setTableDataStatus}
                allColumns={allColumns}
                visibleColumns={visibleColumns}
                handleColumnToggle={handleColumnToggle}
              />

              {/* <div className="dropdown mb-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Columns
                </button>
                <ul
                  className="dropdown-menu p-2"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {allColumns.map((col) => (
                    <li key={col.key} className="dropdown-item">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => handleColumnToggle(col.key)}
                          id={`check-${col.key}`}
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor={`check-${col.key}`}
                        >
                          {col.label}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
            <div className="table-responsive my-2">
              <table className="table table-bordered payout-table">
                <thead>
                  <tr>
                    {showColumn("sno") && <th>S.No.</th>}
                    {showColumn("userId") && <th>User Id</th>}
                    {showColumn("firstName") && <th>First Name</th>}
                    {showColumn("lastName") && <th>Last Name</th>}
                    {showColumn("emailId") && <th>Email Id</th>}
                    {showColumn("address") && <th>Address</th>}
                    {/* <th>Aadhar No</th>
                                    <th>City</th> */}
                    {showColumn("companyName") && <th>Company Name</th>}
                    {/* <th>Company Address</th> */}
                    {showColumn("creationDate") && <th>Creation Date</th>}
                    {/* <th>Gender</th>
                                    <th>Merchant Bank Name</th>
                                    <th>Merchant Bank Account Number</th>
                                    <th>Merchant Bank Ifsc</th>
                                    <th>Pan No</th>
                                    <th>Pin Code</th>
                                    <th>State</th> */}
                    {/* <th>Token Generation Status</th>
                                    <th>Token Generation Description</th>
                                    <th>Onboarding Status</th>
                                    <th>Onboarding Description</th>
                                    <th>Bank Info Register Status</th>
                                    <th>Bank Info Register Description</th> */}
                    {showColumn("accountStatus") && <th>Account Status</th>}
                    {/* <th>Aadhar Document</th>
                                    <th>Pan Document</th>
                                    <th>Remark</th>
                                    <th>Status</th> */}
                    {showColumn("action") && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length < 1 ? (
                    <tr>
                      <td colSpan={25}>
                        <h6>{tableDataStatus}</h6>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          {showColumn("sno") && <td>{index + 1}</td>}
                          {showColumn("userId") && <td>{item.userId}</td>}
                          {showColumn("firstName") && <td>{item.firstName}</td>}
                          {showColumn("lastName") && <td>{item.lastName}</td>}
                          {showColumn("emailId") && <td>{item.emailId}</td>}
                          {showColumn("address") && <td>{item.address}</td>}
                          {/* <td>{item.adharNo}</td>
                                            <td>{item.city}</td> */}
                          {showColumn("companyName") && (
                            <td>{item.companyName}</td>
                          )}
                          {/* <td>{item.companyAddress}</td> */}
                          {showColumn("creationDate") && (
                            <td>{item.creationDate}</td>
                          )}
                          {/* <td>{item.gender}</td>
                                            <td>{item.merchantBankName}</td>
                                            <td>{item.merchantBankAccountNumber}</td>
                                            <td>{item.merchantBankIfsc}</td>
                                            <td>{item.panNo}</td>
                                            <td>{item.pincode}</td>
                                            <td>{item.state}</td> */}
                          {/* <td>{item.tokengenerationStatus}</td>
                                            <td>{item.tokenGenerationDescription}</td>
                                            <td>{item.onboardingStatus}</td>
                                            <td>{item.onboardingDescription}</td>
                                            <td>{item.bankInfoRegisterStatus}</td>
                                            <td>{item.bankInfoRegisterDescription}</td> */}
                          {showColumn("accountStatus") && (
                            <td>{item.accountStatus}</td>
                          )}
                          {/* <td>{item.adharDocument}</td>
                                            <td>{item.panDocument}</td>
                                            <td>{item.remark}</td> */}
                          {/* <td> */}
                          {/* icerview btn start */}
                          {/* {item.accountStatus === 'Pending' || item.accountStatus === 'Deactivated' ? 
                                                <div type="button" className="btn btn-success btn-sm mx-1" onClick={()=>directActivateAccount(item.userId,'Activated')}>ACTIVATE</div>
                                                : <div type="button" className="btn btn-secondary btn-sm mx-1" onClick={()=>directActivateAccount(item.userId,'Deactivated')}>DEACTIVATE</div>} */}
                          {/* icerview btn end */}
                          {/* </td> */}
                          {showColumn("action") && (
                            <td>
                              {/* {item.onboardingStatus === 'Pending' ? 
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'onboard')}>ONBOARDING</button>
                                                : <button type="button" className="btn btn-sm border-0 text-white mx-1" disabled>ONBOARDING</button> } 
                                                {item.onboardingStatus !== 'Success' || item.tokengenerationStatus === 'Success' ? 
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" disabled>TOKEN GENERATION</button> :
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'token')}>TOKEN GENERATION</button> 
                                                }
                                                {item.tokengenerationStatus !== 'Success' || item.bankInfoRegisterStatus === 'Success' ? 
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" disabled>REGISTER</button> :
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'register')}>REGISTER</button>
                                                } */}
                              <button
                                type="button"
                                className="btn btn-sm border-0 text-white mx-1"
                                data-bs-toggle="modal"
                                data-bs-target="#userModal"
                                onClick={() => showUserData(item.id, "edit")}
                              >
                                EDIT
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm border-0 text-white mx-1"
                                data-bs-toggle="modal"
                                data-bs-target="#userModal"
                                onClick={() => showUserData(item.id, "view")}
                              >
                                VIEW
                              </button>
                            </td>
                          )}
                          {/* <td>
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'onboard')}>ONBOARDING</button>
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'token')}>TOKEN GENERATION</button> 
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'register')}>REGISTER</button>
                                            </td> */}
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

      <UserMgmtModal
        userData={userDataById}
        userAct={userAction}
        setUserRefresh={setUserRefresh}
      />
      {/* <BSModal setUserRefresh={setUserRefresh} action={approveAct} userData={userForm} /> */}
    </>
  );
};

export default UserApproval;
