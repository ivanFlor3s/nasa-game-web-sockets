import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { router as userRouter } from '../routes/users.routes.js';
import { router as gameRouter } from '../routes/games.routes.js';
import { router as authRouter } from '../routes/auth.routes.js';

import { sequelize } from '../connection/sequelize-config.js';
import { configRelations } from '../config/db-relations.js';
// import { configRelations } from './models/relations.js';

//ROUTES

const MAX_PUNTOS = 5;
const BASE_API_URL = '/api/v1';

export class Server {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new SocketServer(this.server)

        this.routes = {
            users: `${BASE_API_URL}/users`,
            games: `${BASE_API_URL}/games`,
            auth: `${BASE_API_URL}/auth`,
        };

        //Connect to db
        this.conectDb();

        //MIDLEWARES
        this.middlewares();

        //RUTAS
        this.configRoutes();

        //SOCKET
        this.configSocket(this.server);
    }

    //Metodo que configura mis rutas
    configRoutes() {
        this.app.use(this.routes.users, userRouter);
        this.app.use(this.routes.games, gameRouter);
        this.app.use(this.routes.auth, authRouter);
    }

    async conectDb() {
        try {
            await sequelize.authenticate();
            configRelations();
            await sequelize.sync({ force: false, alter: true });
            console.log('Connected to database');
        } catch (error) {
            console.error('Unable to connect to the database');
            throw error;
        }
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        // Lectura y parse del body
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    configSocket() {
        let usersPlaying = [];
        this.io.on('connection', (socket) => {
            socket.on('userEnterApp', (email) => {
                console.log('userEnterApp');
                socket.emit('actualizar puntos', usersPlaying);
            });

            socket.on('join game', (userName) => {
                const socketIdExiste = !!usersPlaying.find((user) => user.id === socket.id);

                if (!socketIdExiste) {
                    const user = { userName, id: socket.id, puntaje: 0, winner: false };
                    console.log('new user', user);
                    usersPlaying.push(user);
                    console.log('users', usersPlaying.length);
                    //Respuesta para el cliente que lanzo el evento
                    socket.emit('new user', { user, users: usersPlaying });

                    //Respuesta para los demas
                    socket.broadcast.emit('new user', { user, users: usersPlaying });
                }
            });

            socket.on('select', (date) => {
                console.log(`Election ${date} received from ${socket.id.slice(8)}`);
                election(socket, date);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
                usersPlaying = usersPlaying.filter((user) => user.id !== socket.id);
                socket.broadcast.emit('user disconnected', usersPlaying);
            });

            socket.on('nuevoPunto', (id) => {
                console.log('Alguien hizo un punto');
                console.log({ id, users: usersPlaying });
                const user = usersPlaying.find((user) => user.id == id);
                user.puntaje += 1;

                //Respuesta para el cliente que lanzo el evento
                socket.emit('actualizar puntos', usersPlaying);

                //Respuesta para los demas
                socket.broadcast.emit('actualizar puntos', usersPlaying);

                if (user.puntaje >= MAX_PUNTOS) {
                    user.winner = true;
                    
                    socket.emit('ganador', usersPlaying);
                    socket.broadcast.emit('ganador', usersPlaying);
                }
            });

            socket.on('volver a jugar', () => {
                usersPlaying.forEach((user) => {
                    user.puntaje = 0;
                    user.winner = false;
                });

                socket.emit('actualizar puntos', usersPlaying);
                socket.broadcast.emit('actualizar puntos', usersPlaying);

                socket.broadcast.emit('ir a game');
            });
        });
    }

    listen() {
        this.server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
}
