import { Router } from "express"
import Category from '../models/category.model.js'
import Goal from "../models/goal.model.js"
import CategoryMongoDao from "../daos/category.dao.js"
import ControllerGoal from "../controllers/goal.controller.js"
import { authRequired } from "../middlewares/validator.token.js";
import GoalMongoDao from "../daos/goal.dao.js"

const router = new Router()

const containerCategory = new CategoryMongoDao(Category)
const container = new GoalMongoDao(Goal)
const controller = new ControllerGoal(container, containerCategory)

router.get('/', authRequired, controller.getAll)
router.get('/:id', authRequired, controller.getById)
router.post('/', authRequired, controller.save)
router.delete('/:id', authRequired, controller.deleteById)
router.put('/:id', authRequired, controller.updateById)

export default router   