class ControllerIncome {

    constructor(container, categoryContainer) {
        this.container = container
        this.categoryContainer = categoryContainer
    }

    getAll = async (req, res) => {
        try {
            res.status(200).json(await this.container.getUserIncome(req.user.id))
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    getCant = async (req, res) => {
        try {
            let cant = 0
            const incomes = await this.container.getUserIncomeCant(req.user.id)
            incomes.map(item => (
                cant += parseInt(item.amount)
            ))
            res.status(200).json(cant)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    save = async (req, res) => {
        try {
            const category = await this.categoryContainer.getById(req.body.category_id)
            if (!category) return res.status(404).json({ error: "No existe esa categoria" })
            if (category.user_id !== req.user.id) return res.status(404).json({ error: "No tiene permiso para crear algo en esa categoria" })
            if (req.user.id === req.body.user_id) {
                res.status(201).json(await this.container.save(req.body))
            } else {
                res.status(404).json({ error: "Solo puede crear ganancias para su usuario" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    getById = async (req, res) => {
        try {
            const spent = await this.container.getById(req.params.id)
            if (!spent) return res.status(404).json({ error: "No existe ese gasto" })
            if (req.user.id === spent.user_id) {
                res.status(200).json(spent)
            } else {
                res.status(404).json({ error: "No tiene autorizacion para ver ese gasto" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }



    updateById = async (req, res) => {
        try {
            const spent = await this.container.getById(req.params.id)
            if (!spent) return res.status(404).json({ error: "No existe ese gasto" })
            if (req.user.id === spent.user_id) {
                res.status(200).json(await this.container.updateById(req.params.id, req.body))
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar este gasto" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    deleteById = async (req, res) => {
        try {
            const spent = await this.container.getById(req.params.id)
            if (!spent) return res.status(404).json({ error: "No existe ese gasto" })
            if (req.user.id === spent.user_id) {
                res.status(200).json({ data: await this.container.deleteById(req.params.id) })
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar este gasto" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }
}



export default ControllerIncome