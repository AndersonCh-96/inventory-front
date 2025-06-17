import { useEffect } from "react";
import useProfile from "../hooks/UserHook";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../slices/auth/thunk";

//Pendiente token para autorizacion 
const AuthProtected = (props:any) =>{
    const dispatch:any = useDispatch()
     const {userProfile}= useProfile()

    useEffect (()=>{
        if (userProfile) {
            
        }else{
            dispatch(logOutUser())
        }
    },[])

     if (!userProfile) {
         return (
           <Navigate to={{ pathname: "/auth/signin"}} />
         );
       }

    return <> {props.children}</>

}

export default AuthProtected;