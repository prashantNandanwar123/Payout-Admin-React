import { stopTags, typeNumber } from "../assets/js/validationRHF";
import { Navbar } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { fetchApi } from "../assets/js/functions";
import { toast } from "react-toastify";

const AddFund = ({setIsAuth}) => {

    const uIdRef = useRef();
    const addBtnRef = useRef();
    const coNameRef = useRef();

    const [addFundData, setAddFundData] = useState([]);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const [changeStatus, setChangeStatus] = useState(false);

    const itemsPerPage = 10;
    const searchData = addFundData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        (async () => {
            setTableDataStatus('Loading...')
            let [res, result] = await fetchApi('fetchManualAddFund', 'GET')
            // console.log(res)
            // console.log(result)
            if (res.status === 200) {
                if(result.respData.length > 0){
                    setAddFundData(result.respData)
                    setTableDataStatus('')
                }else{
                    setTableDataStatus('Not Found')
                }
            }
        })()
    }, [changeStatus])

    const addFund = async (e) => {
        e.preventDefault();
        let uId = uIdRef.current;
        let coName = coNameRef.current;
        if(uId.value === '' || uId.value.length !== 10){
            toast.error('Please enter valid user id', { toastId: 1 })
            uId.focus();
            return false;
        }else if(coName.value === ''){
            return false;
        }
        try {
            let [res, result] = await fetchApi('addWallet', 'POST', {userId:uId.value,coName:coName.value})
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
                    uId.value = '';
                    coName.value = '';
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCompanyName = async (e) => {
        let userId = e.target.value;
        if (userId.length === 10) {
            try {
                let [res, result] = await fetchApi(`${userId}/companyName`, 'GET')
                if (res.status === 200) {
                    if (result.respCode === 1) {
                        coNameRef.current.value = "Not Found";
                    } else {
                        coNameRef.current.value = result.respData;
                    }      
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // const editAddFund = (id) => {
    //     let filterData = addFundData.filter(item => item.id === id)
    //     let {userId, availableBalance} = filterData[0];
    //     uIdRef.current.value = userId;
    //     amtRef.current.value = availableBalance;
    //     uIdRef.current.readOnly = true;
    //     uIdRef.current.style.cursor = "not-allowed";
    //     addBtnRef.current.textContent = "UPDATE";
    // } 

    return (
        <div className="fundtranstatus-page">
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="wallet" setIsAuth={setIsAuth} />

                    <form className="mt-4 mb-2" onSubmit={addFund}>
                        <div className="row">
                            <div className="col-md-4 col-lg-3 mb-2">
                            <input type="text" className='form-control shadow-none' placeholder="Enter User Id*" ref={uIdRef} onChange={(e)=>{typeNumber(e);fetchCompanyName(e)}} maxLength={10} />
                            </div>
                            <div className="col-md-4 col-lg-3 mb-2">
                            <input type="text" className='form-control shadow-none cursor-not-allow' placeholder="Company Name*" ref={coNameRef} onChange={stopTags} readOnly />
                            </div>
                            <div className="col-md-4 col-lg-3 mb-2">
                                <button type="submit" className="btn border-0 text-white theme-btn" ref={addBtnRef}>CREATE WALLET</button>
                            </div>
                        </div>
                    </form>

                    {/* <input type="text" className={`form-control shadow-none ${css}`} */}

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
                                    <th>Company Name</th>
                                    <th>Available Balance</th>
                                    <th>Last Modified Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length < 1 ? <tr><td colSpan={16}><h6>{tableDataStatus}</h6></td></tr> : 
                                currentItems.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{startOffset+index+1}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.companyName}</td>
                                            <td>{item.availableBalance}</td>
                                            <td>{item.lastModificationDate}</td>
                                            {/* <td>
                                                <span type="button" className="btn btn-sm border-0 text-success" onClick={()=>editAddFund(item.id)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                </span>
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
    )
}

export default AddFund;