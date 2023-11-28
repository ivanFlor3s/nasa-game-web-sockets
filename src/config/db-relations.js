import { User } from "../models/user.js";
import { Game } from "../models/game.js";


export const configRelations = () => {


    User.belongsToMany(Game, { through: 'User_Games' });
    Game.belongsToMany(User, { through: 'User_Games' });

}