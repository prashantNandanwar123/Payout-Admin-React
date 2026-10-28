import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { fetchApi, sortDateSwitch, dateInNumbers } from "../assets/js/functions";
import { ModalBodyData, CheckInput } from "../components/MiniComps";
import { Navbar } from "../components/Navbar";
import { PagiPageCount, PagiSearch, SortTableHeader } from "../components/PaginateTable";
import { blankSpace, stopTags, typeFloatNumber, typeNumber } from "../assets/js/validationRHF";
import { Label, Input, DateInput } from "../components/RHF";
 
const Wallet = ({setIsAuth}) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [walletData, setWalletData] = useState([]);
    const [walletDataFilter, setWalletDataFilter] = useState([]);
    const [walletDataById, setWalletDataById] = useState({});
    const [refreshTable, setRefreshTable] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const [txnId, setTxnId] = useState('');

    const remarkRef = useRef('');
    const closeRef = useRef('');
    const closeDepositRef = useRef('');
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    const itemsPerPage = 10;
    const searchData = walletData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        searchDataByDate();
    }, [refreshTable])

    const sortByDate = (e, action) => {
        let sortData = sortDateSwitch(e, searchData, action)
        setWalletData(sortData)
    }

    const viewDeposit = (id) => {
        let filterData = walletData.filter(item => item.id === id)
        setWalletDataById(filterData[0])
    }

    const changeHandler = (e) => {
        let choices = [];
        let allFltrInps = document.querySelectorAll('.wlt_filter input');
        allFltrInps.forEach((item)=> item.checked ? choices.push(item.value) : '')
        let filteredData = walletDataFilter.filter(item => choices.length > 0 ? choices.includes(item.status) : item);
        setWalletData(filteredData)
        if (filteredData.length < 1) setTableDataStatus('Not Found')
    }

    const modalViewAction = async (action) => {
        if(action === 'Approved'){
            commonAprRej('aprMeDepositeRequest')
        }else{
            commonAprRej('rjtMeDepositeRequest')
        }
    }

    const commonAprRej = async (url) => {
        let {id,userId,depositeAmount} = walletDataById;
        let remark = remarkRef.current.value;
        if(!remark) {
            toast.error('Please enter remark', { toastId: 1 })
            return false;
        }
        try {
            let [res, result] = await fetchApi(url, 'POST', {id,userId,remark,depositeAmount})
            // console.log(res)
            // console.log(result)
            if (res.status !== 200) {
                console.log("something went wrong")
            } else {
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 })
                } else {
                    setRefreshTable(status => !status)
                    remarkRef.current.value = '';
                    toast.success(result.respMsg, { toastId: 0 })
                }
                closeRef.current.click();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const openDepositForm = () => setTxnId('TXN'+(new Date()).valueOf())
    
    const depositHandler = async (data) => {
        // console.log({...data, txnId})
        try {
            let [res, result] = await fetchApi('loadMoneyByAdmin', 'POST', {...data, txnId});
            if (res.status !== 200) {
                toast.error('something went wrong : '+res.status, { toastId: 1 })
            } else {
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 })
                } else {
                    reset();
                    toast.success(result.respMsg, { toastId: 0 })
                    closeDepositRef.current.click()
                    setRefreshTable(status => !status)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const searchDataByDate = async (e) => {
        if(e) { e.preventDefault() }
        setWalletData([])
        setWalletDataFilter([])
        setTableDataStatus('Loading...')
        try {
            let fDate = fromDateRef.current.value;
            let tDate = toDateRef.current.value;
            // console.log(fDate+'='+tDate)
            let [res, result] = await fetchApi('getAllPendingMerchantDeposite', 'POST', {fDate,tDate});
            // console.log(result)
            if (res.status === 200) {
                if(result.respData.length > 0){
                    let data = result.respData.sort(function(a, b) {
                        let c = new Date(a.dateTime);
                        let d = new Date(b.dateTime);
                        return d-c;
                    })
                    setWalletData(data)
                    setWalletDataFilter(data)
                    setTableDataStatus('')
                }else{
                    setTableDataStatus('Not Found')
                    setWalletData([])
                    setWalletDataFilter([])
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportToDownloadReport = () => {
        let date = dateInNumbers();
        let reportData = searchData.map(({id, ...rest})=> rest);
        let workbook = XLSX.utils.book_new();
        let worksheet = XLSX.utils.json_to_sheet(reportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "TxnReport");
        XLSX.writeFile(workbook, `TxnReport_${date}.xlsx`);
    }

    return (<>
        <div className="beneficiary-page">
            {/* <SidebarNavigation /> */}
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="manage fund" setIsAuth={setIsAuth} />

                    <form className="mb-2" onSubmit={searchDataByDate}>
                        <div className="row">
                            <div className="col-md-4 col-lg-2 mb-2">
                                <DateInput dateRef={fromDateRef} />
                            </div>
                            <div className="col-md-4 col-lg-2 mb-2">
                                <DateInput dateRef={toDateRef} />
                            </div>
                            <div className="col-md-4 col-lg-8 mb-2">
                                <div className="d-flex">
                                <button type="submit" className="btn btn-sm border-0 text-white theme-btn me-3">Search</button>
                                <button type="button" className="btn btn-sm border-0 text-white theme-btn d-flex align-items-center" onClick={exportToDownloadReport}>
                                Report <i className="fa-solid fa-download ms-1" style={{fontSize:'10px'}}></i>
                                </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="row">
                        <div className="col-md-8">
                            <ul className="list-group list-group-horizontal-md mb-3 wlt_filter">
                                <li className="list-group-item">
                                    <CheckInput id="wltcheck1" val="Pending" label="PENDING" change={changeHandler} />
                                </li>
                                <li className="list-group-item">
                                    <CheckInput id="wltcheck2" val="Approved" label="APPROVED" change={changeHandler} />
                                </li>
                                <li className="list-group-item">
                                    <CheckInput id="wltcheck3" val="Rejected" label="REJECTED" change={changeHandler} />
                                </li>
                            </ul> 
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn text-white d-block ms-auto mb-3 theme-btn" data-bs-toggle="modal" data-bs-target="#depositmodal" onClick={openDepositForm}><i className="bi bi-plus-lg"></i> DEPOSIT MONEY</button>
                        </div>
                    </div>


  
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
                                    <th>Txn Id</th>
                                    <th>Mode</th>
                                    <th>Previous Balance</th>
                                    <th>Deposite Amount</th>
                                    <th>Available Balance</th>
                                    <th>Status</th>
                                    <th>Txn Type</th>
                                    <th><SortTableHeader text="Deposite Date" change={(e) => sortByDate(e, 'depositeDate')} /></th>
                                    <th>Ref No / UTR</th>
                                    <th>Remark</th>
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
                                            <td>{item.txnId}</td>
                                            <td>{item.mode}</td>
                                            <td>{item.previousBalance}</td>
                                            <td>{item.depositeAmount}</td>
                                            <td>{item.availableBalance}</td>
                                            <td>{item.status}</td>
                                            <td>{item.txnType}</td>
                                            <td>{item.dateTime}</td>
                                            <td>{item.refNoUtr}</td>
                                            <td>{item.remark}</td>
                                            <td>
                                                <button type="button" className="btn btn-sm border-0 text-white" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>viewDeposit(item.id)}>VIEW</button>
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
                        <ModalBodyData name="User Id" data={walletDataById.userId} />
                        <ModalBodyData name="Mode" data={walletDataById.mode} />
                        <ModalBodyData name="Previous Balance" data={walletDataById.previousBalance} />
                        <ModalBodyData name="Deposite Amount" data={walletDataById.depositeAmount} />
                        <ModalBodyData name="Available Balance" data={walletDataById.availableBalance} />
                        <ModalBodyData name="Status" data={walletDataById.status} />
                        <ModalBodyData name="Deposite Date" data={walletDataById.dateTime} />
                        <ModalBodyData name="Ref No / UTR" data={walletDataById.refNoUtr} />
                        {walletDataById.status === 'Pending' ? 
                        <div className="border p-2 mb-2">
                            <h6>Remark <span className="text-danger fw-bold"> *</span></h6>
                            <input className="form-control shadow-none" ref={remarkRef} onChange={(e)=>{stopTags(e);blankSpace(e)}} />
                        </div>
                        : <ModalBodyData name="Remark" data={walletDataById.remark} /> }
                    </div>
                    <div className="modal-footer flex-nowrap">
                        {walletDataById.status === 'Pending' ? 
                        <>
                            <button type="button" className="btn btn-sm btn-success mx-1 w-100" onClick={()=>modalViewAction('Approved')}>Approve</button>
                            <button type="button" className="btn btn-sm btn-danger mx-1 w-100" onClick={()=>modalViewAction('Rejected')}>Reject</button>
                        </>
                        :''}
                        <button type="button" className="btn btn-sm btn-secondary mx-1 w-100" data-bs-dismiss="modal" ref={closeRef}>Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="depositmodal" data-bs-backdrop="static">
                <div className="modal-dialog modal-sm modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">DEPOSIT MONEY -</h5>
                        </div>
                        <div className="modal-body">
                            <form className="px-2 rounded mb-3" onSubmit={handleSubmit(depositHandler)} autoComplete="off">
                                <div className="border p-2 mb-2 rounded d-flex align-items-center justify-content-center">
                                    <h6 className="mb-0">Txn Id :</h6>
                                    <strong className="ms-2">{txnId}</strong>
                                </div>
                                <div className="mb-2">
                                    <Label for="uid" name="User Id" req={true} />
                                    <Input register={register} req={true} id="uid" name="userId" 
                                    errors={errors.userId} regex={''} onInput={typeNumber} maxLen={10} />
                                </div>
                                <div className="mb-2">
                                    <Label for="loadamt" name="Deposit Amount" req={true} />
                                    <Input register={register} req={true} id="loadamt" name="depositeAmount" 
                                    errors={errors.depositeAmount} regex={''} onInput={typeFloatNumber} />
                                </div>
                                <div className="text-center mt-3">
                                    <button type="button" className="btn btn-danger mx-2" data-bs-dismiss="modal" ref={closeDepositRef}>Close</button>
                                    <button type="submit" className="btn text-white theme-btn mx-2">Deposit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

    </>)
}

export default Wallet;