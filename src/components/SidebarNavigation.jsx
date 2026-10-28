import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.avif";

const SidebarNavigation = () => {

    let activeStyle = {
        backgroundColor: "rgb(35 62 108)",
        border: "1.5px solid white"
    };

    return (
        <nav className="payout-nav p-1">
            <div className="nav-link pt-0 rounded" style={{ textAlign: "center", marginTop: "12px" }}>
                <img className="bg-white rounded" src={logo} alt="Logo.." width="90%" />
            </div>
            <ul className="list-group new-list-group" style={{ maxHeight: "91vh",overflowY: "scroll",scrollbarWidth: "none",msOverflowStyle: "none",}}>

                {/* <li className="list-group-item p-0 bg-transparent text-white admin-logo">
                    
                </li> */}
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/dashboard" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-chart-line"></i><strong className="ms-2">DASHBOARD</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/userapproval" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-person-circle-check"></i><strong className="ms-2">USER APPROVAL</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/services" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i class="fa-solid fa-bars-progress"></i><strong className="ms-2">SERVICE</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/adduser" style={({ isActive }) => isActive ? activeStyle : undefined}>
                       <i class="fa-solid fa-user-tie"></i><strong className="ms-2">ADD MERCHANT</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/addreseller" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-user-plus"></i><strong className="ms-2">ADD RESELLER</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/wallet" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-wallet"></i><strong className="ms-2">WALLET</strong>
                    </NavLink>
                </li>
                {/* <li className="list-group-item p-0 rounded bg-transparent text-white border-0">
                    <NavLink className="nav-link p-3 d-flex align-items-center" data-bs-toggle="collapse" to="#collapseRev">
                        <i className="fa-solid fa-right-left"></i>
                        <strong className="ms-2">SERVICE MANAGEMENT</strong>
                        <span className="ms-2">&#8595;</span>
                    </NavLink>
                    <div className="collapse ms-3" id="collapseRev">
                        <NavLink className="nav-link p-2 rounded" to="/service" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">SERVICE</strong>
                        </NavLink>
                        <NavLink className="nav-link p-2 rounded" to="/management" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">MANAGEMENT</strong>
                        </NavLink>
                    </div>
                </li> */}


                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/managefund" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-sack-dollar"></i><strong className="ms-2">MANAGE FUND</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white border-0">
                    <NavLink className="nav-link p-3 d-flex align-items-center" data-bs-toggle="collapse" to="#collapseRev">
                        <i className="fa-solid fa-right-left"></i>
                        <strong className="ms-2">M-REVERSAL</strong>
                        <span className="ms-2">&#8595;</span>
                    </NavLink>
                    <div className="collapse ms-3" id="collapseRev">
                        <NavLink className="nav-link p-2 rounded" to="/manualreversal" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">UPLOAD FILE</strong>
                        </NavLink>
                        <NavLink className="nav-link p-2 rounded" to="/reversalreport" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">REV REPORT</strong>
                        </NavLink>
                    </div>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 d-flex align-items-center" data-bs-toggle="collapse" to="#collapseBeneficiary">
                        <i className="fa-solid fa-hand-holding-dollar"></i>
                        <strong className="ms-2">BENEFICIARY</strong>
                        <span className="ms-2">&#8595;</span>
                    </NavLink>
                    <div className="collapse ms-3" id="collapseBeneficiary">
                        <NavLink className="nav-link p-2 rounded" to="/beneficiary" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">PENDING</strong>
                        </NavLink>
                        <NavLink className="nav-link p-2 rounded" to="/approvedbeneficiary" style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <span>&#8594;</span><strong className="ms-2">APPROVED</strong>
                        </NavLink>
                    </div>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/fundtransfer" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-transfer"></i><strong className="ms-2">FUND TRANSFER</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/fundtransferstatus" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-trend-up"></i><strong className="ms-2">TRANSFER STATUS</strong>
                    </NavLink>
                </li>
                
                <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/oldfundtransferstatus" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-trend-up"></i><strong className="ms-2">OLD REPORT</strong>
                    </NavLink>
                </li>
                {/* <li className="list-group-item p-0 rounded bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/messagingservice" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-trend-up"></i><strong className="ms-2">MESSAGE SERVICE</strong>
                    </NavLink>
                </li> */}
            </ul>
        </nav>
    )
}

export default SidebarNavigation;