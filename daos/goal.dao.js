import ContainerMongodb from "../containers/mongo.container.js"

export default class GoalMongoDao extends ContainerMongodb {
    constructor(model) {
        super(model)
    }

    async getUserData(id) {
        try {
            const goals = await this.model.aggregate([
                {
                    $match: { user: id }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryInfo'
                    }
                },
                {
                    $unwind: '$categoryInfo'
                },
                {
                    $lookup: {
                        from: 'transactions',
                        let: { categoryId: '$category' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$category', '$$categoryId'] }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalAmount: { $sum: '$amount' }
                                }
                            }
                        ],
                        as: 'transactions'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        category: {
                            name: '$categoryInfo.name',
                            color: '$categoryInfo.color',
                        },
                        deadline: 1,
                        date: 1,
                        amount: 1,
                        sum: { $arrayElemAt: ['$transactions.totalAmount', 0] }
                    }
                }
            ]);

            return goals;
            // return await this.model.find({ user: id }).populate("category", "name color").lean()
        } catch (error) {
            throw new Error(error)
        }
    }

}