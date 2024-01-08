import express from "express"
import path from "path"
const __dirname = path.resolve()
const router = express.Router()
import {client} from "./../../mongodb.mjs"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import {  getStorage, ref, uploadBytes , getDownloadURL  } from "firebase/storage";
const SECRET = process.env.SECRET || "topsecret";
const db = client.db("doctordb");
import app from '../../firebaseconfig.mjs'
const col = db.collection("accounts")
import multer from 'multer'
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (adjust as needed)
  },
});










            router.get(`/doctor/:doctorid`, async (req,res)=>{

                    const doctorid = req.params.doctorid;
                    console.log(req.params.doctorid)
                    
                    try {
                        // Find the user by ID
                        const user = await col.findOne({ _id: new ObjectId(doctorid) });
                        console.log(user)
                        if (user && user.role === 'Doctor') {
                            // If the user exists and is a doctor, send the user data
                            res.send(user);
                        } else {
                            res.status(404).send("Not found or not a doctor.");
                        }
                    } catch (e) {
                        console.log(e);
                        res.status(500).send("Internal Server Error");
                    }

                

                })

             function UsercheckMiddleware(req,res,next){
                    console.log('token is',req.cookies.Token)
                    if (!req?.cookies?.Token) {
                    return    res.status(401).send('not login')
                    }

                    const decodedData = jwt.verify(req.cookies.Token , SECRET)

                    if (decodedData.exp < Date.now()) {
                        if (decodedData.role === "Doctor") {
                            req.body.decodedData = decodedData
                            next()
                        }else{
                        res.status(401).send('login as Doctor')
                            
                        }
                    }else{
                        res.cookie('Token','',{
                            maxAge:1,
                            httpOnly:true
                        })
                        res.status(401).send('login again')
                        
                    }
                }

                router.put('/update-profile',upload.single('ProfileImage'),UsercheckMiddleware,async(req,res)=>{
  const { password, email, name , role , specialist , location , about , sameimg} = req.body;
  const schedules = JSON.parse(req.body.schedules);
try {
    const addImgDB = req?.file
    let imgUrl = null
    
    const data = await col.findOne({_id: new ObjectId(req?.body?.decodedData?._id)})
       if (!data) {
        res.status(404).send("no accout found")        
       }else{
        if (addImgDB) {
            const name = +new Date() + "-" + addImgDB.originalname;
            const metadata = {
             contentType: addImgDB.mimetype
            };
            const storageRef = ref(getStorage(app), name)
            
            const task = uploadBytes(storageRef, addImgDB.buffer, metadata);
            
            
            const snapshot = await task
            
            imgUrl =await getDownloadURL(snapshot.ref)
                  
           }
         
           const updated = await col.findOneAndUpdate(
            {
                _id: new ObjectId(req?.body?.decodedData?._id)
            },
            {
                $set: {
                    name,
                    email,
                    role,
                    specialist,
                    location,
                    schedules,
                    about,
                    imgUrl: imgUrl || sameimg
                }
            },
            { returnDocument: "after" }
        );
        
           console.log(updated)
           const token = jwt.sign({
            email: data.value.email,
            name: data.value.name,
            _id:data.value._id,
            role:data.value.role,
            img:data.value.imgUrl,
            specialist:data.value.specialist,
            location:data.value.location,
            about:data.value.about,
            schedule:data.value.schedule,
  
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        }, SECRET);
        res.cookie('Token', token, {
            maxAge: 86_400_000,
            httpOnly: true,
            // sameSite: true,
            // secure: true
        });

        res.send({message:"your changes hase been saved suceefully",data:data.value})
       }

} catch (error) {
    res.status(500).send('internal error')
}

                })

            
                
                

                   

                
export default router