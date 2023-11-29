import { request, response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.js";
import { ApiResponse } from "../core/response.js";

export const validarJwt = async (req = request, res = response, next) =>{

    let token = req.headers['x-token'] || req.headers['x-access-token'] || req.headers['authorization']; 


    if(!token){
        return res.status(401).json(new ApiResponse(null, 'No hay token en la peticion'))
    }

    token = token.replace(/^Bearer\s+/, "");

    try {

        //Obtengo el uid del payload
        const {id} = jwt.verify(token, process.env.SECRET_KEY)

        //Leer el usuario que corresponde al uid
        const usuario = await User.findByPk(id)
        
        
        if(!usuario){
            return res.status(401).json(new ApiResponse(null, 'Token no valido - usuario no existe en DB'))
        }

        req.usuario = usuario

        //Continuo con el siguiente middleware
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json(new ApiResponse(null, error.message))
    }
}
