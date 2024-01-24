import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'
class ControllerAuth {

    constructor(container, containerCategory) {
        this.container = container
        this.containerCategory = containerCategory
    }

    register = async (req, res) => {
        try {
            const { email, password, firstname, lastname } = req.body
            const userFound = await this.container.getByEmail(email)
            if (userFound) return res.status(400).json(["Ya esxiste un usuario registrado con este email"])
            const newUser = new this.container.model();
            newUser.email = email;
            newUser.firstname = firstname
            newUser.lastname = lastname
            newUser.password = newUser.encryptPassword(password);
            const userSaved = await newUser.save()
            await this.containerCategory.save({ user: userSaved._id, name: "Sin categorizar", type: "income", color: '#909090' })
            await this.containerCategory.save({ user: userSaved._id, name: "Sin categorizar", type: "bill", color: '#909090' })
            jwt.sign({ email: userSaved.email, id: userSaved._id }, TOKEN_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token: token,
                    user: {
                        id: userSaved._id,
                        email: userSaved.email,
                        firstname,
                        lastname,
                    }
                });
            });
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body
            const userFound = await this.container.getByEmail(email)
            if (!userFound) return res.status(400).json(["Credenciales incorrectas. Por favor, verifica tu email y contraseña e intenta nuevamente."])
            const isMatch = await userFound.comparePassword(password)
            if (!isMatch) return res.status(400).json(["Credenciales incorrectas. Por favor, verifica tu email y contraseña e intenta nuevamente2."])
            jwt.sign({ email, id: userFound._id }, TOKEN_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token: token,
                    user: {
                        id: userFound._id,
                        email,
                        firstname: userFound.firstname,
                        lastname: userFound.lastname,
                    }
                });
            });
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        try {
            console.log(req.user);
            const userFound = await this.container.getById(req.user.id)
            if (!userFound) return res.status(404).json({ error: "No existe ese usuario" })
            res.status(200).json(await this.container.updateById(req.user.id, req.body))
            // res.status(200).json(userFound)
        } catch (error) {
            res.status(404).json({ error: `${error}` })
        }
    }
}



export default ControllerAuth