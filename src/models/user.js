import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection/sequelize-config.js';
// import bcrypt from 'bcrypt';

export class User extends Model {
    // validatePassword = async (myPlaintextPassword) => {
    //   const validate = await bcrypt.compare(myPlaintextPassword, this.password);
    //   return validate;
    // };
    //   validatePassword = async (myPlaintextPassword) => {
    //     const validate = await bcrypt.hash(myPlaintextPassword, this.salt);
    //     return validate===this.password
    //   };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'USER'),
            defaultValue: 'USER',
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Tiene que tener formato de email',
                },
                notEmpty: {
                    msg: 'no puede estar vacio',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: sequelize,
        modelName: 'User',
        timestamps: true,
        paranoid: true,
    }
);
