import express from "express"
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
const router = express.Router()
const db = client.db("doctordb");

const SECRET = process.env.SECRET || "topsecret";

function UserMiddleware(req,res,next){
    const Token = req?.cookies?.Token
    if (Token) {
        const decodedData = jwt.verify(Token , SECRET)

        if (decodedData.exp > Date.now()) {
            res.cookie('Token', '', {
                maxAge: 1,
                httpOnly: true,
              });
            res.status(500).send("Token expired")
            return
        }

        res.body.decodedData = decodedData
        next()
        return
    }
    res.status(401).send("login Please")
}

router.post("/get-appointment",UserMiddleware,(req,res)=>{
    const {doctorId , authorMsg , date } = req.body
    const Userdata = req?.body?.decodedData

    console.log(doctorId , authorMsg , date)

})
