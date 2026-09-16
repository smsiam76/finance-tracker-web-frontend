import { useContext } from "react";
import AuthContext from "../provider/AuthContext";


const useAuth = () => {
    

    return useContext(AuthContext);
};

export default useAuth;