import { Op, fn } from "sequelize";
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

export const getGamesPlayedMetric = async (req, res) => {
    try {

        const today = new Date()
        today.setHours(0,0,0,0)
        const todayLastMinute = new Date()
        todayLastMinute.setHours(23,59,59,999)


        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0,0,0,0)

        const yesterdayLastMinute = new Date(today)
        yesterdayLastMinute.setDate(yesterdayLastMinute.getDate() - 1)
        yesterdayLastMinute.setHours(23,59,59,999)

        const gamesYesterday = await Game.findAll({  
            where: { 
                [Op.and]: [
                    {inProgress: false}, 
                    {createdAt: {[Op.between]: [yesterday, yesterdayLastMinute]}} 
                ]  
            } 
        });

        const gamesToday = await Game.findAll({  
            where: { 
                [Op.and]: [
                    {inProgress: false}, 
                    {createdAt: {[Op.between]: [today, todayLastMinute]}} 
                ]  
            } 
        });

        res.status(200).send(new ApiResponse({gamesYesterday, gamesToday}, 'Se obtuvo la metrica de juegos jugados'));
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}