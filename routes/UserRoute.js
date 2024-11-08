import express from "express"
const route = express.Router()

import * as userController from "../controller/UserController.js"
import { verifyToken, verifyTokenuser } from "../middlewares/verifyToken.js";

route.post("/saveUser",userController.saveUser);
route.post("/loginUser",userController.loginUser);
// route.put("/updateUser",verifyToken,userController.updateUser);
route.put('/changeIcon',verifyToken,userController.changeIcon)
route.patch("/viewAllUser",userController.viewAllUser);
route.get("/loginUserInfo",verifyToken,userController.loginUserInfo);
route.delete("/deleteUser",userController.deleteUser);
// route.put("/userUploadPic", verifyToken,userController.userUploadPic)
// app.post('/upload-profile-pic', verifyToken, userUploadPic);

// userUploadPic





export default route