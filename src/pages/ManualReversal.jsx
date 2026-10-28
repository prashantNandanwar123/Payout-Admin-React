import { Navbar } from "../components/Navbar";
import { useState } from "react";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { fetchApi, uploadValidFile } from "../assets/js/functions";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
// import { DateInput } from "../components/RHF";

const ManualReversal = ({setIsAuth}) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [reversalData, setReversalData] = useState([]);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const [revBtn, setRevBtn] = useState(false);

    const [smtSendBtn, setSmtSendBtn] = useState(false);

    const itemsPerPage = 10;
    const searchData = reversalData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    // useEffect(() => {
    //     commonFetchRevData();
    // }, [])

    // const commonFetchRevData = async () => {
    //     setTableDataStatus('Loading...')
    //     let [res, result] = await fetchApi('getMatchedData', 'GET')
    //     if (res.status === 200) {
    //         if(result.respData.length > 0){
    //             setReversalData(result.respData)
    //             setTableDataStatus('')
    //             setRevBtn(true)
    //         }else{
    //             setTableDataStatus('Not Found')
    //         }
    //     }
    // }
    
    const sendFile = async (data) => {
        let file = data.file[0];
        let formData = new FormData();
        // if(reversalData.length > 0){
        //     toast.error('Please proceed old reversal', {toastId:1})
        //     return false;
        // }
        formData.append("file",file)
        setSmtSendBtn(true)
        setTableDataStatus('Loading...')
        try {
            // let res = await fetch('/api/Admin/upload',{method:'POST',body:formData})
            let res = await fetch('/PayoutAdmin/api/Admin/upload',{method:'POST',body:formData})
            let result = await res.json();
            // let [res, result] = await fetchApi('upload', 'POST', formData)
            // console.log(res)
            // console.log(result)
            if(res.status !== 200){
                toast.error('Something went wrong', {toastId:1})
            }else{
                if(result.respCode === 0){
                    toast.success(result.respMsg, {toastId:0})
                    if(result.respData && result.respData.length > 0){
                        setReversalData(result.respData)
                        setTableDataStatus('')
                        setRevBtn(true)
                    }else{
                        setTableDataStatus('Not Found !!')
                    }
                }else{
                    toast.error(result.respMsg, {toastId:1})
                    setTableDataStatus('Not Found !!')
                    setRevBtn(false)
                }
                // commonFetchRevData()
                setSmtSendBtn(false)
                reset()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const reversalStart = async () => {
        // console.log('reversalStart called.')
        setReversalData([])
        setRevBtn(false)
        setTableDataStatus('Loading...')
        let loadId = toast.loading('Please wait reversal in process...')
        let [res, result] = await fetchApi('revInitiate', 'POST', searchData)
        // console.log(result)
        if(res.status !== 200){
            toast.error('Something went wrong :', {toastId:1})
        }else{
            if(result.respCode === 0){
                toast.update(loadId,{render:result.respMsg,type:"success",isLoading:false,autoClose:true});
            }else{
                toast.update(loadId,{render:result.respMsg,type:"error",isLoading:false,autoClose:true});
            }
            // commonFetchRevData();
            setTableDataStatus('Not Found !!')
        }
    }

    return (
        <div className="manualreversal-page">
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="Manual Reversal" setIsAuth={setIsAuth} />
                    
                    <form className="revfile-form mb-3" onSubmit={handleSubmit(sendFile)}>
                        <div className="d-sm-flex">
                            <div className="inp-box me-2">
                                <label htmlFor="formFile" className="form-label fw-bold text-secondary">
                                    <small>PLEASE UPLOAD REVERSAL (EXCEL) FILE</small>
                                    <span className="text-danger fw-bold"> *</span>
                                </label>
                                <input className="form-control form-control-sm shadow-none" type="file" id="formFile" onInput={uploadValidFile}
                                {...register('file', {required: {value:true, message:'This is a required field'}})} />
                                <strong className="text-danger inpErr">{errors.file && errors.file.message}</strong>
                            </div>
                            <div>
                                <label htmlFor="formFile" className="form-label dummy d-block invisible">DUMMY</label>
                                {smtSendBtn ? 
                                    <button className="btn btn-sm border-0 text-white theme-btn" disabled>
                                        <span className="spinner-border spinner-border-sm"></span> SEND
                                    </button> :
                                    <button className="btn btn-sm border-0 text-white theme-btn" type="submit">SEND</button>
                                }
                            </div>
                        </div>
                    </form>

                    {/* <input type="text" className={`form-control shadow-none ${css}`} */}

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
                                            <td>{item.creationDate}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <PagiPageCount setStartOffset={setStartOffset} 
                    pageCount={pageCount} itemsPerPage={itemsPerPage} />
                    
                    {revBtn ? 
                    <div className="text-center">
                        <button type="button" className="btn border-0 text-white theme-btn mb-5" onClick={reversalStart}>REVERSAL START</button>
                    </div>
                    :''}
                </div>
            </div>
        </div>
    )
}

export default ManualReversal;