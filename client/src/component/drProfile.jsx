import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageholder from "../img/download.png"
import { Link , useNavigate, useParams } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
};

function DrProfile() {
 let  months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
]

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
    const [open , setOpen] = useState(false)
    const handleAppointmentModal = ()=> setOpen(true)
    const closeAppointmentModal = ()=>setOpen(false)

    useEffect(()=>{
        sendDoctorData()
    },[drId])



 
  const [selectedDays, setSelectedDays] = useState([]);
  const [fitSchedule , setFitSchedule] = useState([])
  const [timing , setTiming] = useState([])
  const DefaultDateRef = useRef(new Date())
  const [selectedDayTiming , setSelectedDayTiming] = useState()
  const [appointment , setAppointment] = useState()
  const [appointmentData , setAppointmentData] = useState()
  const selectedMonthRef = useRef()
  const PatientRef = useRef()


  // setAppointmentData({
  //   year: new Date().getFullYear(),
  // })

    const SubmitAppointmentHandler = async(e)=>{
      e.preventDefault()
      try {
        const res = await axios.post("http://localhost:2344/add-appointment/",{
          DoctorId:drId,
          appointmentSchedule:appointmentData,
          patientAbout:PatientRef.current.value
        },{withCredentials:true})
          
         console.log(res.data.drData)
         setData(res.data.drData)
         setOpen(false)
      } catch (error) {
        console.log(error)
      }
    }
  useEffect(() => {
   console.log( data?.schedules )
      let nextDate = new Date();
      console.log(nextDate.getMonth())
      nextDate.setDate(nextDate.getDate() - 2); // Start two days before the current date
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let nineDays = []
      for (let i = 0; i < 9; i++) {
        let daysare = {
          day:dayNames[nextDate.getDay()],
          date:nextDate.getDate(),
          year:nextDate.getFullYear(),
          month:nextDate.getMonth(),
        }
        nineDays.push(daysare)
        nextDate.setDate(nextDate.getDate() + 1); // Increment the date by 1 day
      }

      // Sort by the first date
  
   
      nineDays = nineDays
      .filter((day) => data?.schedules?.some((each) => each.day === day.day))
      .map((day) => {
        const matchingSchedule = data?.schedules?.find((each) => each.day === day.day);
    
        // Use object destructuring to extract startTime and endTime
        const { startTime, endTime } = matchingSchedule || {};
    
        return {
          day: day.day, 
          date: day.date,
          year:day.year,
          month:day.month,
          timing: { startTime: startTime || null, endTime: endTime || null },
        };
      });
    setFitSchedule(nineDays);
    
  }, [data]);
  
  useEffect(()=>{
  console.log(fitSchedule)
  },[fitSchedule])
  useEffect(() => {
  
    if (!fitSchedule.some((each) => each?.date === DefaultDateRef.current.getDate())) {
      if (fitSchedule.find((each) => each?.date > DefaultDateRef.current.getDate())?.date) {
        DefaultDateRef.current.setDate(DefaultDateRef.current.getDate() + (fitSchedule.find((each) => each?.date > DefaultDateRef.current.getDate())?.date - DefaultDateRef.current.getDate()));
       
        setAppointmentData(
          {
            year:DefaultDateRef.current.getFullYear(),
            month:DefaultDateRef.current.getMonth(),
            date:DefaultDateRef.current.getDate(),
            timing:null
           }
       )
      }else{
        setAppointmentData(
          {
            year:DefaultDateRef.current.getFullYear(),
            month:DefaultDateRef.current.getMonth(),
            date:DefaultDateRef.current.getDate(),
            timing:null
           }
       )
      }
    }
  
  
    setSelectedDayTiming({
      Start: fitSchedule.find((each) => each?.date === DefaultDateRef.current.getDate())?.timing.startTime,
      end: fitSchedule.find((each) => each?.date === DefaultDateRef.current.getDate())?.timing.endTime,
    });
  }, [fitSchedule]);

  
  const changeTheDate = (date , year , month) =>{
    setAppointment(false)
    console.log(date , year , month)
    DefaultDateRef.current.setDate(DefaultDateRef.current.getDate() + (date - DefaultDateRef.current.getDate() ))
    setSelectedDayTiming({
      Start:fitSchedule.filter((each) => each.date === date)[0]?.timing.startTime,
      end:fitSchedule.filter((each) => each.date === date)[0]?.timing.endTime
    })
    console.log(appointmentData)
      setAppointmentData(
        {
          year,
          month:months[month],
          date,
          timing:null
         }
     )
    
  
  }
  // useEffect(()=>{
  // console.log(appointmentData)
  // console.log(appointmentData?.year === data?.appointments[2]?.appointmentAt?.year)
  // console.log(data?.appointments[2]?.appointmentAt?.month?.toLowerCase() === appointmentData?.month?.toLowerCase())
  // console.log(data?.appointmentAt?.date === appointmentData?.date)
  // },[appointmentData])
