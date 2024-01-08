import ContainerMongodb from "../containers/mongo.container.js"
import Transaction from "../models/transaction.model.js"
import TransactionMongoDao from "./transaction.dao.js"

const containerTransaction = new TransactionMongoDao(Transaction)

export default class CategoryMongoDao extends ContainerMongodb {
    constructor(model) {
        super(model)
    }

    async getUserCategories(id, type) {
        try {

            let categorias;
            if (type) {
                categorias = await this.model.find({ user: id, type: type }).lean()
            } else {
                categorias = await this.model.find({ user: id }).lean()
            }
            return categorias;

        } catch (error) {
            throw new Error(error)
        }
    }

    async getByName(id, name) {
        try {
            return await this.model.find({ user: id, name: name }, { name: 1, _id: 0 }).lean()

        } catch (error) {
            throw new Error(error)
        }
    }

    async getCategoryEmpty(id, type) {
        try {
            return await this.model.findOne({ user: id, name: "Sin categorizar", type: type }, '_id')
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteCategory(user, id) {
        try {
            const category = await this.model.findById(id).lean()
            if (!category) return { error: "No existe esa categoria" }
            if (user.id === category.user.toString()) {
                const categoryEmpty = await this.getCategoryEmpty(user.id, category.type)
                await containerTransaction.changueCategory(id, categoryEmpty._id)
                return { data: await this.model.findByIdAndDelete(id) }
            } else {
                throw new Error({ error: "No tiene autorizacion para actualizar esta categoria" })
            }
        } catch (error) {
            throw new Error(error)

        }
    }

}
