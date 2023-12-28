import { Router } from "express"
import Income from '../models/income.model.js'
import Category from "../models/category.model.js";
import CategoryMongoDao from "../daos/category.dao.js";
import { authRequired } from "../middlewares/validator.token.js";
import { validateSchema } from "../middlewares/validator.middleware.js"
import IncomeMongoDao from "../daos/income.dao.js";
import ControllerIncome from "../controllers/income.controller.js";
import { createIncomeSchema } from "../schemas/income.schema.js";

const router = new Router()

const container = new IncomeMongoDao(Income)
const categoryContainer = new CategoryMongoDao(Category)
const controller = new ControllerIncome(container, categoryContainer)

router.get('/', authRequired, controller.getAll)
router.get('/cant', authRequired, controller.getCant)
router.get('/:id', authRequired, controller.getById)
router.post('/', authRequired, validateSchema(createIncomeSchema), controller.save)
router.put('/:id', authRequired, controller.updateById)
router.delete('/:id', authRequired, controller.deleteById)

export default router   