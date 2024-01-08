import react, { useEffect, useRef, useState , useContext} from 'react'
import Navcomponent from './navbar'
import axios from 'axios'
import { useNavigate , Link } from 'react-router-dom';
import {GlobalContext} from "../context/context.jsx"

function UserLogin(){
  const { state , dispatch} = useContext(GlobalContext)

  const history = useNavigate()
    
 
    const passwordref = useRef(null)
    const emailref = useRef(null)

    const submitHandler = async(e)=>{
        e.preventDefault();
        console.log('eee')
        try {
          const response = await axios.post(
            'http://localhost:2344/userlogin',
            {
              email: emailref.current.value,
              password: passwordref.current.value,
            },
            {
              withCredentials: true, // Use withCredentials instead of withCredential
            }
          )
          .then((res)=>{
            console.log(res)
           
            dispatch({
              type: "USER_LOGIN",
              payload: res?.data?.data,
            });
            history("/Profile")

          })
          .catch((e)=>{
            console.log(e)
          })
    
          // Handle response as needed
          console.log(response);
        } catch (error) {
          // Handle errors
          console.error(error);
        }
      };
    
     
    return(
        <>
        
          
        <div className='flex flex-col items-center '>
            <h1 className='font-semibold text-4xl my-[20px]'>Login</h1>
            <form onSubmit={submitHandler} className='max-w-[600px] w-full p-[20px]'>
                <input type="email" className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none' placeholder='Enter your Email'
                ref={emailref}
                
                />
                <input type="password" className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none' placeholder='Enter your Password'
                ref={passwordref}
                />
                <div className='flex gap-[5px] w-full items-center my-[30px]'>
                  <div className='bg-[#C8E3FF] h-[2px] w-full'></div>
                  <h1><Link to='/register'>or</Link> </h1>
                  <div className='bg-[#C8E3FF] h-[2px] w-full'></div>

                </div>
                <div className='flex justify-center'>
                <input type="submit" value="login" className='bg-violet-500 rounded shadow px-5 py-3 text-white font-semibold' />
                </div>
            </form>
        </div>

        </>
    )
}
export default UserLogin