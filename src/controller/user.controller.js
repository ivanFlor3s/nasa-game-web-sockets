import { request, response } from 'express';
import { User } from '../models/user.js';
import { ApiResponse } from '../core/response.js';
import { Op } from 'sequelize';

export const updateUser = async (req = request, res = response) => {
    const userId = req.params.id;
    const { name, lastName, email } = req.body;
    try {
        await User.update({ name, lastName, email }, { where: { id: userId } });
        res.status(200).send(new ApiResponse({ name, lastName, email }, 'Se actualizo el usuario'));
    } catch (error) {
        console.log(error);
        res.status(500).send(new ApiResponse(null, error.message));
    }
};

export const getAll = (req = request, res = response) => {
    const { filter } = req.query;
    let promise = !!filter
        ? User.findAll({
              where: {
                  [Op.or]: [{ name: { [Op.iLike]: `%${filter}%` } }, { lastName: { [Op.iLike]: `%${filter}%` } }, { email: { [Op.iLike]: `%${filter}%` } }],
                  id: { [Op.ne]: req.usuario.id },
              },
          })
        : User.findAll({
                where: {
                    id: { [Op.ne]: req.usuario.id },
                },
        });

    promise
        .then((users) => {
            res.status(200).send(new ApiResponse(users, 'Se obtuvieron todos los usuarios'));
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(new ApiResponse(null, error.message));
        });
};

export const deleteUser = async (req = request, res = response) => {
    const userId = req.params.id;
    try {
        await User.destroy({ where: { id: userId } });
        res.status(200).send(new ApiResponse(null, 'Se elimino el usuario'));
    } catch (error) {
        console.log(error);
        res.status(500).send(new ApiResponse(null, error.message));
    }
};

export const changeRol = async (req = request, res = response) => {
    const userId = req.params.id;
    const { role } = req.body;
    try {
        await User.update({ role }, { where: { id: userId } });
        res.status(200).send(new ApiResponse(null, 'Se cambio el rol del usuario'));
    } catch (error) {
        console.log(error);
        res.status(500).send(new ApiResponse(null, error.message));
    }
}