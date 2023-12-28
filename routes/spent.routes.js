import { Router } from "express"
import Spent from '../models/spent.model.js'
import Category from "../models/category.model.js";
import SpentMongoDao from "../daos/spent.dao.js"
import CategoryMongoDao from "../daos/category.dao.js";
import ControllerSpent from "../controllers/spent.controller.js"
import { authRequired } from "../middlewares/validator.token.js";
import { validateSchema } from "../middlewares/validator.middleware.js"
import { createSpentSchema } from "../schemas/spent.schema.js";

const router = new Router()

const container = new SpentMongoDao(Spent)
const categoryContainer = new CategoryMongoDao(Category)
const controller = new ControllerSpent(container, categoryContainer)

router.get('/', authRequired, controller.getAll)
router.get('/cant', authRequired, controller.getCant)
router.get('/:id', authRequired, controller.getById)
router.post('/', authRequired, validateSchema(createSpentSchema), controller.save)
router.put('/:id', authRequired, controller.updateById)
router.delete('/:id', authRequired, controller.deleteById)

export default router   