import React, { useState, useRef, useEffect } from 'react';
import app from '../firebaseConfig.mjs'
import {  getStorage, ref, uploadBytes , getDownloadURL  } from "firebase/storage";
import axios from 'axios';
import DoctorCard from './post';
import SubmitBtn from './submitbtn';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingComponent from './Loading';
import Navcomponent from './navbar';

function Doctors(){
const [searchInput , setSearchInput] = useState("")
const [isloading , setisloading] = useState(false)
const [islogin , setislogin] = useState(false)
const [products , setProducts]= useState([])
const [userdata , setuserdata] = useState([])
const [found404 , setfound404]= useState(false)
const navigate = useNavigate();
const location = useLocation();
const womentag = useRef([]);
const mentag = useRef([]);

const [dataarray , setdataarray] = useState([])
const [rerender , setrerender] = useState(false)
const childrentag = useRef([]);
const SearchHandler = (e) => {
  e.preventDefault();
  
  setisloading(true)

  const encodedSearchInput = encodeURIComponent(searchInput);
  navigate(`/Doctors?s=${encodedSearchInput}`);
  axios.get(`/doctors?s=${searchInput}`)
    .then((res) => {
      setProducts(res.data);
      console.log(res.data)
  setfound404(false)

      // Update the URL without triggering a full page reload
    })
    .catch((e) =>{ console.log(e)
    setfound404(e.message)
    console.log(found404)
    })
    .finally(()=>{
  setisloading(false)

    })
}
const doctordata = async()=>{


  try {
  const res = await  axios.get("http://localhost:2344/doctors")
  setdataarray(res.data)
  setrerender(true)
  console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
  
useEffect(()=>{
  doctordata()
}, [rerender])
  
const searchQuery = new URLSearchParams(location.search).get('s');

useEffect(()=>{
  console.log(searchQuery, "amd searced bi" ,searchInput)
  setSearchInput(searchQuery || '')
  
  setisloading(true)
axios.get(`/doctors?s=${searchQuery || ""}`)
.then((res)=>{
  console.log(res.data)
  setProducts(res.data)
  console.log(products)
  setfound404(false)
})
.catch((e)=>{console.log(e)
  setfound404(e.messege)
})
.finally(()=>{
  setisloading(false)

})
},[])


// useEffect(()=>{
//   const mentags = products.filter((product)=>product.tag === 'Men').map((product)=>product.tag)
//   const womentags = products.filter((product)=>product.tag === 'Women').map((product)=>product.tag)
//   const childrentags = products.filter((product)=>product.tag === 'children').map((product)=>product.tag)


//   mentag.current = mentags
//   womentag.current = womentags
//   childrentag.current = childrentags
// },[SearchHandler])


    return(

     <>
     

      <div className='bg-[#f5f7f9] flex flex-col items-center'>

        
       <div className='my-[40px] w-full flex justify-center'>
       <form onSubmit={SearchHandler} className='bg-[#FFFFFF] max-w-[500px] w-full p-[10px] rounded-[20px]'>
          <button><i className='fa fa-search'></i></button>
          <input 
        onChange={(e)=>{
  setSearchInput(e.target.value)
        }}
        type="text" value={searchInput}  className='bg-transparent px-[10px] py-[6px] w-[90%] outline-none' placeholder='Search Doctor...' />
        </form>
       </div>
         
         <div className='flex flex-col gap-[20px] w-full items-center'>

          {
           isloading? (<LoadingComponent isLoading={false} />)         
          :
          
            dataarray?.map((each)=>[
              <DoctorCard key={each.id} drName={each.name} id={each._id} dremail={each.email} drimg={each.img} spealist={each.spesilist} location={each.location}/>
        
            ])
          
          
          }
  
         </div>
      </div>
     </>
  
    )
}

export default Doctors