import express from 'express'
const route = express.Router()

import * as subCategoryController from '../controller/SubCategaryController.js'
import { verifyToken,} from '../middlewares/verifyToken.js';
// 
route.post("/saveSubCategory",verifyToken,subCategoryController.saveSubCategory);
route.put("/updateSubCategory/:id", subCategoryController.updateSubCategory);

route.get("/viewAllSubCategoryList",subCategoryController.viewAllSubCategoryList);
route.get("/viewSubCategoryListbyAdmin/:teacherId", subCategoryController.viewSubCategoryListbyAdmin);
route.get("/viewSubCategoryListbyTeacher",verifyToken,subCategoryController.viewSubCategoryListbyTeacher)

route.post("/viewSubCategoryList",subCategoryController.viewSubCategoryList);
route.delete("/deleteSubCategory/:id",subCategoryController.deleteSubCategory); 

export default route;