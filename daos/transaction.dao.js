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

    async getTransactionsByCategoryMonth(id, type, year) {
        try {
            const ingresosPorCategoriaYMes = await this.model.aggregate([
                {
                    $match: {
                        user: id,
                        type: type, // Filtra por tipo de transacción (ingreso)
                        date: {
                            $gte: new Date(`${year}-01-01`), // Fecha de inicio del año actual
                            $lte: new Date(`${year}-12-31`), // Fecha de fin del año actual
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'categories', // Nombre de la colección de categorías
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryInfo',
                    },
                },
                {
                    $unwind: '$categoryInfo',
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$date' }, // Extrae el número de mes
                            categoriaRef: '$categoryInfo.name', // Agrupa por el nombre de la categoría
                        },
                        total: { $sum: '$amount' }, // Suma el monto para cada categoría y mes
                    },
                },
                {
                    $group: {
                        _id: '$_id.month', // Agrupa por mes
                        categorias: {
                            $push: {
                                categoriaRef: '$_id.categoriaRef',
                                total: '$total',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: '$_id',
                        categorias: 1,
                    },
                },
            ]);

            const meses = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago',
                'Sep', 'Oct', 'Nov', 'Dic',
            ];
            const ingresosPorMesYCategoria = []
            if (ingresosPorCategoriaYMes.length === 0) {
                return []
            }
            const maxValue = ingresosPorCategoriaYMes.reduce((max, obj) => (obj.month > max ? obj.month : max), ingresosPorCategoriaYMes[0].month);
            for (let i = 0; i < maxValue; i++) {
                const index = i
                const mesNombre = meses[i]
                const ingresosPorCategoriaEnMes = ingresosPorCategoriaYMes.find((item) => item.month === (index + 1));
                const ingresosEnMes = { name: mesNombre };
                if (ingresosPorCategoriaEnMes) {
                    ingresosPorCategoriaEnMes.categorias.forEach((categoria) => {
                        ingresosEnMes[categoria.categoriaRef] = categoria.total;
                    });
                }
                ingresosPorMesYCategoria.push(ingresosEnMes)
            }
            return ingresosPorMesYCategoria;

        } catch (error) {
            throw new Error('Error al obtener las ganancias por categoría');
        }
    }

    async getIncomesAndExpensesByMonth(id, year) {
        try {
            const response = await this.model.aggregate([
                {
                    $match: {
                        user: id,
                        date: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$date' },
                            type: '$type', // Agrupar por tipo (income o bill)
                        },
                        total: { $sum: '$amount' }, // Suma de los montos
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: '$_id.month',
                        name: '$_id.type',
                        total: '$total',
                    },
                },
            ]);

            const meses = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago',
                'Sep', 'Oct', 'Nov', 'Dic',
            ];

            if (response.length === 0) {
                return []
            }

            const maxValue = response.reduce((max, obj) => (obj.month > max ? obj.month : max), response[0].month);

            const ingresosPorMesYCategoria = []
            for (let i = 0; i < maxValue; i++) {
                const index = i
                const mesNombre = meses[i]
                const ingresosPorCategoriaEnMes = response.filter((item) => item.month === (index + 1));
                const ingresosEnMes = {
                    name: mesNombre,
                    Ingresos: 0,
                    Gastos: 0,
                    Balance: 0
                };
                if (ingresosPorCategoriaEnMes) {
                    ingresosPorCategoriaEnMes.map(item => {
                        ingresosEnMes[item.name === 'income' ? 'Ingresos' : 'Gastos'] = item.total
                    })
                }
                if (ingresosEnMes.Ingresos || ingresosEnMes.Gastos) {
                    ingresosEnMes.Balance = (ingresosEnMes?.Ingresos || 0) - (ingresosEnMes?.Gastos || 0)
                }
                ingresosPorMesYCategoria.push(ingresosEnMes)
            }
            return ingresosPorMesYCategoria;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getDataForChart(id, type, year) {
        try {
            const response = await this.model.aggregate([
                {
                    $match: {
                        user: id,
                        type: type,
                        date: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`),
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryInfo',
                    },
                },
                {
                    $unwind: '$categoryInfo',
                },
                {
                    $group: {
                        _id: '$categoryInfo',
                        total: { $sum: '$amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id._id', // Agregar el ID de la categoría
                        name: '$_id.name',
                        value: '$total',
                        color: { $ifNull: ['$_id.color', '#8884d8'] }, // Si no hay color, usa #000
                    },
                },
            ]);

            // Mapear la respuesta para ajustarla al formato requerido
            const responseChart = response.map((item) => ({
                id: item.id, // ID de la categoría
                name: item.name,
                value: item.value,
                color: item.color,
                type: type
            }));

            return responseChart;
        } catch (error) {
            throw new Error('Error al obtener datos para el gráfico de ingresos');
        }
    }

    async getIncomeAndExpenses(id, year) {
        try {
            const response = await this.model.aggregate([
                {
                    $match: {
                        user: id,
                        date: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`),
                        },
                    },
                },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' },
                    },
                },
            ]);

            const result = response.map((item) => ({
                name: item._id === 'income' ? 'Ingresos' : 'Gastos',
                value: item.total,
                color: item._id === 'income' ? '#3A785E' : '#A5211E',
                type: item._id
            }));

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
}
