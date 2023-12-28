import ContainerMongodb from "../containers/mongo.container.js"

export default class CategoryMongoDao extends ContainerMongodb{
    constructor(model) {
        super(model)
    }

    async getUserCategories(id) {
        try {
            console.log(id);
            return await this.model.find({user_id: id}).lean()

        } catch (error) {
            throw new Error(error)
        }
    }

}
