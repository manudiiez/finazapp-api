import { formatNumber } from "../utils/func.js";

class ControllerTransaction {

    constructor(container, categoryContainer) {
        this.container = container
        this.categoryContainer = categoryContainer
    }

    getResume = async (req, res) => {

        const startDate = new Date(req.query.startDate) || null;
        const endDate = new Date(req.query.endDate);
        endDate.setDate(endDate.getDate() + 1)
        try {
            const incomes = await this.container.getUserResume(req.user.id, startDate, endDate, 'income')
            const bills = await this.container.getUserResume(req.user.id, startDate, endDate, 'bill')
            const totalIncomes = await this.container.getUserResume(req.user.id, new Date(null), endDate, 'income')
            const totalBills = await this.container.getUserResume(req.user.id, new Date(null), endDate, 'bill')
            res.status(200).json({
                incomes: formatNumber(incomes[0]?.cant || 0).substring(1), bills: formatNumber(bills[0]?.cant || 0).substring(1), balance: formatNumber((incomes[0]?.cant || 0) - (bills[0]?.cant || 0)), total: formatNumber((totalIncomes[0]?.cant || 0) - (totalBills[0]?.cant || 0))
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    getCharts = async (req, res) => {
        try {
            const type = req.query.type || 'general';
            const year = req.query.year || new Date().getFullYear();
            let categories = [];
            let month = [];

            if (type !== 'general') {
                month = await this.container.getTransactionsByCategoryMonth(req.user.id, type, year);
                categories = await this.container.getDataForChart(req.user.id, type, year);
            } else {
                month = await this.container.getIncomesAndExpensesByMonth(req.user.id, year)
                categories = await this.container.getIncomeAndExpenses(req.user.id, year);
            }
            res.status(200).json({
                categories,
                month,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            res.status(200).json(await this.container.getUserMovements(req.user.id))
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    save = async (req, res) => {
        try {
            const category = await this.categoryContainer.getById(req.body.category)
            if (!category) return res.status(404).json({ error: "No existe esa categoria" })
            if (category.user.toString() !== req.user.id) return res.status(404).json({ error: "No tiene permiso para crear algo en esa categoria" })
            if (req.user.id === req.body.user) {
                let date = new Date()
                if (req.body.date) {
                    date = req.body.date
                }
                res.status(201).json(await this.container.save({ ...req.body, date: date }))

            } else {
                res.status(404).json({ error: "Solo puede crear ganancias para su usuario" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    getById = async (req, res) => {
        try {
            const transaccion = await this.container.getById(req.params.id)
            if (!transaccion) return res.status(404).json({ error: "No existe esa transaccion" })
            if (req.user.id === transaccion.user.toString()) {
                res.status(200).json(transaccion)
            } else {
                res.status(404).json({ error: "No tiene autorizacion para ver esta transaccion" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }



    updateById = async (req, res) => {
        try {
            const transaccion = await this.container.getById(req.params.id)
            if (!transaccion) return res.status(404).json({ error: "No existe esta transaccion" })
            if (req.user.id === transaccion.user.toString()) {
                res.status(200).json(await this.container.updateById(req.params.id, req.body))
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar esta transaccion" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    deleteById = async (req, res) => {
        try {
            const transaccion = await this.container.getById(req.params.id)
            if (!transaccion) return res.status(404).json({ error: "No existe esta transaccion" })
            if (req.user.id === transaccion.user.toString()) {
                res.status(200).json({ data: await this.container.deleteById(req.params.id) })
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar esta transaccion" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }
}



export default ControllerTransaction