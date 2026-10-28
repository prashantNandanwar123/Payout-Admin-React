import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuth, setIsAuth, children }) => {

    // const navigate = useNavigate();

    useEffect(() => {
        //setIsAuth(auth => console.log(auth))
        if (isAuth) {
            //console.log()
            let timeout = setTimeout(() => {
                alert("Timeout...")
                //navigate("/PayoutAdmin", { replace: true })
                setIsAuth(false)
                sessionStorage.clear();
            }, 3600000) // 1 hour (3600000)
            return () => clearTimeout(timeout)
        }
    }, [])

    if (!isAuth) {
        return <Navigate to="/PayoutAdmin" />;
    } else {
        return children;
    }
};

export default ProtectedRoute;