import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
const __dirname = path.resolve();
const SECRET = process.env.SECRET || "topsecret";
import {client} from "../../mongodb.mjs"
import { ObjectId } from "mongodb"
const db = client.db("doctordb");
const col = db.collection("accounts")


function UserMiddleware(req,res,next){
  const Token = req?.cookies?.Token
  if (Token) {
      const decodedData = jwt.verify(Token , SECRET)

      if (decodedData.exp > Date.now()) {
          res.cookie('Token', '', {
              maxAge: 1,
              httpOnly: true,
            });
          re.status(500).send("Token expired")
          return
      }

      req.body.decodedData = decodedData
      next()
      return
  }
  res.status(401).send("login Please")
}

router.post("/add-appointment",UserMiddleware, async (req, res) => {
    const { DoctorId, appointmentSchedule , patientAbout } = req.body;
    const Userdata = req?.body?.decodedData
  
     console.log( DoctorId, appointmentSchedule , patientAbout )
      

    try {

      const findDoctor = await col.findOne(
        {_id:new ObjectId(DoctorId)}
        ,
        {role :"Doctor"}
        )
        console.log(findDoctor)
        if (!findDoctor) {
          res.status(404).send("invalid doctor")
          return
        }
      
       const drData =  await col.findOneAndUpdate(
          {_id:new ObjectId(DoctorId)}
          ,{$push:{
            appointments:{
              appointmentAt: appointmentSchedule,
              
              timeStamp:Date.now(),
              Patient:{
                id:Userdata._id,
                name:Userdata.name,
                email:Userdata.email
              
              },
              Patientinfo:patientAbout
            }
          }},
          {returnDocument:"after"}
          )
          await col.updateOne(
            {_id:new ObjectId(Userdata._id)}
            ,{$push:{
              appointments:{
                appointmentAt: appointmentSchedule,
                
                timeStamp:Date.now(),
                
                Doctor:{
                  id:findDoctor._id,
                  name:findDoctor.name,
                  email:findDoctor.email
                
                },
                Patientinfo:patientAbout
              }
            }}
            )

          res.send({message:"appoientment done",drData:drData.value})
      
    } catch (err) {
      console.log("DB error:", err);
      res.status(500).send( "nternal Error " );
    }
  });
 
  
 

  export default router