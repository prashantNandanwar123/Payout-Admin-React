import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchApi } from "../assets/js/functions";
import { ModalBodyData } from "../components/MiniComps";
import { Navbar } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";

const Beneficiary = ({setIsAuth}) => {

    const [benefData, setBenefData] = useState([]);
    const [benefDataById, setBenefDataById] = useState({});
    const [changeStatus, setChangeStatus] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');

    const itemsPerPage = 10;
    const searchData = benefData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        (async () => {
            //console.log('ddddddddddddddddddddddddddddddd')
            setTableDataStatus('Loading...')
            let [res, result] = await fetchApi('getAllBeneficiary', 'POST', {action:'Pending'})
            //console.log(result)
            if (res.status === 200) {
                if(result.respData.length > 0){
                    setBenefData(result.respData)
                    setTableDataStatus('')
                }else{
                    setTableDataStatus('Not Found')
                }
            }
        })()
    }, [changeStatus])

    const viewBenef = (id) => {
        let filterData = benefData.filter(item => item.id === id)
        setBenefDataById(filterData[0])
    }

    const modalViewAction = async (action) => {
        let {id,userId,transferMode} = benefDataById;

        // console.log(action+'-'+id+'-'+userId+'-'+transferMode)

        try {
            let [res, result] = await fetchApi('getBeneficiaryAction', 'POST', {id,userId,action,transferType:transferMode})
            
            // console.log(res)
            // console.log(result)
            
            if (res.status !== 200) {
                console.log("something went wrong")
            } else {
                let {responseMsg} = JSON.parse(result.respData);
                if (result.respCode === 1) {
                    toast.error(responseMsg, { toastId: 1 })
                } else {
                    setChangeStatus(status => !status)
                    toast.success(responseMsg, { toastId: 0 })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="beneficiary-page">
            {/* <SidebarNavigation /> */}
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="beneficiary" setIsAuth={setIsAuth} />

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
                                    <th>Request Id</th>
                                    <th>Transfer Mode</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Ifsc Code</th>
                                    <th>Bank Name</th>
                                    <th>Bank Branch Address</th>
                                    <th>Account No.</th>
                                    <th>Pincode</th>
                                    <th>Address</th>
                                    <th>Varify Status</th>
                                    <th>Source</th>
                                    <th>Beneficiary Status</th>
                                    <th>Creation Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length < 1 ? <tr><td colSpan={16}><h6>{tableDataStatus}</h6></td></tr> : 
                                currentItems.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{startOffset+index+1}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.requestId}</td>
                                            <td>{item.transferMode}</td>
                                            <td>{item.beneficiaryName}</td>
                                            <td>{item.beneficiaryEmail}</td>
                                            <td>{item.beneficiaryMobile}</td>
                                            <td>{item.beneficiaryIfcsCode}</td>
                                            <td>{item.beneficiaryBankName}</td>
                                            <td>{item.beneficiaryBankBranchName}</td>
                                            <td>{item.beneficiaryAccountNo}</td>
                                            <td>{item.beneficiaryPincode}</td>
                                            <td>{item.beneficiaryAddress}</td>
                                            <td>{item.verifyStatus}</td>
                                            <td>{item.source}</td>
                                            <td>{item.beneficiaryStatus}</td>
                                            <td>{item.creationDate}</td>
                                            <td>
                                                <button type="button" className="btn btn-sm border-0 text-white" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>viewBenef(item.id)}>VIEW</button>
                                            </td>
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
        
        <div className="modal fade viewmodal" id="payModal" data-bs-backdrop="static">
            <div className="modal-dialog modal-sm modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Please Re-Check Details :</h5>
                    </div>
                    <div className="modal-body">
                        <ModalBodyData name="Transfer Mode" data={benefDataById.transferMode} />
                        <ModalBodyData name="User Id" data={benefDataById.userId} />
                        <ModalBodyData name="Beneficiary Name" data={benefDataById.beneficiaryName} />
                        <ModalBodyData name="Beneficiary Account No" data={benefDataById.beneficiaryAccountNo} />
                        <ModalBodyData name="Beneficiary Ifsc Code" data={benefDataById.beneficiaryIfcsCode} />
                        <ModalBodyData name="Beneficiary Mobile No" data={benefDataById.beneficiaryMobile} />
                        <ModalBodyData name="Beneficiary Email Address" data={benefDataById.beneficiaryEmail} />
                        <ModalBodyData name="Beneficiary Bank Name" data={benefDataById.beneficiaryBankName} />
                        <ModalBodyData name="Beneficiary Address" data={benefDataById.beneficiaryAddress} />
                        <ModalBodyData name="Verify Status" data={benefDataById.verifyStatus} />
                        <ModalBodyData name="Beneficiary Status" data={benefDataById.beneficiaryStatus} />
                        <ModalBodyData name="Creation Date" data={benefDataById.creationDate} />
                    </div>
                    <div className="modal-footer flex-nowrap">
                        <button type="button" className="btn btn-sm btn-success mx-1 w-100" data-bs-dismiss="modal" onClick={()=>modalViewAction('Approved')}>Approve</button>
                        <button type="button" className="btn btn-sm btn-danger mx-1 w-100" data-bs-dismiss="modal" onClick={()=>modalViewAction('Rejected')}>Reject</button>
                        <button type="button" className="btn btn-sm btn-secondary mx-1 w-100" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </>)
}

export default Beneficiary;