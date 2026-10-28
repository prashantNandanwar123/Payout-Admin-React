import { ToastContainer } from "react-toastify"

export const Navbar = ({ title, setIsAuth }) => {
  return (<>
    <nav className="page-heading border px-3 py-2 mb-3 text-white">
      <div className="row">
        <div className="col-md-7 d-flex align-items-center">
          <h6 className="mb-0 text-uppercase"><strong>{title}</strong></h6>
        </div>
        <div className="col-md-5">
          <ul className="navbar-nav">
            {/* <li className="ps-md-3">
              <i className="fa-solid fa-indian-rupee-sign ms-1"></i>
              <strong className="ms-1">5000</strong>
              <i className="fa-solid fa-arrow-rotate-right ms-1" role="button"></i>
            </li> */}
            <li className="ps-md-3 dropdown">
              <button className="nav-link dropdown-toggle p-0 bg-transparent border-0" data-bs-toggle="dropdown">
                <i className="fa-solid fa-circle-user"></i>
              </button>
              <ul className="dropdown-menu">
                {/* <li><Link className="dropdown-item logout" to="/PayoutAdmin" >Logout</Link></li> */}
                <li><button className="dropdown-item logout" onClick={() => setIsAuth(false)} >Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </nav>

    <ToastContainer theme="light" pauseOnFocusLoss={false} position="top-right" className="w-auto custom_toast" />

  </>)
}
