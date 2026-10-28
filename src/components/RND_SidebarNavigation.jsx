import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

const SidebarNavigation = () => {

    let activeStyle = {
        backgroundColor: "#295454",
        border: "1px solid"
    };

    return (
        <nav className="payout-nav p-3">
            <ul className="list-group">
                <li className="list-group-item p-0 bg-transparent text-white admin-logo">
                    <div className="nav-link p-3 rounded">
                        <img src={logo} alt="Logo.." width={150} />
                    </div>
                </li>
                <li className="list-group-item p-0 bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/dashboard" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-chart-line"></i><strong className="ms-2">DASHBOARD</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/userapproval" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-person-circle-check"></i><strong className="ms-2">USER APPROVAL</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded" to="/beneficiary" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-hand-holding-dollar"></i><strong className="ms-2">BENEFICIARY</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded " to="/fundtransfer" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-transfer"></i><strong className="ms-2">FUND TRANSFER</strong>
                    </NavLink>
                </li>
                <li className="list-group-item p-0 bg-transparent text-white">
                    <NavLink className="nav-link p-3 rounded " to="/fundtransferstatus" style={({ isActive }) => isActive ? activeStyle : undefined}>
                        <i className="fa-solid fa-money-bill-trend-up"></i><strong className="ms-2">TRANSFER STATUS</strong>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default SidebarNavigation;