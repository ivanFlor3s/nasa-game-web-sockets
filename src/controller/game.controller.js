import { ApiResponse } from "../core/response.js";
import { Game } from "../models/game.js";

export const createGame = async (req, res) => {
    try {
        const { name, scoreMax } = req.body;
        const gameInProgress = await Game.findOne({ where: { inProgress: true } });
        
        if (gameInProgress) {
            res.status(500).send(new ApiResponse(null, 'Ya hay un juego en progreso'));
            return;
        }

        const game = await Game.create({ name, scoreMax , inProgress: true});
        res.status(201).send(new ApiResponse(game, 'Se creo el juego'));
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

export const getCurrentGame = async (req, res) => {
    try {
        const game = await Game.findOne({ where: { inProgress: true } });
        res.status(200).send(new ApiResponse(game, 'Se obtuvo el juego actual'));
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}