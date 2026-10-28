import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { fetchApi, multiFocus } from "../assets/js/functions";
import { Navbar } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { alphaNumericRex, alphaNumSpaceRex, alphaRex, blankSpace, emailRex, stopTags, typeNumber } from "../assets/js/validationRHF";
import { Label, Input, SelectInput, EditInput } from "../components/RHF";

const AddReseller = ({ setIsAuth }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: register2, handleSubmit: handleSubmit2, reset:reset2, formState: { errors: errors2 } } = useForm();

    const [resellerData, setResellerData] = useState([]);
    const [resellerDataById, setResellerDataById] = useState({});
    const [refreshTable, setRefreshTable] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const [userAction, setUserAction] = useState('');

    const addCloseRef = useRef('');
    const editCloseRef = useRef('');
    const rslrStatusRef = useRef(null);

    const itemsPerPage = 10;
    const searchData = resellerData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        (async () => {
            setTableDataStatus('Loading...')
            let [res, result] = await fetchApi('getReseller', 'GET')
            // console.log(res)
            // console.log(result)
            if (res.status === 200) {
                if (result.respData.length > 0) {
                    setResellerData(result.respData)
                    setTableDataStatus('')
                } else {
                    setTableDataStatus('Not Found')
                }
            }
        })()
    }, [refreshTable])

    const editReseller = (data, action) => {
        setResellerDataById(data)
        setUserAction(action)
        rslrStatusRef.current.value = data.status;
        setTimeout(() => { multiFocus('._editrslr') }, 500);
    }

    const addSubmitReseller = async (data) => {
        try {
            let [res, result] = await fetchApi('addReseller', 'POST', data);
            if (res.status !== 200) {
                toast.error('something went wrong : ' + res.status, { toastId: 1 })
            } else {
                if (result.respCode === 1) {
                    toast.error('Reseller Onboarding Failed', { toastId: 1 })
                } else {
                    reset();
                    toast.success('Reseller Onboarding Successful', { toastId: 0 })
                    addCloseRef.current.click()
                    setRefreshTable(status => !status)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editSubmitReseller = async (data) => {
        let id = resellerDataById.id;
        let status = rslrStatusRef.current.value;
        try {
            let [res, result] = await fetchApi('updateReseller', 'POST', { ...data, id, status });
            // console.log(res)
            // console.log(result)
            if (res.status !== 200) {
                toast.error('something went wrong : ' + res.status, { toastId: 1 })
            } else {
                if (result.respCode === 1) {
                    toast.error('Reseller Editing Failed', { toastId: 1 })
                } else {
                    reset2();
                    toast.success('Reseller Edit Successfully', { toastId: 0 })
                    editCloseRef.current.click()
                    setRefreshTable(status => !status)
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
                    <Navbar title="add reseller" setIsAuth={setIsAuth} />
        
                    <div className="">
                        <button type="button" className="btn text-white d-block ms-auto mb-3 theme-btn" data-bs-toggle="modal" data-bs-target="#addresellermodal"><i className="fa-solid fa-plus"></i> Add</button>
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
                                    <th>Name</th>
                                    <th>Company Name</th>
                                    <th>Mobile No</th>
                                    <th>Email Id</th>
                                    <th>Pan No</th>
                                    <th>Aadhaar No</th>
                                    <th>Status</th>
                                    <th>Password</th>
                                    <th>Creation Date</th>
                                    <th>Modification Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length < 1 ? <tr><td colSpan={16}><h6>{tableDataStatus}</h6></td></tr> :
                                    currentItems.map((item, index) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{startOffset + index + 1}</td>
                                                <td>{item.reUserId}</td>
                                                <td>{item.reName}</td>
                                                <td>{item.reCompanyName}</td>
                                                <td>{item.reMobileNo}</td>
                                                <td>{item.reEmailId}</td>
                                                <td>{item.rePanNo}</td>
                                                <td>{item.reAdharNo}</td>
                                                <td>{item.status}</td>
                                                <td>{item.password}</td>
                                                <td>{item.creationDate}</td>
                                                <td>{item.modificationDate}</td>
                                                <td>
                                                    <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#editresellermodal" onClick={() => editReseller(item, 'edit')}>Edit</button>
                                                    <button type="button" className="btn btn-sm border-0 text-white mx-1" data-bs-toggle="modal" data-bs-target="#editresellermodal" onClick={() => editReseller(item, 'view')}>View</button>
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

        <div className="modal fade" id="addresellermodal" data-bs-backdrop="static">
            <div className="modal-dialog modal-md modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">PLEASE ADD RESELLER DETAILS -</h5>
                    </div>
                    <div className="modal-body">
                        <form className="px-2 rounded mb-3" onSubmit={handleSubmit(addSubmitReseller)} autoComplete="off">
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <Label name="Name" req={true} />
                                    <Input register={register} req={true} name="reName"
                                        errors={errors.reName} regex={alphaNumSpaceRex} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Company Name" req={true} />
                                    <Input register={register} req={true} name="reCompanyName"
                                        errors={errors.reCompanyName} regex={alphaNumSpaceRex} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Mobile No" req={true} />
                                    <Input register={register} req={true} name="reMobileNo"
                                        errors={errors.reMobileNo} regex={''} onInput={typeNumber} minLen={10} maxLen={10} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Email Id" req={true} />
                                    <Input register={register} req={true} name="reEmailId"
                                        errors={errors.reEmailId} regex={emailRex} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Pan No" req={true} />
                                    <Input register={register} req={true} name="rePanNo"
                                        errors={errors.rePanNo} regex={alphaNumericRex} minLen={10} maxLen={10} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Aadhaar No" req={true} />
                                    <Input register={register} req={true} name="reAdharNo"
                                        errors={errors.reAdharNo} regex={''} onInput={typeNumber} minLen={12} maxLen={12} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Status" req={true} />
                                    <SelectInput register={register} req={true} option={["Active", "Deactive"]} name="status" regex={alphaRex} onInput={blankSpace} />
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <button type="button" className="btn btn-danger mx-2" data-bs-dismiss="modal" ref={addCloseRef}>Close</button>
                                <button type="submit" className="btn text-white theme-btn mx-2">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="editresellermodal" data-bs-backdrop="static">
            <div className="modal-dialog modal-md modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">PLEASE {userAction==='edit'?'EDIT':'VIEW'} RESELLER DETAILS -</h5>
                    </div>
                    <div className="modal-body">
                        <form className="px-2 rounded mb-3" onSubmit={handleSubmit2(editSubmitReseller)} autoComplete="off">
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <Label name="Name" req={true} />
                                    <EditInput register={register2} req={true} name="reName" css={'_editrslr'}
                                        defVal={resellerDataById.reName} errors={errors2.reName} regex={alphaNumSpaceRex} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Company Name" req={true} />
                                    <EditInput register={register2} req={true} name="reCompanyName" css={'_editrslr'}
                                        defVal={resellerDataById.reCompanyName} errors={errors2.reCompanyName} regex={alphaNumSpaceRex} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Mobile No" req={true} />
                                    <EditInput register={register2} req={true} name="reMobileNo" css={'_editrslr'} defVal={resellerDataById.reMobileNo}
                                        errors={errors2.reMobileNo} regex={''} onInput={typeNumber} minLen={10} maxLen={10} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Email Id" req={true} />
                                    <EditInput register={register2} req={true} name="reEmailId" css={'_editrslr'}
                                        defVal={resellerDataById.reEmailId} errors={errors2.reEmailId} regex={emailRex} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Pan No" req={true} />
                                    <EditInput register={register2} req={true} name="rePanNo" css={'_editrslr'} defVal={resellerDataById.rePanNo}
                                        errors={errors2.rePanNo} regex={alphaNumericRex} minLen={10} maxLen={10} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Aadhaar No" req={true} />
                                    <EditInput register={register2} req={true} name="reAdharNo" css={'_editrslr'} defVal={resellerDataById.reAdharNo}
                                        errors={errors2.reAdharNo} regex={''} onInput={typeNumber} minLen={12} maxLen={12} action={userAction} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Password" req={true} />
                                    <EditInput register={register2} req={true} name="password" css={'_editrslr'} defVal={resellerDataById.password} 
                                    errors={errors2.password} regex={''} action={userAction} onInput={stopTags} />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Label name="Status" req={true} />
                                    <select className="form-select shadow-none" disabled={userAction === 'view' ? true : false} ref={rslrStatusRef} >
                                        <option value='Active'>Active</option>
                                        <option value='Deactive'>Deactive</option>
                                    </select>
                                    {errors.status && <strong className="text-danger"><small>{errors.status.message}</small></strong>}
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                {userAction === 'view' ?
                                    <button type="button" className="btn btn-danger mx-2" data-bs-dismiss="modal" ref={editCloseRef}>Close</button>
                                    : <>
                                    <button type="button" className="btn btn-danger mx-2" data-bs-dismiss="modal" ref={editCloseRef}>Close</button>
                                    <button type="submit" className="btn text-white theme-btn mx-2">Submit</button> </>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </>)
}

export default AddReseller;