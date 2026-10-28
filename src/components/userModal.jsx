import { useRef } from "react"
import { fetchApi } from "../assets/js/functions"
import { toast } from "react-toastify";
import { blankSpace, stopTags, typeNumber } from "../assets/js/validationRHF";

const BSModal = ({action,userData,setUserRefresh}) => {

    const remarkRef = useRef();
    const otpRef = useRef();
    const closeRef = useRef();

    const dataAry=[
        ...(action!=='' ? [{title:'User Id',content:userData.userId}]:[]),
        ...(action!=='' ? [{title:'First Name',content:userData.firstName}] : []),
        ...(action==='onboard' ? [{title:'Last Name',content:userData.lastName}] : []),
        ...(action==='onboard' ? [{title:'Gender',content:userData.gender}] : []),
        ...(action==='onboard' ? [{title:'Email Id',content:userData.emailId}] : []),
        ...(action==='onboard' ? [{title:'Address',content:userData.address}] : []),
        ...(action==='onboard' ? [{title:'State',content:userData.state}] : []),
        ...(action==='onboard' ? [{title:'City',content:userData.city}] : []),
        ...(action==='onboard' ? [{title:'Pincode',content:userData.pincode}] : []),
        ...(action!=='' ? [{title:'Company Name',content:userData.companyName}] : []),
        ...(action==='onboard' ? [{title:'Company Address',content:userData.companyAddress}] : []),
        ...(action!=='' ? [{title:'Merchant Bank Name',content:userData.merchantBankName}] : []),
        ...(action!=='' ? [{title:'Merchant Bank Account Number',content:userData.merchantBankAccountNumber}] : []),
        ...(action!=='' ? [{title:'Ifsc Code',content:userData.merchantBankIfsc}] : []),
    ]
    
    const userApprove = async () => {
        // let closeBtn = document.getElementById('closebtn');
        if(action === 'onboard'){
            let remark = remarkRef.current.value;
            let [res, result] = await fetchApi('usrOnbdg', 'POST', {...userData,remark})
            closeRef.current.click();
            if (res.status !== 200) {
                toast.error(`Something went wrong ( status : ${res.status} )`, { toastId: 1 })
            } else {
                setUserRefresh(status => !status)
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 })
                } else {
                    toast.success(result.respMsg, { toastId: 0 })
                }
            }
        }else if(action === 'token'){
            let [res, result] = await fetchApi('usrTknGen', 'POST', userData)
            closeRef.current.click();
            if (res.status !== 200) {
                toast.error(`Something went wrong ( status : ${res.status} )`, { toastId: 1 })
            } else {
                setUserRefresh(status => !status)
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 })
                } else {
                    toast.success(result.respMsg, { toastId: 0 })
                }
            }
        }else if(action === 'register'){
            let otp = otpRef.current.value;
            if(otp===''){ 
                otpRef.current.focus(); 
                return false;
            }
            let [res, result] = await fetchApi('usrBnkInfReg', 'POST', {...userData,otp})
            closeRef.current.click();
            if (res.status !== 200) {
                toast.error(`Something went wrong ( status : ${res.status} )`, { toastId: 1 })
            } else {
                setUserRefresh(status => !status)
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 })
                } else {
                    toast.success(result.respMsg, { toastId: 0 })
                }
            }
        }
    }

    const userReject = async () => {
        let [res, result] = await fetchApi('usrRjt', 'POST', {...userData,action})
        if (res.status !== 200) {
            toast.error(`Something went wrong ( status : ${res.status} )`, { toastId: 1 })
        } else {
            setUserRefresh(status => !status)
            toast.success(result.respMsg, { toastId: 0 })
        }
    }

    return (
        <div className="modal fade viewmodal" id="payModal" data-bs-backdrop="static">
            <div className="modal-dialog modal-sm modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Please Re-Check Details :</h5>
                    </div>
                    <div className="modal-body">
                        {dataAry.map((item,index)=>{
                            return (
                                <div key={index} className="border p-2 mb-2">
                                    <h6 className="mb-0">{item.title}</h6>
                                    <span>{item.content}</span>
                                </div>
                            )
                        })}
                        {action === 'onboard' &&  
                            <div className="border p-2 mb-2">
                                <h6>Remark</h6>
                                <textarea className="form-control shadow-none" ref={remarkRef} onInput={(e)=>{blankSpace(e);stopTags(e)}}></textarea>
                            </div>
                        }
                        {action === 'register' &&  
                            <div className="border p-2 mb-2">
                                <h6>OTP <span className="text-danger fw-bold"> *</span></h6>
                                <input type="text" className="form-control shadow-none" ref={otpRef} onInput={typeNumber} />
                            </div>
                        }
                    </div>
                    <div className="modal-footer flex-nowrap">
                        <button type="button" className="btn btn-success mx-1 w-100" onClick={userApprove}>Approve</button>
                        <button type="button" className="btn btn-danger mx-1 w-100" data-bs-dismiss="modal" onClick={userReject}>Reject</button>
                        <button type="button" className="btn btn-secondary mx-1 w-100" data-bs-dismiss="modal" ref={closeRef}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BSModal;