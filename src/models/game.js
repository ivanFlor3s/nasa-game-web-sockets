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
        },
        scoreMax: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        inProgress: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    { timestamps: true, sequelize: sequelize, modelName: 'Game' }
);
