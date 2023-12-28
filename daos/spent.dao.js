import ContainerMongodb from "../containers/mongo.container.js"

export default class SpentMongoDao extends ContainerMongodb{
    constructor(model) {
        super(model)
    }

    async getUserSpent(id) {
        try {
            console.log(id);
            return await this.model.find({user_id: id}).lean()

        } catch (error) {
            throw new Error(error)
        }
    }

    async getUserSpentCant(id) {
        try {
            return await this.model.find({user_id: id},{amount: 1}).lean()

        } catch (error) {
            throw new Error(error)
        }
    }

}
