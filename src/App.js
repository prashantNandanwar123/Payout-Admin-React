import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Beneficiary from "./pages/Beneficiary";
import ApprovedBeneficiary from "./pages/ApprovedBeneficiary";
import Dashboard from "./pages/Dashboard";
import AddFund from "./pages/AddFund";
import FundTransfer from "./pages/FundTransfer";
import Login from "./pages/Login";
import NotFound from "./pages/404";
import UserApproval from "./pages/UserApproval";
import FundTransferStatus from "./pages/FundTransferStatus";
import SidebarNavigation from "./components/SidebarNavigation";
import Wallet from "./pages/Wallet";
import ManualReversal from './pages/ManualReversal';
import ManualReversalReport from './pages/ManualReversalReport';
import AddReseller from "./pages/AddReseller";
import Service from "./pages/Service";
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddUser from "./pages/AddUser";
import OldFundTransferStatus from "./pages/oldFundTransferStatus";

const App = () => {

  const [isAuth, setIsAuth] = useState(null)

  return (
    <BrowserRouter>
      <div className='payout-admin'>
        {isAuth ? <SidebarNavigation /> : ''}
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/dashboard" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <Dashboard setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <AddFund setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/userapproval" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <UserApproval setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/beneficiary" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <Beneficiary setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/approvedbeneficiary" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <ApprovedBeneficiary setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/fundtransfer" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <FundTransfer setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/fundtransferstatus" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <FundTransferStatus setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/oldfundtransferstatus" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <OldFundTransferStatus setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/managefund" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <Wallet setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/manualreversal" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <ManualReversal setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <Service setIsAuth={setIsAuth} /> </ProtectedRoute>} />

          <Route path="/reversalreport" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <ManualReversalReport setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/addreseller" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <AddReseller setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/adduser" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} >
            <AddUser setIsAuth={setIsAuth} /> </ProtectedRoute>} />
          <Route path="/PayoutAdmin" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;