import React, { useState, useRef, useEffect } from 'react';
import style from './App.css'
import { useParams , Link } from 'react-router-dom';

import axios, { toFormData } from 'axios';
import Navcomponent from './component/navbar';
import DoctorCard from './component/post';
import icon from "./img/icon.png"

function Home({theme , islogin ,name , img}) {



  const [dataarray , setdataarray] = useState([])
  const [rerender , setrerender] = useState(false)

  
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

     theme = false
  
useEffect(()=>{
  doctordata()
}, [rerender])
  

  const data ={
  name,
  islogin,
  img
 }
  return ( 
  <div className='flex flex-col   pb-[100px] max-[700px]:gap-[70px]  max-[650px]:gap-[40px] max-[500px]:gap-[30px]  bg-white'>
  
  <div className='bg-[#B28CFF] rounded-[0px_0px_35.33px_35.33px] w-full'>
  <Navcomponent  islogin={data} />

    <div className='mx-[4%] py-[50px]'>
    <h3 className='text-white font-semibold text-3xl leading-[44.5px] '>Welcome bacK</h3>
    <h1 className='text-white max-[600px]:text-5xl max-[600px]:my-[20px]   font-semibold text-7xl leading-[84.5px] md:mb-[60px]'>Lets Find <br /> Your Top Docuter</h1>
    <h1 className='text-white max-[600px]:text-5xl  max-[600px]:my-[20px] font-semibold text-7xl leading-[44.5px]'>Docter Inn</h1>
    </div>
  </div>
  <dir className='mt-[30px]'>
    <h1 className='text-[#232F55] text-4xl font-semibold'>Catorgres</h1>
    <div className='flex justify-center gap-[30px] my-[20px]'>
    <div className='max-w-[100px] flex flex-col items-center'>
        <Link>
        <img src={icon} alt="" />
        <h1 className='flex justify-center'>Heart</h1>
        </Link>
      </div>
      <div className='max-w-[100px] flex flex-col items-center'>
        <Link>
        <img src={icon} alt="" />
        <h1 className='flex justify-center'>Heart</h1>
        </Link>
      </div>
      <div className='max-w-[100px] flex flex-col items-center'>
        <Link>
        <img src={icon} alt="" />
        <h1 className='flex justify-center'>Heart</h1>
        </Link>
      </div>
     
    </div>
 <div>
 <div className='flex flex-wrap  gap-[25px] mt-[40px]'>

  {
    dataarray?.map((each)=>[
      <DoctorCard key={each.id} drName={each.name} dremail={each.email} drimg={each.imgUrl} spealist={each.specialist} location={each.location}/>

    ])
  }
    
  </div>
  <div className='flex justify-center my-[40px]'><button> <Link to='/Doctors'>See All</Link></button></div>
 </div>

  </dir>
  </div>
  );
}


export default Home;
