import express from "express"
const route = express.Router()

import * as AdminController from "../controller/AdminController.js"
import { verifyToken } from "../middlewares/verifyToken.js";

route.post("/saveAdmin",AdminController.saveAdmin);
route.post("/loginAdmin",AdminController.loginAdmin);
route.put("/approveTeacher/:id",AdminController.approveTeacher);
route.get("/updateAdmin",AdminController.updateAdmin);
route.get("/viewPandingTeacher",AdminController.viewPandingTeacher);
route.get("/loginAdminInfo",verifyToken,AdminController.loginAdminInfo);
route.get("/viewActiveTeacher",AdminController.viewActiveTeacher);
route.get('/getMessages/:senderId/:receiverId', AdminController.getMessages);
// route.post('/message/send', AdminController.sendMessage)
route.get("/viewAllAdmin",AdminController.viewAllAdmin);
route.delete("/deleteAdmin",AdminController.deleteAdmin);
route.post("/sendmessage",AdminController.sendMessage);
route.put("/changeIcon",verifyToken,AdminController.changeIcon);

route.get("/viewMainAdmin",verifyToken,AdminController.viewMainAdmin);



// viewMainAdmin


// viewPandingTeacher
// approveTeacher viewActiveTeacher sendmessage getMessages





export default route