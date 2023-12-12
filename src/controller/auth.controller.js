import { response, request } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { ApiResponse } from '../core/response.js';
import { generarJWT } from '../utils/generate-jwt.js';

export const register = async (req = request, res = response) => {
    let { name, lastName, email, password } = req.body;
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    try {
        //CREAR USUARIO
        const user = await User.create({ name, lastName, email, password });
        res.status(201).send(new ApiResponse(user, 'Se creo el usuario'));
    } catch (error) {
        console.log(error);
        res.status(500).send(new ApiResponse(null, error.message));
    }
};

export const login = async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).send(new ApiResponse(null, 'No se encontro el usuario'));
        } else {
            const validate = await bcrypt.compare(password, user.password);
            if (!validate) {
                res.status(404).send(new ApiResponse(null, 'Contraseña incorrecta'));
            } else {
                const {id, name, lastName, email, role} = user;
                const token = await generarJWT({id, name, lastName, email});
                res.status(200).send(new ApiResponse({token, user: {id, name, lastName, email, role}  }, 'Se logueo el usuario'));
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(new ApiResponse(null, error.message));
    }
};