useEffect(()=>{
  
console.log(selectedDayTiming)


if (selectedDayTiming && selectedDayTiming.Start && selectedDayTiming.end) {
  const [startHour, startMinute] = selectedDayTiming?.Start?.split(":")?.map(Number);
const [endHour, endMinute] = selectedDayTiming?.end?.split(":")?.map(Number);
const startInMinutes = startHour * 60 + startMinute;
const endInMinutes = endHour * 60 + endMinute;

const timeDifferenceInHours = (endInMinutes - startInMinutes) / 60;
console.log(Math.floor(timeDifferenceInHours / 1))
setTiming([])
 for (let i = 0; i < Math.floor(timeDifferenceInHours / 1); i++) {
  if ((startHour + i + i) <= endHour) {
    setTiming((timing)=>[...timing , (startHour + i + i)])
  }
  
 }
}



},[selectedDayTiming])
useEffect(()=>{
console.log(timing)
},[timing])

  
console.log(DefaultDateRef.current.getDate())
  

 return(
  
  <div className="mt-[60px]">
    {/* className="bg-[black] absolute w-full h-[100vh] flex justify-center items-center" */}
   
  <>
  
 

    <div className="flex flex-col items-center ">
      <div className="w-[130px] h-[130px] rounded-xl overflow-hidden">
        <img src={data?.img || imageholder} alt="" />
      </div>
      <h1 className="text-[#263257] font-semibold text-2xl">{data?.name || 'Muhammad Hamd'}</h1>
      <h3 className="text-[##7D8BB7] text-sm">{data?.specialist || 'Heart'} Specilist</h3>
      <div className="bg-[#B28CFF] p-[20px] rounded-xl max-w-[500px] w-full flex justify-center gap-[20px] my-[50px]">
        <div className="bg-white p-[20px] rounded-xl max-w-[130px] w-full">
          <h1 className="text-[#B28CFF] text-2xl font-semibold">{data?.appointments?.length}</h1>
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
        <p className="text-sm text-slate-500 my-4">
        {data?.about || "  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet architecto inventore explicabo excepturi temporibus ducimus sint doloribus officia illo distinctio! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus voluptatem et omnis facere sit non?"}</p>
      </div>
     <div className="w-full max-w-[500px]">
     <div className="flex items-center justify-between w-full">
      <h1 className="text-[#263257] font-semibold text-xl">Shedule</h1>
      <select name="" id="" className="text-sm" ref={selectedMonthRef}>
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
      {fitSchedule?.map((daySchedule) =>
     
        <div className={`flex p-[10px] flex-col items-center rounded ${DefaultDateRef.current.getDate() === daySchedule.date ? "bg-violet-500 text-white":null}`} key={daySchedule.date}>
          <h1 onClick={()=>{changeTheDate(daySchedule.date , daySchedule.year , daySchedule.month)}} className="font-semibold text-xl">{daySchedule.date}</h1>
          <h1 className="text-slate-500 text-sm">{daySchedule.day}</h1>
        </div>
      
    )
   }
        
        
      </div>
     </div>
     <div className="w-full max-w-[500px]">
     <h1 className="text-[#263257] font-semibold text-xl">Visite hour</h1>
     <div className="flex flex-wrap gap-[20px] my-[20px]">
          {timing?.length &&
            timing.map((eachTime) => (
              <div
                key={eachTime}
                className={`rounded-xl px-6 py-4 ${
                  data?.appointments?.some(
                    (appt) =>
                      appt?.appointmentAt?.year === appointmentData?.year &&
                      appt?.appointmentAt?.month === appointmentData?.month &&
                      appt?.appointmentAt?.date === appointmentData?.date &&
                      appt?.appointmentAt?.timing === eachTime
                  )
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : appointment == eachTime ? 'bg-[#B28CFF] text-[white]' : "hover:bg-[#B28CFF] hover:text-white max-w-[100px] cursor-pointer"
                }`}
                onClick={() => {
                  if (
                    !data.appointments?.some(
                      (appt) =>
                        appt.appointmentAt.year === appointmentData?.year &&
                        appt.appointmentAt.month === appointmentData?.month &&
                        appt.appointmentAt.date === appointmentData?.date &&
                        appt.appointmentAt.timing === eachTime
                    )
                  ) {
                    setAppointment(eachTime);
                    setAppointmentData({
                      year: appointmentData?.year,
                      month: appointmentData?.month,
                      date: appointmentData?.date,
                      timing: eachTime,
                    });
                  }
                }}
              >
                <h1 className="text-sm">
                  {eachTime > 12 ? eachTime - 12 : eachTime}
                  {eachTime > 11 ? "PM" : "AM"}
                </h1>
              </div>
            ))}
        </div>
     </div>
     <div className="mb-8 mt-4">
      <button onClick={appointment && handleAppointmentModal} className={`${appointment ? "bg-violet-500 ":"bg-violet-300 "}text-white px-4 py-2 rounded shadow`}
      >Set Yout Appointment</button>
     </div>
     <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={closeAppointmentModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <div style={style} className="bg-white text-[16px] max-w-[600px] w-full rounded p-[20px] ">
           <form onSubmit={SubmitAppointmentHandler} className="w-full">
            <h1 className="text-gray-400 mb-4">You are applying for Appointment for <span className="font-semibold">{appointmentData?.month}/{appointmentData?.date}/{appointmentData?.year} - {appointmentData?.timing > 12 ? appointmentData?.timing - 12 : appointmentData?.timing} {appointmentData?.timing > 11 ? "PM" :"AM"} </span></h1>

            <textarea ref={PatientRef} className=" border rounded p-4 w-full text-sm outline-none " rows="5" placeholder="Write a note about your case so it help the Doctor to identify your Problem..."></textarea>
            <ul className="text-sm text-gray-400 flex flex-col gap-[5px] my-2">
              <li className="">
                Timing: <span>{appointmentData?.timing > 12 ? appointmentData?.timing - 12 : appointmentData?.timing} {appointmentData?.timing > 11 ? "PM" :"AM"}</span>
              </li>
              <li className="">
                date: <span>{appointmentData?.month}/{appointmentData?.date}/{appointmentData?.year}</span>
              </li>
              <li className="">
                Doctor: <span>{data?.name}</span>
              </li>
              <li className="">
                Fees: <span>Rs 1500</span>
              </li>
            </ul>
            <p className="text-[12px] text-slate-400 my-4">Your Fees Would not be returnd to you in case you Cancel the Appointment</p>
            <div className="text-slate-500 text-sm flex items-center gap-2 my-2">
            <input type="checkbox" name="" id="" />
            <label htmlFor=""> Agree</label>
            </div>
            <div className="flex justify-end">
            <button className="bg-violet-500 text-white px-4 py-2 rounded shadow text-sm font-semibold">Appoint</button>
            </div>
           </form>
            
          </div>
        </Fade>
      </Modal>
    </div></>
    
  </div>
  );
}
export default DrProfile;
