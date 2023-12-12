import { request, response } from "express";
import { User } from "../models/user.js";
import { ApiResponse } from "../core/response.js";

export const updateUser = async (req= request, res = response) => {
    const userId = req.params.id;
    const {name, lastName, email} = req.body;
    try {
        await User.update({name, lastName, email}, {where: {id: userId}})
        res.status(200).send(new ApiResponse({name, lastName, email}, 'Se actualizo el usuario'))
    } catch (error) {
        console.log(error)
        res.status(500).send(new ApiResponse(null, error.message))
    }
    
}