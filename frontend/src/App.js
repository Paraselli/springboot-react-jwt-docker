import React,{useState} from "react";
import api from "./services/apiClient";

function App(){
 const [token,setToken]=useState("");
 const login=async()=>{
  const res=await api.post("/api/login",{username:"admin",password:"admin"});
  localStorage.setItem("token",res.data);
  setToken(res.data);
 };
 return(<div><h2>JWT App</h2>
 <button onClick={login}>Login</button>
 <p>{token}</p></div>);
}
export default App;