import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import "../assets/css/dashboard.css";
import { DateInput } from "../components/RHF";
import { fetchApi } from "../assets/js/functions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ToggleSwitch from "../components/ToggleSwitch";

const Dashboard = ({ setIsAuth }) => {
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const [dbData, setdbData] = useState(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  useEffect(() => {
    
    fetchDbData();
  }, []);

  const fetchDbData = async () => {
    let fromDate = fromDateRef.current.value;
    let toDate = toDateRef.current.value;
    try {
      let [res, result] = await fetchApi("dashboard", "POST", {
        fromDate,
        toDate,
      });
      // console.log(res);
      // console.log(result);
      if (res.status !== 200) {
        toast.error("something went wrong : " + res.status, { toastId: 1 });
      } else {
        if (result.respCode === 1) {
          toast.error("something went wrong : " + res.status, { toastId: 1 });
        } else {
          //   reset2();
          setdbData(result.respData);
          //   toast.success("Data fetched Successfully", { toastId: 0 });
          //   console.log("dbData---", dbData);
          // editCloseRef.current.click()
          // setRefreshTable(status => !status)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   const searchDataByDate = (e) => {
  //     if (e) e.preventDefault();
  //     let fromDate = fromDateRef.current.value;
  //     let toDate = toDateRef.current.value;

  //   };

  return (
    <div className="home-page">
      <div className="container-fluid">
        <div className="main-content pt-3">
          <Navbar title={`Welcome ${userDetails.userName}`} setIsAuth={setIsAuth} />
          {/* <h2 className="text-uppercase">Welcome '{userDetails.userName}'</h2> */}

          {/* <form className="mb-3 db-search-form"> */}
          <div className="d-flex mb-4 justify-content-end">
            <div className="mb-2 ms-sm-3">
              <DateInput dateRef={fromDateRef} />
            </div>
            <div className="mb-2 ms-sm-3">
              <DateInput dateRef={toDateRef} />
            </div>
            <div className="mb-2 ms-sm-3">
              <button
                type="submit"
                className="btn btn-sm theme-btn text-white d-block"
                onClick={fetchDbData}
              >
                <i className="bi bi-search"></i> Search
              </button>
            </div>
          </div>
          {/* </form> */}

          <div className="row mb-3">
            <div className="col-md-6 col-lg-4">
              <div className="db-box custom-color-card p-4 text-center mb-4">
                <div className="icon mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h6 className="mb-2 fw-semibold">SUCCESS TRANSACTIONS</h6>

                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "start",
                    paddingLeft: "8px",
                  }}
                >
                  <strong className="fs-3 d-block     text-align-start total-value">
                    Total :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[0] : 0}
                  </strong>
                  <strong className="fs-3 d-block justify-content-start amount-value">
                    Amount :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[1] : 0}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="db-box custom-inprogress-card p-4 text-center mb-4">
                <div className="icon mb-3">
                  <i className="bi bi-cash-coin"></i>
                  {/* <i class="bi bi-arrow-clockwise"></i> */}
                </div>
                <h6 className="mb-2 fw-semibold">INPROGRESS TRANSACTIONS</h6>
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "start",
                    paddingLeft: "8px",
                  }}
                >
                  <strong className="fs-3 d-block     text-align-start total-value">
                    Total :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[2] : 0}
                  </strong>
                  <strong className="fs-3 d-block justify-content-start amount-value">
                    Amount :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[3] : 0}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="db-box custom-Failed-card p-4 text-center mb-4">
                <div className="icon mb-3">
                  <i className="bi bi-x-circle"></i>
                </div>
                <h6 className="mb-2 fw-semibold">FAILED TRANSACTIONS</h6>

                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "start",
                    paddingLeft: "8px",
                  }}
                >
                  <strong className="fs-3 d-block total-value">
                    Total :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[4] : 0}
                  </strong>
                  <strong className="fs-3 d-block amount-value">
                    Amount :{" "}
                    {dbData?.dashboardDetails ? dbData.dashboardDetails[5] : 0}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
