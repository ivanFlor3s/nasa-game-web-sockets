import { User } from "../models/user.js";
import { Game } from "../models/game.js";
import { Score } from "../models/score.js";


export const configRelations = () => {
    User.belongsToMany(Game, { through: Score });
    Game.belongsToMany(User, { through: Score });

}