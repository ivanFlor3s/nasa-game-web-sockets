import { request, response } from 'express';
import { ApiResponse } from '../core/response.js';

export const isAdmin = async (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).send(new ApiResponse(null, 'No se encontro el usuario en la request'));
    }
    req.usuario.isAdmin ? next() : res.status(401).send(new ApiResponse(null, 'No tiene permisos de ADMIN para realizar esta accion'));
};
