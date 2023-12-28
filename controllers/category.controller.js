class ControllerCategory {

    constructor(container) {
        this.container = container
    }

    getAll = async (req, res) => {
        try {
            res.status(200).json(await this.container.getUserCategories(req.user.id))
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    save = async (req, res) => {
        try {
            if(req.user.id === req.body.user_id){
                res.status(201).json(await this.container.save(req.body))
            }else{
                res.status(404).json({ error: "Solo puede crear categorias para su usuario" })
            }
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }

    getById = async (req, res) => {
        try {
            const category = await this.container.getById(req.params.id)
            if(!category) return res.status(404).json({ error: "No existe esa categoria" })
            if (req.user.id === category.user_id){
                res.status(200).json(category)
            }else{
                res.status(404).json({ error: "No tiene autorizacion para ver esta categoria" })
            }
    } catch(error) {
        res.status(404).json({ error: `${error}` })
    }
}



updateById = async (req, res) => {
    try {
        const category = await this.container.getById(req.params.id)
        if(!category) return res.status(404).json({ error: "No existe esa categoria" })
        if (req.user.id === category.user_id){
            res.status(200).json(await this.container.updateById(req.params.id, req.body))
        }else{
            res.status(404).json({ error: "No tiene autorizacion para actualizar esta categoria" })
        }
    } catch (error) {
        res.status(404).json({ error: `${error}` })
    }
}

deleteById = async (req, res) => {
    try {
        const category = await this.container.getById(req.params.id)
        if(!category) return res.status(404).json({ error: "No existe esa categoria" })
        if (req.user.id === category.user_id){
            res.status(200).json({ data: await this.container.deleteById(req.params.id) })
        }else{
            res.status(404).json({ error: "No tiene autorizacion para actualizar esta categoria" })
        }
    } catch (error) {
        res.status(404).json({ error: `${error}` })
    }
}
}



export default ControllerCategory