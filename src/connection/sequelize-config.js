import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('nasa-game', 'postgres', 'awg1947', {
    dialect: process.env.DIALECT ?? 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: {
        acquire: process.env.POOL_ACQUIRE,
        idle: process.env.POOL_IDLE,
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });
