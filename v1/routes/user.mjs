import express from "express"
import mongoose, { model } from "mongoose"
const router = express.Router()
import {client} from "../../mongodb.mjs"
import { ObjectId } from "mongodb"
const db = client.db("doctordb");
const col = db.collection("accounts")


router.get('/doctors', async (req, res) => {
    const searched = req.query.s;
    


    const searchdoctorsData =  col.find({ role: 'Doctor' })

    const doctors = await col.find({ role: 'Doctor' }).sort({_id : -1}).limit(40).toArray()
    const doctorare = await searchdoctorsData.toArray()
    try {
        // Find all users with the role "Doctor"
       
        if(searched){
            const filteredPosts = doctorare.filter((post) => {
                // Check if 'post' is defined and has a 'title' property before calling 'toLowerCase'
                return post && post.name && post.name.toLowerCase().includes(searched.toLowerCase());
              });
              if(filteredPosts.length > 0){
                res.send(filteredPosts);
                return
            }
            else{
                res.status(404).send(`No post found with search=${searched}`)
                return
    
            }
            
            
        }
        res.send(doctors)
    } catch (error) {
        // Handle errors, e.g., internal server error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



export default router