class ControllerGoal {

    constructor(container, containerCategory, containerTransaction) {
        this.container = container
        this.containerCategory = containerCategory
        this.containerTransaction = containerTransaction
    }

    getAll = async (req, res) => {
        try {
            res.status(200).json(await this.container.getUserData(req.user.id))
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }


    getById = async (req, res) => {
        try {
            const goal = await this.container.getById(req.params.id)
            if (!goal) return res.status(404).json({ error: "No existe esta meta" })
            if (req.user.id === goal.user.toString()) {
                res.status(200).json(goal)
            } else {
                res.status(404).json({ error: "No tiene autorizacion para ver esta meta" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    save = async (req, res) => {
        try {
            if (req.user.id === req.body.user) {
                const category = await this.containerCategory.getByName(req.body.user, req.body.category)
                let date = new Date()
                if (req.body.date) {
                    date = req.body.date
                }
                if (category.length !== 0) return res.status(404).json({ error: "Ya existe una categoria o meta con ese nombre, intente otro." })
                if (date > new Date(req.body.deadline)) return res.status(404).json({ error: "No puede crear una meta con esas caracteristicas" })
                const categorySaved = await this.containerCategory.save({ user: req.body.user, name: req.body.category, type: "bill" })
                res.status(201).json(await this.container.save({ user: req.body.user, category: categorySaved._id, deadline: new Date(req.body.deadline), date: date, amount: req.body.amount }))
            } else {
                res.status(404).json({ error: "Solo puede crear ganancias para su usuario" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }


    updateById = async (req, res) => {
        try {
            const goal = await this.container.getById(req.params.id)
            if (!goal) return res.status(404).json({ error: "No existe esa meta" })
            if (req.user.id === goal.user.toString()) {
                if (req.body.category) {
                    await this.containerCategory.updateById(goal.category, { name: req.body.category })
                }
                res.status(200).json(await this.container.updateById(req.params.id, { ...req.body, category: goal.category }))
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar esta meta" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    deleteById = async (req, res) => {
        try {
            const goal = await this.container.getById(req.params.id)
            if (!goal) return res.status(404).json({ error: "No existe esta meta" })
            if (req.user.id === goal.user.toString()) {
                await this.containerCategory.deleteCategory(req.user, goal.category)
                res.status(200).json({ data: await this.container.deleteById(req.params.id) })
            } else {
                res.status(404).json({ error: "No tiene autorizacion para actualizar esta transaccion" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }
}



export default ControllerGoal