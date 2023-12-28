import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'
class ControllerAuth {

    constructor(container) {
        this.container = container
    }

    signup = async (req, res) => {
        try {
            const { email, password, username } = req.body
            const userFound = await this.container.getByEmail(email)
            if (userFound) return res.status(400).json(["Ya esxiste un usuario registrado con este email"])
            const newUser = new this.container.model();
            newUser.email = email;
            newUser.username = username
            newUser.password = newUser.encryptPassword(password);
            const userSaved = await newUser.save()
            res.status(200).json({
                user: {
                    id: userSaved._id,
                    username: userSaved.username,
                    email: userSaved.email,
                    createdAt: userSaved.createdAt,
                    updatedAt: userSaved.updatedAt
                }
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message })
        }
    }

    signin = async (req, res) => {
        try {
            const { email, password } = req.body
            const userFound = await this.container.getByEmail(email)
            if (!userFound) return res.status(400).json(["Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña e intenta nuevamente."])
            const isMatch = await userFound.comparePassword(password)
            if (!isMatch) return res.status(400).json(["Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña e intenta nuevamente2."])
            jwt.sign({ email, id: userFound._id }, TOKEN_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).status(200).json({
                    id: userFound._id,
                    email,
                    username: userFound.username
                });
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message })
        }
    }

    logout = async (req, res) => {
        try {
            res.cookie('token', '').status(200).json({message: "sesion cerrada"});
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message })
        }
    }

}



export default ControllerAuth