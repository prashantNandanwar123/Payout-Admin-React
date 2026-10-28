import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { alphaNumericRex, passwordRex } from "../assets/js/validationRHF";
import { InputGroup } from "../components/RHF";
import { fetchApi } from "../assets/js/functions";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/images/logo.avif";

const Login = ({ setIsAuth }) => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const loginHandler = async (data) => {
    let { userName, password } = data;
    let [res, result] = await fetchApi('signIn', 'POST', { userName, password })
    if (res.status !== 200) {
      console.log("something went wrong")
    } else {
      if (result.respCode === 1) {
        toast.error(result.respMsg, { toastId: 1 })
      }
      else {
        setIsAuth(true)
        navigate("/dashboard", { replace: true })
        sessionStorage.setItem('userDetails', JSON.stringify(result.respData));
      }
    }

  }

  return (
    <div className="container-fluid" style={{ padding: "0" }}>
      <div
        className="vh-100 d-flex justify-content-start  align-items-center flex-column"
        style={{
          paddingTop: "60px",

        }}
      >
        <div className="logo-container">
          <img
            src={logo}
            alt="logo"
            className="logo"
            style={{ width: "150px" }}
          />
        </div>
        <form
          className="login-form border rounded"
          onSubmit={handleSubmit(loginHandler)}
          style={{
            border: "1px solid #ccc",
            padding: "40px 20px 40px 20px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "375px",
            background: "linear-gradient(45deg, #252874, #595cba)",
          }}

        >
          <h5
            className="login-heading position-relative "
            style={{
              marginBottom: "40px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "white"
            }}
          >
            WELCOME TO PAYOUT ADMIN
          </h5>
          <InputGroup
            register={register}
            type="text"
            req={true}
            id="username"
            name="userName"
            holder="Enter username"
            focus={true}
            maxLen={30}
            errors={errors.userName}
            regex={alphaNumericRex}
            icon={<i className="fa-solid fa-user"></i>}
            style={{ marginBottom: "1rem" }}
          />
          <InputGroup
            register={register}
            type="password"
            req={true}
            id="password"
            name="password"
            holder="Enter password"
            maxLen={30}
            errors={errors.password}
            regex={passwordRex}
            icon={<i className="fa-solid fa-lock"></i>}
            style={{ marginBottom: "1.5rem" }}
          />
          <button
            className="btn text-white w-100"
            style={{
              backgroundColor: "#d3b860", // Matching color from your gradient
              border: "none",
              paddingTop: "0px",
              borderRadius: "5px",
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer
        theme="light"
        pauseOnFocusLoss={false}
        position="top-right"
        className="w-auto custom_toast"
      />
    </div>

  )
}

export default Login;