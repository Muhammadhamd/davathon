import React, { useEffect, useState , useContext} from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./home.jsx";
import Navcomponent from "./component/navbar.jsx";
import axios from "axios";
import {GlobalContext} from  './context/context'
import UserLogin from "./component/login";
import UserRegister from "./component/register";
import Doctors from "./component/project.jsx";
import Profile from "./component/profile.jsx";
import DrProfile from "./component/drProfile.jsx";
function App() {
  const { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }, []);

  
  const loginHandler = async()=>{
    try {
      const res = await axios.get("http://localhost:2344/getToken",
      {withCredentials: true,
      })
      console.log(res)
      dispatch({
        type: "USER_LOGIN",
        payload: res.data,
      });

    } catch (error) {
      console.log(error)
      dispatch({
        type: "USER_LOGOUT"
      })
    }
  }
  useEffect(()=>{
   loginHandler()
  },[])
 console.log(state.role)
  // Other code...
  return (
    <div>
      {/* Render your components with the theme and login props */}
      {state.isLogin === true && state.role === "Doctor" ? (
        <>
          <Routes>
            <Route exact path="/" element={<Home islogin={state.role} name={state.user.name} img={state.user.img} />} />
            <Route exact path="/profile" element={<Profile data={state.user} />} />
            <Route exact path="/Doctors" element={<Doctors  />} />
            <Route exact path="/doctor/:id" element={<DrProfile  />} />

            {/* <Route exact path="/article/:postId" element={<PostPage theme={state.darkTheme} />} />
            <Route exact path="/article" element={<ArticlesPage theme={state.darkTheme} />} /> */}
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}
      
      {state.isLogin === true && state.role === "Patient" ? (
        <>
          <Routes>
            <Route exact path="/" element={<Home islogin={state.role} />} />
            <Route exact path="/Doctors" element={<Doctors  />} />
            <Route exact path="/doctor/:id" element={<DrProfile  />} />

            
            <Route path="*" element={<Navigate to="/" replace={true} />} />

          </Routes>
        </>
      ):null}
      {state.isLogin === false?(
        <>

        <Routes>
          <Route exact path="/" element={<Home theme={state.darkTheme}  />} />
          <Route exact path="/Login" element={<UserLogin theme={state.darkTheme} />} />
          <Route exact path="/register" element={<UserRegister theme={state.darkTheme} />} />
          <Route exact path="/Doctors" element={<Doctors  />} />
          <Route exact path="/doctor/:id" element={<DrProfile  />} />


          {/* <Route exact path="/article/:postId" element={<PostPage theme={state.darkTheme} />} />
          
          <Route exact path="/article" element={<ArticlesPage theme={state.darkTheme} />} /> */}
          <Route path="*" element={<Navigate to="/" replace={true} />} />
          
        </Routes>
      </>
      ):null
    
    }
    </div>
  );
}

export default App;
