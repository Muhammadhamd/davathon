import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageholder from "../img/download.png"
import { Link , useNavigate } from "react-router-dom";

function Profile({data}) {

  const [editFormOpen , setEditFormOpen] = useState(false)
  const [img , setImg] = useState()
  const [image , setdpimage] = useState(imageholder)
  const passwordref = useRef(null)
  const emailref = useRef(null)
  const nameref = useRef(null)
  const roleref = useRef(null)
  const [fitSchedule , setFitSchedule] = useState([])
  const aboutref = useRef(null)
 
  const specialistref = useRef(null)
  const locationref = useRef(null)

  const editHandler = (e)=>{

  }
  const [selectedDays, setSelectedDays] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const handleDayChange = (day) => {
    console.log(selectedDays)
    if (selectedDays.includes(day)) {
      console.log(true)
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
      setSchedules(schedules.filter((selectedDay) => selectedDay.day !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
      setSchedules([...schedules, { day, startTime: '', endTime: '' }]);
    }
  };

  const handleTimingChange = (day, timeType, value) => {
    const updatedSchedules = schedules.map((schedule) =>
      schedule.day === day ? { ...schedule, [timeType]: value } : schedule
    );
    setSchedules(updatedSchedules);
  }

  const editSubmitHandler =async(e)=>{
    e.preventDefault()

    try {
      const formdata = new FormData()
      const schedulesJSON = JSON.stringify(schedules);
      formdata.append('email',emailref.current.value)
      formdata.append('password',passwordref.current.value)
      formdata.append('name',nameref.current.value)
      formdata.append('role',"Doctor")
      formdata.append('specialist',specialistref.current.value)
      formdata.append('location',locationref.current.value)
      formdata.append('ProfileImage',img)
      formdata.append('about',aboutref.current.value)
      formdata.append('sameimg',data.img)
      formdata.append('schedules',schedulesJSON)
      const res = await axios.put(`http://localhost:2344/update-profile`,formdata,{
        withCredentials: true, // Use withCredentials instead of withCredential
      }) 
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  function getNextDayOfWeek(dayOfWeek, numOccurrences) {
    const today = new Date();
    const occurrences = [];
  
    while (occurrences.length < numOccurrences) {
      today.setDate(today.getDate() + 1); // Move to the next day
      if (today.toLocaleDateString('en-US', { weekday: 'long' }) === dayOfWeek) {
        // Check if the day matches the desired day of the week
        occurrences.push({
         date: new Date(today).getDate(),
         day:dayOfWeek
        }); // Store the date
      }
    }
  
    return occurrences;
  }
  


  useEffect(() => {
    const updatedFitSchedule = data?.schedule
      .map((each) => ({
        day: each.day,
        schedules: getNextDayOfWeek(each.day, 2), // Get the next 4 dates
      }))
      // Sort by the first date
  
    setFitSchedule(updatedFitSchedule);
  }, []);
useEffect(()=>{
  console.log(fitSchedule)

},[fitSchedule])


  useEffect(()=>{
   console.log(schedules)
  },[schedules,selectedDays])
 return(
  
  <div className="mt-[60px]">
    {/* className="bg-[black] absolute w-full h-[100vh] flex justify-center items-center" */}
   { editFormOpen ? <div  className="bg-[black] w-full h-[100vh] flex justify-center items-center">
      <form onSubmit={editSubmitHandler} className='w-full bg-white  p-[20px]'>
      <div className='flex justify-center h-[80px] my-[10px] w-[80px]'>
                    <img className='overflow-hidden rounded-full w-full' src={data.img || image} alt=""onClick={(e)=>{
                      document.getElementById("inputimage").click()
}} />
                    <input type="file" id='inputimage' hidden onChange={(e)=>{
                      setdpimage(URL.createObjectURL(e.target.files[0]))
                      setImg(e.target.files[0])
                    }

                    }
                     />
                </div>
                    
                <input type="text" placeholder='Enter Your name'  className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none'
                
                ref={nameref} defaultValue={data.name}
                
                />
                <input type="email" placeholder='Enter new email'  className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none'
               
                ref={emailref} defaultValue={data.email}
                
                />
                 <input type="text" placeholder='Enter Location'  className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none'
               
               ref={locationref} defaultValue={data.location}
               
               />
                <input type="text" placeholder='specialist in...'  className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none'
               
               ref={specialistref} defaultValue={data.specialist}
               
               />
                <input type="password"  placeholder='Enter new password' className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none'
                ref={passwordref} 
                />
                <textarea ref={aboutref}  className='px-4 py-3 rounded border w-full my-[7px] bg-[#0A86FF24] outline-none' name="" id="" cols="30" rows="6"></textarea>
                
                <div className=" text-slate-500">
                  <h1>shedule</h1>
                  {['Monday','Tuesday', 'Wednesday','Thursday', 'Friday','Saturday','Sunday'].map((day) => (
          <div key={day}>
            <label htmlFor={day}>{day}</label>
            <input
              type="checkbox"
              name={day}
              value={day}
              id={day}
              onChange={() => handleDayChange(day)}
            />
            {selectedDays.includes(day) && (
              <div>
                <label>Start Time</label>
                <input
                  type="time"
                  onChange={(e) => handleTimingChange(day, 'startTime', e.target.value)}
                />
                <label>End Time</label>
                <input
                  type="time"
                  onChange={(e) => handleTimingChange(day, 'endTime', e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
   
       
                </div>
                <input type="submit" />
      </form>
    </div>
    :
  <>
  
  <div className="flex justify-between">
      <h1 className="flex items-center text-2xl font-bold">
        <Link to="/">
        <i className="fa fa-arrow"></i>
        Back To Home
        </Link>
       
      </h1>
      <button 
      onClick={()=>{
        setEditFormOpen(true)
      }}
      >Edit</button>
    </div>

    <div className="flex flex-col items-center ">
      <div className="w-[130px] h-[130px] rounded-xl overflow-hidden">
        <img src={data.img || imageholder} alt="" />
      </div>
      <h1 className="text-[#263257] font-semibold text-2xl">{data.name || 'Muhammad Hamd'}</h1>
      <h3 className="text-[##7D8BB7] text-sm">{data.specialist || 'Heart'} Specilist</h3>
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
      {fitSchedule
    .map((daySchedule) =>
      daySchedule.schedules.map((day) => (
        <div className="flex flex-col items-center" key={day.date}>
          <h1 className="font-semibold text-xl">{day.date}</h1>
          <h1 className="text-slate-500 text-sm">{day.day}</h1>
        </div>
      ))
    )
   }
        
        
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
    </div></>
    }
  </div>
  );
}

export default Profile;
