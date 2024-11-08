import express from 'express'
const route = express.Router()

import * as categoryController from '../controller/CategoryController.js'
import { verifyToken } from '../middlewares/verifyToken.js';

route.post("/saveCategory",verifyToken,categoryController.saveCategory);
route.put("/updateCategory/:id",categoryController.updateCategory);
route.get("/viewAllCategoryList",verifyToken,categoryController.viewAllCategoryList);
route.get("/viewCategory",categoryController.saveCategory);
route.delete("/deleteCategory/:id",categoryController.deleteCategory);

export default route;