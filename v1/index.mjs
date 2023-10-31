import express from "express"
import postRouter from "./routes/post.mjs"
import projectRouter from "./routes/project.mjs"
import userRouter from "./routes/user.mjs"
import authRouter from "./routes/auth.mjs"
import userauthRouter from "./routes/userauth.mjs"
import doctorProfiles from './routes/profile.mjs'
const router = express.Router()

router.use(postRouter)
router.use(doctorProfiles)
router.use(projectRouter)
router.use(authRouter)
router.use(userauthRouter)
router.use(userRouter)
export default router