import { Router } from "express"
import Category from '../models/category.model.js'
import Transaction from "../models/transaction.model.js";
import CategoryMongoDao from "../daos/category.dao.js"
import TransactionMongoDao from "../daos/transaction.dao.js";
import { validateSchema } from "../middlewares/validator.middleware.js"
import ControllerCategory from "../controllers/category.controller.js"
import { createCategorySchema } from "../schemas/category.schema.js"
import { authRequired } from "../middlewares/validator.token.js";

const router = new Router()

const container = new CategoryMongoDao(Category)
const controller = new ControllerCategory(container)

router.get('/', authRequired, controller.getAll)
router.get('/:id', authRequired, controller.getById)
router.post('/', authRequired, validateSchema(createCategorySchema), controller.save)
router.put('/:id', authRequired, controller.updateById)
router.delete('/:id', authRequired, controller.deleteById)

export default router   