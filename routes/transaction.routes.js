import { Router } from "express"
import Transaction from '../models/transaction.model.js'
import Category from "../models/category.model.js";
import CategoryMongoDao from "../daos/category.dao.js";
import { authRequired } from "../middlewares/validator.token.js";
import { validateSchema } from "../middlewares/validator.middleware.js"
import TransactionMongoDao from "../daos/transaction.dao.js";
import ControllerTransaction from "../controllers/transaction.controller.js";
import { createTransactionSchema } from "../schemas/transaction.schema.js";

const router = new Router()

const container = new TransactionMongoDao(Transaction)
const categoryContainer = new CategoryMongoDao(Category)
const controller = new ControllerTransaction(container, categoryContainer)

router.get('/', authRequired, controller.getAll)
router.post('/', authRequired, validateSchema(createTransactionSchema), controller.save)
router.get('/item/:id', authRequired, controller.getById)
router.put('/:id', authRequired, controller.updateById)
router.delete('/:id', authRequired, controller.deleteById)
router.get('/resume', authRequired, controller.getResume)

export default router   