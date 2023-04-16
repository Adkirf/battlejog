import { useSignIn } from "react-auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import SquaredMenu from "./SquaredMenu";


function Login() {
    const [credentials, setCredentials] = useState({username: "", password: "", repeat_password: ""})
    const [isLogin, setIsLogin] = useState(true)
  
    const signIn = useSignIn();
    const navigate = useNavigate();

    const handleMenuClick = (label: String)=>{
      if(label === "Home"){
        navigate("/");
      }
    }

    const handleChange = (target:any) => {
      const newCredentials = JSON.parse(JSON.stringify(credentials))
  
      if(target.name==="username"){
        newCredentials.username=target.value;
      }
      if(target.name==="password"){
        newCredentials.password=target.value
      }
      if(target.name==="repeat_password"){
        newCredentials.repeat_password=target.value
      }
      setCredentials(newCredentials)
    }
  
    const handleSignin = async()=>{
      if(credentials.password===credentials.repeat_password){
        const {username, password} = credentials;
        try{
          const res = await fetch("http://localhost:3000/api/signin",{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify({username, password})
            })
           if(res.status===300){
            console.log("user already exisits");
           }else{

            const {user, jwtToken} = await res.json();

             if(signIn({
              token:jwtToken,
              expiresIn: 3600,
              tokenType: "Bearer",
              authState: user
              })){
                  navigate("/")
              }
           }
        }catch(err){
         console.log(err)
        }
      }else{
        console.log("both passwords must be the same")
      }  
    }
  
    const handleLogin = async () => {
      const {username, password} = credentials;
    
      try{
        const res = await fetch("http://localhost:3000/api/login",{
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({username, password})
        })
        if(res.status===300){
          console.log("username or password incorrect");
        }
        const {user, jwtToken} = await res.json();
        if(res.status===200){
          if(signIn({
              token: jwtToken,
              expiresIn: 3600,
              tokenType: "Bearer",
              authState: user
          })){
             navigate("/")
          }
        }
      }catch(err){
        console.log(err)
      }
    }
  
    const getLogin = ()=>{
      return (
        
        <div className="login">
        <h1 className="textCenter">Welcome Back!</h1>
        <div className="inputContainer">
          <input
            name="username"
            value={credentials.username}
            onChange={(e) => handleChange(e.target)}
            placeholder="username"
            type="username"
          />
        </div>
        <div className="inputContainer">
          <input
            name="password"
            value={credentials.password}
            onChange={(e) => handleChange(e.target)}
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="loginControlls">
              <button className="loginButton" onClick={handleLogin} >
                  Login
              </button>  
              <button className="loginSwitch" onClick={()=>setIsLogin(false)}>
                New here?
              </button>
        </div>
      </div>
      );
    }
  
    const getSignin = ()=>{
        return (
            <div className="login">
            <h1 className="textCenter">Join us!</h1>
            <div className="inputContainer">
              <input
              className="w-full mb-2 h-10 rounded bg-slate-800"
                name="username"
                value={credentials.username}
                onChange={(e) => handleChange(e.target)}
                placeholder="username"
                type="username"
              />
            </div>
            <div className="inputContainer">
              <input
              className="w-full mb-2 h-10 rounded bg-slate-800"
                name="password"
                value={credentials.password}
                onChange={(e) => handleChange(e.target)}
                placeholder="Password"
                type="password"
              />
            </div>
            <div className="inputContainer">
              <input
              className="w-full mb-2 h-10 rounded bg-slate-800"
                name="repeat_password"
                value={credentials.repeat_password}
                onChange={(e) => handleChange(e.target)}
                placeholder="Repeat Password"
                type="password"
              />
            </div>
            <div className="loginControlls">
                  <button className="loginButton" onClick={handleSignin}>
                      Sign in
                  </button>  
               
                  <button className="loginSwitch" onClick={()=>setIsLogin(true)}>
                        Already member?
                  </button>
            </div>
          </div>
          );
    }

    const centerTile = ()=>{
      if(isLogin){
        return (
          <div className="containerBorder login"> 
            {getLogin()}
          </div>
        )
      }else{
        return(
          <div className="containerBorder login"> 
            {getSignin()}
          </div>
        )
      }
    }

  return (
    <div className="container">
      {SquaredMenu(["Home"],centerTile(),1,handleMenuClick)}
    </div>
  );
}

export default Login