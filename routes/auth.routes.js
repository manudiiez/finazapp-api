import { Router } from "express"
import User from '../models/user.model.js'
import ControllerAuth from "../controllers/auth.controller.js"
import AuthMongoDao from "../daos/auth.dao.js"

const router = new Router()

const container = new AuthMongoDao(User)
const controller = new ControllerAuth(container)

router.post('/signup', controller.signup)
router.post('/signin', controller.signin)
router.post('/logout', controller.logout)

export default router   