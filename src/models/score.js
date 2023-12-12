import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection/sequelize-config.js';
// import bcrypt from 'bcrypt';

export class Score extends Model {}

Score.init(
    {
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        sequelize,
        modelName: 'Score',
        timestamps: true,
    }
);
