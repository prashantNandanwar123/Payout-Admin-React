import { Navbar } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { fetchApi } from "../assets/js/functions";
import { toast } from "react-toastify";
import { DateInput } from "../components/RHF";
import { CheckInput } from "../components/MiniComps";

const ManualReversalReport = ({setIsAuth}) => {

    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    const [reversalData, setReversalData] = useState([]);
    const [revFilterData, setRevFilterData] = useState([]);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');

    const itemsPerPage = 10;
    const searchData = reversalData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        // (async () => {
        //     setTableDataStatus('Loading...')
        //     let [res, result] = await fetchApi('getRevData', 'POST', {fromDate:'',toDate:''})
        //     if (res.status === 200) {
        //         if(result.respData.length > 0){
        //             setReversalData(result.respData)
        //             setTableDataStatus('')
        //         }else{
        //             setTableDataStatus('Not Found')
        //         }
        //     }
        // })()
        searchDataByDate()
    }, [])

    const searchDataByDate = async (e) => {
        if(e) e.preventDefault();
        let fromDate = fromDateRef.current.value;
        let toDate = toDateRef.current.value;
        setTableDataStatus('Loading...')
        setReversalData([])
        let [res, result] = await fetchApi('getRevData','POST', {fromDate,toDate})
        // console.log(res)
        // console.log(result)
        if(res.status !== 200){
            toast.error('Something went wrong :', {toastId:1})
        }else{
            if(result.respData && result.respData.length > 0) {
                let data = result.respData.sort(function(a, b) {
                    let c = new Date(a.creationDate);
                    let d = new Date(b.creationDate);
                    return d-c;
                })
                setReversalData(data)
                setRevFilterData(data)
                setTableDataStatus('')
            }else{
                setReversalData([])
                setTableDataStatus('Not Found')
            }
        }
    }

    const changeHandler = () => {
        let checkElem = document.querySelectorAll('.mrr_filter input');
        let choices = [];
        checkElem.forEach(item => item.checked ? choices.push(item.value) : '')
        let filteredArr = revFilterData.filter(item => choices.length > 0 ? choices.includes(item.reversalStatus) : item);
        setReversalData(filteredArr)
        if (filteredArr.length < 1) setTableDataStatus('Not Found')
    }

    return (
        <div className="manualreversal-page">
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="Manual Reversal" setIsAuth={setIsAuth} />
                    
                    <form className="revdate-form mb-3" onSubmit={searchDataByDate}>
                        <div className="d-sm-flex">
                            <div className="inp-box me-2"><DateInput dateRef={fromDateRef} /></div>
                            <div className="inp-box me-2"><DateInput dateRef={toDateRef} /></div>
                            <button type="submit" className="btn btn-sm border-0 text-white theme-btn me-2">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </form>

                    <ul className="list-group list-group-horizontal-md mb-3 mt-2 mrr_filter">
                        <li className="list-group-item">
                            <CheckInput id="mrrcheck1" val="Initiated" label="INITIATED" change={changeHandler} />
                        </li>
                        <li className="list-group-item">
                            <CheckInput id="mrrcheck2" val="Not Initiated" label="NOT INITIATED" change={changeHandler} />
                        </li>
                        <li className="list-group-item">
                            <CheckInput id="mrrcheck3" val="Completed" label="COMPLETED" change={changeHandler} />
                        </li>
                    </ul>  

                    <PagiSearch setSearch={setSearch} 
                    totalEntries={searchData.length} 
                    setStartOffset={setStartOffset} 
                    setTableDataStatus={setTableDataStatus} />

                    <div className="table-responsive my-2">
                        <table className="table table-bordered payout-table mb-0">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Batch No</th>
                                    <th>User Id</th>
                                    <th>Txn Ref Id</th>
                                    <th>Status</th>
                                    <th>Reversal Status</th>
                                    <th>Final Amount</th>
                                    <th>Verify Status</th>
                                    <th>Description</th>
                                    <th>Creation Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length < 1 ? <tr><td colSpan={16}><h6>{tableDataStatus}</h6></td></tr> : 
                                currentItems.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{startOffset+index+1}</td>
                                            <td>{item.batchNo}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.txnRefId}</td>
                                            <td>{item.status}</td>
                                            <td>{item.reversalStatus}</td>
                                            <td>{item.finalAmount}</td>
                                            <td>{item.verifyStatus}</td>
                                            <td>{item.description}</td>
                                            <td>{item.creationDate}</td>
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
    )
}

export default ManualReversalReport;