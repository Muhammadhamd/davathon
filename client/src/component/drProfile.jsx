import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageholder from "../img/download.png"
import { Link , useNavigate, useParams } from "react-router-dom";

function DrProfile() {

    const drId = useParams().id
    console.log(drId)
 const [data , setData]= useState()
    const sendDoctorData = async() =>{
       try {
        const res =await axios.get(`http://localhost:2344/doctor/${drId}`,{
            withCredentials: true,
       })
        console.log(res)
        setData(res.data)
       } catch (error) {
        console.log(error)
       }

    }
    useEffect(()=>{
        sendDoctorData()
    },[drId])
 return(
  <div className="mt-[60px]">
    <div className="flex flex-col items-center ">
      <div className="w-[130px] h-[130px] rounded-xl overflow-hidden">
        <img src={data?.imgUrl || imageholder} alt="" />
      </div>
      <h1 className="text-[#263257] font-semibold text-2xl">{data?.name || 'Muhammad Hamd'}</h1>
      <h3 className="text-[##7D8BB7] text-sm">{data?.specialist || 'Heart'} Specilist</h3>
      <div className="bg-[#B28CFF] p-[20px] rounded-xl max-w-[500px] w-full flex gap-[20px] my-[50px]">
        <div className="bg-white p-[20px] rounded-xl max-w-[130px] w-full">
          <h1 className="text-[#B28CFF] text-2xl font-semibold">350+</h1>
          <h3 className="text-[##7D8BB7] text-sm">Appoitment</h3>
        </div>
        <div className="bg-white p-[20px] rounded-xl max-w-[130px] w-full">
          <h1 className="text-[#B28CFF] text-2xl font-semibold">350+</h1>
          <h3 className="text-[##7D8BB7] text-sm">Appoitment</h3>
        </div>
        <div className="bg-white p-[20px] rounded-xl max-w-[130px] w-full">
          <h1 className="text-[#B28CFF] text-2xl font-semibold">350+</h1>
          <h3 className="text-[##7D8BB7] text-sm">Appoitment</h3>
        </div>
      </div>
      <div className="max-w-[500px] w-full">
        <h1 className="text-[#263257] font-semibold text-xl">About Doctor</h1>
        <p className="text-sm text-slate-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet architecto inventore explicabo excepturi temporibus ducimus sint doloribus officia illo distinctio! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus voluptatem et omnis facere sit non?</p>
      </div>
     <div className="w-full max-w-[500px]">
     <div className="flex items-center justify-between w-full">
      <h1 className="text-[#263257] font-semibold text-xl">Shedule</h1>
      <select name="" id="" className="text-sm">
        <option value="">january</option>
        <option value="">Febuary</option>
        <option value="">March</option>
        <option value="">April</option>
        <option value="">May</option>
        <option value="">June</option>
        <option value="">July</option>
        <option value="">August</option>
        <option value="">September</option>
        <option value="">Octuber</option>
        <option value="">August</option>
      </select>
      </div>
      <div className="mt-[50px] flex justify-between">
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">7</h1>
          <h1 className="text-slate-500 text-sm">mon</h1>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">8</h1>
          <h1 className="text-slate-500 text-sm">mon</h1>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">9</h1>
          <h1 className="text-slate-500 text-sm">tuesday</h1>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">10</h1>
          <h1 className="text-slate-500 text-sm">wednesDay</h1>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">11</h1>
          <h1 className="text-slate-500 text-sm">thursday</h1>
        </div>
        
      </div>
     </div>
     <div className="w-full max-w-[500px]">
     <h1 className="text-[#263257] font-semibold text-xl">Visite hour</h1>
     <div className="flex flex-wrap gap-[20px] my-[20px]">
     <div className="rounded-xl px-6 py-4 hover:bg-[#B28CFF] max-w-[100px]">
     <h1 className="text-sm">11:00pm</h1>
     </div>
      <div className="rounded-xl px-6 py-4 hover:bg-[#B28CFF] max-w-[100px]">
     <h1 className="text-sm">11:00pm</h1>
     </div>
      <div className="rounded-xl px-6 py-4 hover:bg-[#B28CFF] max-w-[100px]">
     <h1 className="text-sm">11:00pm</h1>
     </div>
      <div className="rounded-xl px-6 py-4 hover:bg-[#B28CFF] max-w-[100px]">
     <h1 className="text-sm">11:00pm</h1>
     </div>
      <div className="rounded-xl px-6 py-4 hover:bg-[#B28CFF] max-w-[100px]">
     <h1 className="text-sm">11:00pm</h1>
     </div>
     
     </div>
     </div>
    </div>
  </div>
  );
}

export default DrProfile;
