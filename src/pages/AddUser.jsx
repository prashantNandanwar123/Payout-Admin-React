import { Navbar } from "../components/Navbar";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { addrRex, alphaNumRex, alphaRex, alphaSpaceRex, blankSpace, stopTags, emailRex, fetchApi, fetchFileApi, fetchIfscApi, typeIfsc, typeNumber, upperCaseCvt } from "../assets/js/validationRHF";
import { Label, Input, FileInput, RadioInput, SelectInput, InputPsd } from "../components/RHF"
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.avif';


const AddUser = ({ setIsAuth }) => {

    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [isNext, setIsNext] = useState(false);
    const [otpReset, setOtpReset] = useState(false);
    const [moreFields, setMoreFields] = useState(false);
    const [userIdField, setUserIdField] = useState(false);
    const [ifscState, setIfscState] = useState(false);


    const signupSubmit = async (data) => { 

        // console.log(data)

        let {mobileNo,emailId,firstName,lastName,address,companyName,companyAddress,panNo,
            adharNo,panDocument,adharDocument,city,gender,merchantBankAccountNumber,
            merchantBankIfsc,merchantBankName,pincode,state,password} = data;
        let formData = new FormData();
        if(!moreFields){
            if (!isNext) {
                commonOtpSendFunc();
            }else {
                let [res,result] = await fetchApi('OtpVerificationForSignup','POST', data)
                if(res.status !== 200){
                    toast.error(res.statusText, {toastId:1})
                }else{
                    if(result.respCode === 1){
                        toast.error(result.respMsg, {toastId:1})
                    }else{
                        // toast.success(result.respMsg, {toastId:0})
                        setIsNext(false)
                        setMoreFields(true)
                        setUserIdField(true)
                    }
                }
            }
        }else{
            formData.append("mobileNo", mobileNo)
            formData.append("firstName", firstName)
            formData.append("lastName", lastName)
            formData.append("address", address)
            formData.append("companyName", companyName)
            formData.append("companyAddress", companyAddress)
            formData.append("panNo", panNo)
            formData.append("adharNo", adharNo)
            formData.append("emailId", emailId)
            formData.append("city", city)
            formData.append("gender", gender)
            formData.append("merchantBankAccountNumber", merchantBankAccountNumber)
            formData.append("merchantBankIfsc", merchantBankIfsc)
            formData.append("merchantBankName", merchantBankName)
            formData.append("pincode", pincode)
            formData.append("state", state)
            formData.append("document", panDocument[0])
            formData.append("document", adharDocument[0])
            formData.append("password", password)
            
            if (!ifscState) return false;

            let [res,result] = await fetchFileApi('PayoutSubmitSignUp', formData)
            if(res.status !== 200){
                toast.error('Something went wrong', {toastId:1})
            }else{
                if(result.respCode === 1){
                    toast.error(result.respMsg, {toastId:1})
                }else{
                    toast.success(result.respMsg, {toastId:0})
                    reset();
                    setIsNext(false)
                        setMoreFields(false)
                        setUserIdField(false)
                    //console.log('successfully submited !!')
                }
            }
        }
    }
    
    const validateIFSC = async (e) => {
        if (e.target.value.length === 11) {
            let bankName = document.getElementById('meBankName').value;
            let ifscErr = document.querySelector('#' + e.target.id + '+strong');
            let [res,result] = await fetchIfscApi(e.target.value)
            if(result === 'Not Found'){
                ifscErr.textContent = "Not Found"
                setIfscState(false)
            }else{
                if(result.BANK!==bankName){
                    ifscErr.textContent = "Not match with their bank"
                    setIfscState(false)
                }else{
                    setIfscState(true)
                }
            }
        }
    }

    const validateBank = () => {
        let ifscElem = document.getElementById('mebankifsc');
        ifscElem.parentElement.querySelector('.inpErr').textContent = "";
        ifscElem.value = "";
        ifscElem.focus();
    }

    const commonOtpSendFunc = async () => {
        let mobileNo = document.getElementById('mobileno').value;
        let emailId = document.getElementById('emailid').value;
        let [res,result] = await fetchApi('PayoutSignUp','POST', {mobileNo,emailId})
        if(res.status !== 200){
            toast.error(res.statusText, {toastId:1})
        }else{
            if(result.respCode === 1){
                toast.error(result.respMsg, {toastId:1})
            }else{
                // toast.success(result.respMsg, {toastId:0})
                setIsNext(true)
                setUserIdField(true)
                setOtpReset(!otpReset)
            }
        }
    }

 
    return (<>
        <div className="beneficiary-page">
            {/* <SidebarNavigation /> */}
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="REGISTRATION TO PAYOUT" setIsAuth={setIsAuth} />
               
              <form className="registerform border p-2 shadow rounded bg-white" style={!moreFields ? { height: 'auto' ,} : {  height: 'auto' }}
            onSubmit={handleSubmit(signupSubmit)} autoComplete="off">
            
            <div className="row" style={{placeContent: "center"}}>
                
                <div className="col-4 mb-2">
                    <Label for="mobileno" name={!isNext?'Enter your mobile no ?':'Your mobile no is :'} req={true} />
                    <Input css={userIdField?'cursor-not-allow':''} register={register} req={true} id="mobileno" name="mobileNo" errors={errors.mobileNo} 
                    focus={true} regex={''} read={userIdField?'readonly':''} minLen={10} maxLen={10} onInput={typeNumber} />
                </div>
                <div className="col-4 mb-2">
                    <Label for="emailid" name="Email Address" req={true} />
                    <Input register={register} id="emailid" name="emailId" css={userIdField?'cursor-not-allow':''} 
                    read={userIdField?'readonly':''} req={true} errors={errors.emailId} regex={emailRex} />
                    {/* {isNext ? <small role="button" className="text-secondary entrymodelink float-end" onClick={commonOtpSendFunc}>Resend</small> : ''} */}
                </div>

                {isNext ?
                    <div className="col-4 mb-2">
                        <Label for="otp" name="Create password" req={true} />
                        <InputPsd register={register} req={true} id="otp" name="password" minLen={6} maxLen={10} errors={errors.otp} regex={''} onInput={(e)=>{stopTags(e);blankSpace(e)}} />
                    </div>
                : ''}

                {moreFields ?
                    <>
                        <div className="col-lg-4 mb-2">
                            <Label for="firstname" name="First Name" req={true} />
                            <Input register={register} req={true} id="firstname" name="firstName" 
                            errors={errors.firstName} focus={true} regex={alphaRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="lastname" name="Last Name" req={true} />
                            <Input register={register} req={true} id="lastname" name="lastName" 
                            errors={errors.lastName} regex={alphaRex} onInput={blankSpace} />
                        </div>
                       
                        <div className="col-lg-4 mb-2">
                            <Label for="city" name="City" req={true} />
                            <Input register={register} req={true} id="city" name="city" 
                            errors={errors.city} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                          <div className="col-lg-4 mb-2">
                            <Label for="zipcode" name="Pincode" req={true} />
                            <Input register={register} req={true} id="zipcode" name="pincode" 
                            errors={errors.pincode} regex={''} onInput={typeNumber} minLen={6} maxLen={6} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="state" name="State" req={true} />
                            <Input register={register} req={true} id="state" name="state" 
                            errors={errors.state} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                         <div className="col-4 mb-2">
                            <Label for="address" name="Address" req={true} />
                            <Input register={register} req={true} id="address" name="address" 
                            errors={errors.address} regex={addrRex} onInput={blankSpace} />
                        </div>

                      
                        <div className="col-lg-4 mb-2">
                            <Label for="meBankAccNo" name="Merchant Bank Account" req={true} />
                            <Input register={register} req={true} id="meBankAccNo" name="merchantBankAccountNumber" 
                            errors={errors.merchantBankAccountNumber} regex={''} onInput={typeNumber} minLen={8} maxLen={17} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="meBankName" name="Merchant Bank Name" req={true} />
                            <SelectInput register={register} option={["ICICI Bank","RBL Bank","Yes Bank","Axis Bank","HDFC Bank","PNB Bank","Bandhan Bank","AU Small Finance Bank","IDBI","Indusind Bank","Punjab & Sind Bank","Bank of Baroda","Bank of India","Canara Bank","IDFC FIRST Bank","Central Bank of India","State Bank of India","Union Bank of India","Kotak Mahindra Bank"]}
                            req={true} id="meBankName" name="merchantBankName" regex={''} onInput={validateBank} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="mebankifsc" name="Merchant Bank Ifsc" req={true} />
                            <Input register={register} req={true} id="mebankifsc" name="merchantBankIfsc" errors={errors.merchantBankIfsc} regex={''}
                            minLen={11} maxLen={11} onInput={(e) => { typeIfsc(e); validateIFSC(e) }} />
                        </div>
                        <div className="col-4 mb-2">
                            <Label for="coname" name="Company Name" req={true} />
                            <Input register={register} req={true} id="coname" name="companyName" errors={errors.companyName} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                        <div className="col-4 mb-2">
                            <Label for="coaddr" name="Company Address" req={true} />
                            <Input register={register} req={true} id="coaddr" name="companyAddress" errors={errors.companyAddress} regex={addrRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="panno" name="Pan Card No." req={true} />
                            <Input register={register} req={true} id="panno" name="panNo" errors={errors.panNo} regex={alphaNumRex} minLen={10} maxLen={10} onInput={upperCaseCvt} />
                        </div>
                        <div className="col-lg-4 mb-2">
                            <Label for="adharno" name="Aadhar Card No." req={true} />
                            <Input register={register} req={true} id="adharno" name="adharNo" errors={errors.adharNo} regex={''} onInput={typeNumber} minLen={12} maxLen={12} />
                        </div>
                        {/* <div className="col-12 mb-2">
                            <Label for="emailid" name="Email Address" req={true} />
                            <Input register={register} req={true} id="emailid" name="emailId" errors={errors.emailId} regex={emailRex} />
                        </div> */}
                        <div className="col-2 mb-2">
                            <Label name="Gender" req={true} />
                            <div>
                                <RadioInput register={register} radioName="Male" val="Male" name="gender" id="male" checked={true} />
                                <RadioInput register={register} radioName="Female" val="Female" name="gender" id="female" checked={false} />
                            </div>
                        </div>
                        <div className="col-3 mb-2">
                            <Label for="adhardoc" name="Upload Pan Card" req={true} />
                            <FileInput register={register} req={true} id="adhardoc" name="adharDocument" errors={errors.adharDocument} />
                        </div>
                        <div className="col-3 mb-2">
                            <Label for="pandoc" name="Upload Aadhar Card" req={true} />
                            <FileInput register={register} req={true} id="pandoc" name="panDocument" errors={errors.panDocument} />
                        </div>
                    </>
                    : ''}

                <div className="col-4 text-center mt-3       align-self-center  justify-content-center">
                    {moreFields ? <button type="submit" className="btn text-white themebg2 w-100" style={{background:"#003980"}}>REGISTRATION</button>
                        :
                        <button type="submit" className="btn text-white themebg2 w-100" style={{background:"#003980"}}>{!isNext ? 'Next' : 'Next'}</button>}
                </div>
               
            </div>
        </form>
         </div>
            </div>
        </div>


    </>)
}

export default AddUser;