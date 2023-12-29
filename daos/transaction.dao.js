import ContainerMongodb from "../containers/mongo.container.js"
export default class TransactionMongoDao extends ContainerMongodb {
    constructor(model) {
        super(model)
    }

    async getUserResume(id, start, end, type) {

        try {
            return await this.model.aggregate([
                {
                    $match: {
                        user: id,
                        type: type,
                        date: {
                            $gte: start,
                            $lte: end
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        cant: { $sum: '$amount' }
                    }
                }
            ])
        } catch (error) {
            throw new Error(error)
        }
    }

    async getUserMovements(id) {
        try {
            const ingresosPorFecha = await this.model.aggregate([
                {
                    $match: {
                        user: id
                    }
                },
                {
                    $sort: {
                        date: -1
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                        transactions: { $push: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'categories', // Reemplaza 'categories' con el nombre de tu colección de categorías
                        localField: 'transactions.category', // Campo en 'transactions' que contiene el ID de la categoría
                        foreignField: '_id',
                        as: 'categorias' // Campo para almacenar los resultados del lookup
                    }
                },
                {
                    $addFields: {
                        'transactions': {
                            $map: {
                                input: '$transactions',
                                as: 'transaccion',
                                in: {
                                    $mergeObjects: [
                                        '$$transaccion',
                                        {
                                            category: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$categorias',
                                                            cond: { $eq: ['$$this._id', '$$transaccion.category'] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fecha: '$_id',
                        transactions: '$transactions'
                    }
                },
                {
                    $sort: {
                        fecha: -1
                    }
                },
            ]);
            return ingresosPorFecha
        } catch (error) {
            throw new Error(error)

        }
    }


    async changueCategory(id, newId) {
        try {
            return await this.model.updateMany(
                { category: id },
                { $set: { category: newId } }
            );
        } catch (error) {
            throw new Error(error)
        }
    }

}
