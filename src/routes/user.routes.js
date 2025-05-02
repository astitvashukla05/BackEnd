import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
import {upload} from '../middlewares/multermiddleware..js'
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"Avatar",
            maxCount:1,
        },
        {
            name:"CoverImage",
            maxCount:1

        },
    ]),
    registerUser
)

export default router;


