import express from "express";
const router = express.Router();
import path from "path";
import mongoose from "mongoose"
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import {  getStorage, ref, uploadBytes , getDownloadURL  } from "firebase/storage";
const __dirname = path.resolve();
const SECRET = process.env.SECRET || "topsecret";
import {client} from "../../mongodb.mjs"
import { ObjectId } from "mongodb"
const db = client.db("doctordb");
import app from '../../firebaseconfig.mjs'
const admincol = db.collection("accounts")
import multer from 'multer'
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (adjust as needed)
  },
});
 function authenticateAdmin(req, res, next) {
  const token = req.cookies.Token; // Assuming you store the token in a cookie
  if (token) {
    // Verify and decode the token here (use your actual logic)
    // For example, you can use the 'jsonwebtoken' library
    const decodedData = jwt.verify(token, SECRET);

    if (decodedData.exp > Date.now()) {
      // If the token is valid, set the user data in the request object
      res.cookie('Token', '', {
          maxAge: 1,
          httpOnly: true,
        })
      
    }else{
      req.body.decodedData = decodedData;
      console.log(decodedData)
      next()
    }
  }
}

router.post("/userlogin", async (req, res) => {
    const { email, password } = req.body;
  
    // const hashedPassword = await bcrypt.hash(password, 10)
   
      

    try {
      const data = await admincol.findOne(
        { email: email  },
        "email password"
      );
  0
      if (!data) {
        console.log("User not found");
        return res.status(401).send( "Incorrect email or password" );
      }
  
      const isMatch = await bcrypt.compare(password, data.password);
  
      if (isMatch) {
        console.log("Password matches");
  
        const token = jwt.sign({
          email: data.email,
          name: data.name,
          _id:data._id,
          role:data.role,
          img:data.imgUrl,
          specialist:data.specialist,
          location:data.location,
          about:data.about,
          schedule:data.schedules,

          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      }, SECRET);

      // res.send(token);

      res.cookie('Token', token, {
          maxAge: 86_400_000,
          httpOnly: true,
          // sameSite: true,
          // secure: true
      });
      // Cookies.set("username", "john", { expires: 7, path: "/" });
        // console.log(req.cookies.Token)
        res.send({
          message:'login sucessfully',
          data:{
            email: data.email,
            name: data.name,
            _id:data._id,
            role:data.role,
            img:data.imgUrl,
            specialist:data.specialist,
            location:data.location
          }
        });
        return
      } else {
        console.log("Password did not match");
        return res.status(401).send("Incorrect password" );
      }
    } catch (err) {
      console.log("DB error:", err);
      res.status(500).send( "Login failed, please try later" );
    }
  });
  router.post('/userregister',upload.single('ProfileImage'),async (req, res) => {
    const { password, email, name , role , specialist , location} = req.body;
    if (!password || !email || !name) {
      return res.status(400).send('Required fields are missing.');
    }
  
    try {
  
      const addImgDB = req?.file
      let imgUrl = ''
  
         

      
            
  
      const user = await admincol.findOne({ email });
      if (user) {
        return res.status(400).send('User already exists. Please use a different email.');
      } else {
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
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await admincol.insertOne({
          name,
          email,
          password: hashedPassword,
          role:role,
          specialist,
          location,
          imgUrl
        });
        console.log(data.email)
        // const token = jwt.sign({
        //   _id: data._id,
        //   email: data.email,
        //   name:data.name,
        //   image:data.profileImage,
        //   iat: Date.now() / 1000 - 30,
        //   exp: Date.now() / 1000 + (60 * 60 * 48),
        // }, SECRET);
  
        // res.cookie('Token', token, {
        //   maxAge: 86_400_000,
        //   httpOnly: true,
        // });
  
        res.send({
          message:'user logedin',
          data:{
            fgss:"hewr"
          }
        })
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ error: 'Failed to register user.' });
    }
  });
  router.get("/user-logout",authenticateAdmin,(req, res) => {

    res.cookie('Token', '', {
         maxAge: 1,
         httpOnly: true
     });
 
     res.send("Logout successful" );
     console.log(req.cookies.AnToken)
 })



  export default router