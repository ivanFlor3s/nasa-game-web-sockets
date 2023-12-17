import { Game } from "../models/game.js";
import { Score } from "../models/score.js";

export class GameApi {
  create = async ({users}) => {
    try {
      const currentGame = await Game.findOne({ where: { inProgress: true } });
      const scores = users.map(user => ({UserId: user.userId, GameId: currentGame.dataValues.id, score: user.puntaje }))
      await Score.bulkCreate(scores)
      return data;
    } catch (error) {
      return error;
    }
  };

  closeCurrentGame = async () => {
    try {
      const currentGame = await Game.findOne({ where: { inProgress: true } });
      currentGame.inProgress = false;
      await currentGame.save();
      return currentGame;
    } catch (error) {
      return error;
    }
  }
  
   
}

