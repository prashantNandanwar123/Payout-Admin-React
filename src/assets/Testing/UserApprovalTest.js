
import { useEffect, useState } from "react";
import { fetchApi } from "../assets/js/functions";
// import BSModal from "../components/userModal";
import { Navbar } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import UserMgmtModal from "../components/UserMgmtModal";

const UserApproval = ({setIsAuth}) => {

    const [userData, setUserData] = useState([]);
    // const [userForm, setUserForm] = useState({});
    // const [approveAct, setApproveAct] = useState('');
    const [userDataById, setUserDataById] = useState({});
    const [userRefresh, setUserRefresh] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');

    const [userAction, setUserAction] = useState('');

    const itemsPerPage = 10;
    const searchData = userData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {

        (async () => {
            let [res, result] = await fetchApi('usrApr', 'GET')
            if (res.status !== 200) {
                console.log("something went wrong")
            } else {
                if (result.respCode === 1) {
                    console.log(result.respMsg)
                } else {
                   
                    setUserData(result.respData)
                }
            }
        })()
                
    }, [userRefresh])
    
    const showUserData = (id,action) => {
        let filterData = userData.filter(item => item.id === id)
        setUserDataById(filterData[0])
        setUserAction(action)
    }

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

    return (<>
        <div className="userapproval-page">
            {/* <SidebarNavigation /> */}
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="User Approval" setIsAuth={setIsAuth} />
                    
                    <PagiSearch setSearch={setSearch} 
                    totalEntries={searchData.length} 
                    setStartOffset={setStartOffset} 
                    setTableDataStatus={setTableDataStatus} />
                    
                    <div className="table-responsive my-2">
                        <table className="table table-bordered payout-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>User Id</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email Id</th>
                                    <th>Address</th>

                                    {/* <th>Aadhar No</th>
                                    <th>City</th> */}

                                    <th>Company Name</th>
                                    {/* <th>Company Address</th> */}
                                    <th>Creation Date</th>
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
                                    <th>Account Status</th>
                                    {/* <th>Aadhar Document</th>
                                    <th>Pan Document</th>
                                    <th>Remark</th>
                                    <th>Status</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length < 1 ? <tr><td colSpan={25}><h6>{tableDataStatus}</h6></td></tr> : 
                                currentItems.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.emailId}</td>
                                            <td>{item.address}</td>
                                            {/* <td>{item.adharNo}</td>
                                            <td>{item.city}</td> */}
                                            <td>{item.companyName}</td>
                                            {/* <td>{item.companyAddress}</td> */}
                                            <td>{item.creationDate}</td>
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
                                            <td>{item.accountStatus}</td>
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
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#userModal" onClick={()=>showUserData(item.id,'edit')}>EDIT</button>
                                                <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#userModal" onClick={()=>showUserData(item.id,'view')}>VIEW</button>
                                            </td>
                                            {/* <td>
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'onboard')}>ONBOARDING</button>
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'token')}>TOKEN GENERATION</button> 
                                                <button type="button" className="btn border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>statusHandler(item.id,'register')}>REGISTER</button>
                                            </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <PagiPageCount setStartOffset={setStartOffset} 
                    pageCount={pageCount} itemsPerPage={itemsPerPage} />

                </div>
            </div>
        </div>

        <UserMgmtModal userData={userDataById} userAct={userAction} setUserRefresh={setUserRefresh} />
        {/* <BSModal setUserRefresh={setUserRefresh} action={approveAct} userData={userForm} /> */}

    </>)
}

export default UserApproval;