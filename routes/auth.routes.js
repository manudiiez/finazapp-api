import { Router } from "express"
import User from '../models/user.model.js'
import Category from '../models/category.model.js'
import ControllerAuth from "../controllers/auth.controller.js"
import AuthMongoDao from "../daos/auth.dao.js"
import CategoryMongoDao from "../daos/category.dao.js"
import { authRequired } from "../middlewares/validator.token.js"

const router = new Router()

const container = new AuthMongoDao(User)
const containerCategory = new CategoryMongoDao(Category)
const controller = new ControllerAuth(container, containerCategory)

router.post('/register', controller.register)
router.post('/login', controller.login)
router.put('/update', authRequired, controller.update)

export default router   