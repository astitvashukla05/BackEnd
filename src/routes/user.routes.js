import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
<<<<<<< HEAD
import upload from '../middlewares/multermiddleware..js'
=======
import upload from '../middlewares/multermiddleware.js'
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1

        },
    ]),
    registerUser
)

export default router;
<<<<<<< HEAD

=======
registerUser
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)

