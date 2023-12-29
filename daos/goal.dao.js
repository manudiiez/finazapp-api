import ContainerMongodb from "../containers/mongo.container.js"

export default class GoalMongoDao extends ContainerMongodb {
    constructor(model) {
        super(model)
    }

    async getUserData(id) {
        try {
            return await this.model.find({ user: id }).populate("category", "name").lean()
        } catch (error) {
            throw new Error(error)
        }
    }

}