class ContainerMongodb {

    constructor(model) {
        this.model = model;
    }

    async getAll() {
        try {
            return await this.model.find({}).lean()
        } catch (error) {
            throw new Error(`${error}`)
        }
    }

    async save(item) {
        const newModel = new this.model(item)
        try {
            return await newModel.save()
        } catch (error) {
            throw new Error(`${error}`)
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id).lean()
        } catch (error) {
            throw new Error(error)
        }
    }


    async updateById(id, body) {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { $set: body },
                { new: true }
            )
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteById(id) {
        try {
            await this.model.findByIdAndDelete(id)
        } catch (error) {
            throw new Error(error)
        }
    }

}

export default ContainerMongodb