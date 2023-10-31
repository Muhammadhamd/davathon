import React,{useEffect ,useState , useRef} from 'react';
import { useParams , Link } from 'react-router-dom';
import dp from "../img/download.jpg"
import axios from 'axios';
import LoadingComponent from './Loading';

function DoctorCard ({drName , drimg , dremail , location , spealist , id}) {


return(
  <div className='flex max-w-[600px] p-[15px] gap-[10px] shadow bg-white items-center rounded-xl w-full'>
    <div className='w-[70px]  h-[70px] rounded-full overflow-hidden'>
      <img className='w-full' src={drimg || dp} alt="" />
    </div>
    <div className='ml-[10px]'>
      <h1 className='font-semibold text-xl'>{drName || "Muhammad Hamd" } </h1>
      <div className='flex items-center text-[#7D8BB7] text-sm'>
        <h3>{spealist||'Heart Specialist'}</h3> , <h3>{location ||'Karachi ,Pakistan'}</h3>
      </div>
      <div className='my-2'><button className='bg-[#F7F8F8]  rounded-xl px-[12px] py-1 text-base font-semibold'><Link to={`/doctor/${id}`}>Appoitement</Link></button></div>

    </div>
  </div>
)

   
        
      
        }
        
        
        
        
        




export default DoctorCard;
