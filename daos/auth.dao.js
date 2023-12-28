import ContainerMongodb from "../containers/mongo.container.js"

export default class AuthMongoDao extends ContainerMongodb{
    constructor(model) {
        super(model)
    }

    async getByEmail(email) {
        try {
            return await this.model.findOne({email: email})
        } catch (error) {
            throw new Error(`${error}`)
        }
    }

}
