import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import "../assets/css/customCss.css"
import { Input, UserInputContainer } from '../components/RHF'
import { fetchApi } from '../assets/js/functions'
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { alphaNumSpaceRex, typeFloatNumber } from '../assets/js/validationRHF'
import { RxCross2 } from "react-icons/rx";
// import { Modal } from 'bootstrap';


// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'

// import * as bootstrap from 'bootstrap';
// window.bootstrap = bootstrap; 



function Service({ setIsAuth }) {
      const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const[resp,setResp]=useState([])
  const [userdetail,setUserDetail] = useState()
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const [res, result] = await fetchApi('fetchservice', 'GET');
    setResp(result.respData)     
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleAction=async(status,id)=>{
    try {
                let [res, result] = await fetchApi('payoutService', 'POST', { status,id });
                // console.log(res)
                // console.log(result)
                if (res.status !== 200) {
                    toast.error('something went wrong : ' + res.status, { toastId: 1 })
                } else {
                    if (result.respCode === 1) {
                        toast.error('Reseller Editing Failed', { toastId: 1 })
                    } else {
                        toast.success(result.respMsg, { toastId: 0 })
                        fetchData();
                       
                       
                    }
                }
            } catch (error) {
                console.log(error)
            }
  }


const onSubmitSearch = async (data) => {
  try {
    let [res, result] = await fetchApi(`userkey/${data.userId}`, 'GET');
    if (res.status !== 200) {
      toast.error('Something went wrong: ' + res.status, { toastId: 1 });
    } else {
      if (result.respCode === 1) {
        toast.error(result.respMsg, { toastId: 1 });
      } else {
        reset();
        setUserDetail(JSON.parse(result.respData));
        setShowModal(true);
      }
    }
  } catch (error) {
    console.error("Error in onSubmitSearch:", error);
    toast.error("An error occurred", { toastId: 2 });
  }
};



  return (<>
           <div className="home-page">
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="Service Management" setIsAuth={setIsAuth} />
                <div className='tab-container'>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Services</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Key Management</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
    <div className='outer-service-container'>

        <div className='row'>

{/* ------------------first-div------------------ */}
<div className="inner-service-container">


{
  resp.map((item ,index)=>(
    <div className={`first-div d-flex align-items-end ${index ==0 ? "pb-0" : ""}`} key={index} >
    {/* Service Field */}
    <div style={{width:"350px",marginRight: "25px"}}>
     {index==0 && <label className="form-label fw-bold text-secondary" style={{ margin: "1px 5px" }}>
        Service
      </label> }
      <input
        type="text"
        className="form-control shadow-none"
        defaultValue={item.service}
        style={{ background: "#73b5f847" }}
        disabled
      />
    </div>
  
    {/* Status Field */}
    <div className="justify-content-center" style={{marginRight: "25px"}}>
    {index==0 && <label className="form-label fw-bold text-secondary" style={{ margin: "1px 5px" }}>
        Status   
      </label>}
      <input
        type="button"
        className={`form-control shadow-none ${item.status === 'UP' ? 'suc-btn' : 'fail-btn'}`}
        defaultValue={item.status}
        disabled
      />
    </div>
  
  
    <div >
    {index==0 && <label className="form-label fw-bold text-secondary mb-1" >
        Action
      </label>}
      <div className="d-flex gap-2">
      {
      item.status === 'UP' ? <button type="button" className="btn btn-danger" onClick={()=>handleAction('DOWN',item.id)}>Down</button> 
        : 
      <button type="button" className="btn btn-success" onClick={()=>handleAction("UP",item.id)}>Up</button>
      }
      
      </div>
    </div>
  </div>
  ))
}
</div>


        {/* ------------------------------------------------- */}
        </div>
    </div>
  </div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
    <div className="searchBar">
    <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <form class="d-flex" onSubmit={handleSubmit(onSubmitSearch)}>
                <div class="input-group">
                     <Input register={register} req={true} name="userId"
                     regex={''} 
                      maxLen="10"  onInput={typeFloatNumber}
                      holder="Enter userId"
                      />

                    <button class="btn btn-primary px-4" type="submit" >
                            <FaSearch />
                        </button>
                </div>
            </form>
        </div>
    </div>
</div>
    </div>
  </div>
</div>

                </div>
                
            </div>
           </div>




   </div>



{/* <!-- Modal --> */}
                {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
         <div class="modal-dialog" style={{ width: "400px" }}>
            <div class="modal-content" >
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Client Details</h5>
                
                <div class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setShowModal(false)}>
                <RxCross2 />
                

                </div>
              </div>
              <div class="modal-body d-flex flex-column gap-2"  style={{     paddingTop: "5px" ,    paddingBottom: "25px"}}>
              <UserInputContainer label="client Id" data={userdetail?.clientId} />
              <UserInputContainer label="client Secret" data={userdetail?.clientSecret} />
              </div>
            
            </div>
          </div>
        </div>
      )}
  
  </>
   
  )
}

export default Service