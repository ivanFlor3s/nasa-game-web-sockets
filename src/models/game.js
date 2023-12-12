import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection/sequelize-config.js';
// import bcrypt from 'bcrypt';

export class Game extends Model {}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        }
    },
    { timestamps: true, sequelize: sequelize, modelName: 'Game' }
);
