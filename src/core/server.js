import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { router as userRouter } from '../routes/users.routes.js';
import { router as gameRouter } from '../routes/games.routes.js';
import { router as authRouter } from '../routes/auth.routes.js';

// import { sequelize } from './config/config-db.js';
// import { configRelations } from './models/relations.js';

//ROUTES

const MAX_PUNTOS = 5;
const BASE_API_URL = '/api/v1';

export class Server {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.routes = {
            users: `${BASE_API_URL}/users`,
            games: `${BASE_API_URL}/games`,
            auth: `${BASE_API_URL}/auth`,
        };

        //Connect to db
        // this.conectDb();

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

    configSocket(server) {
        this.io = new SocketServer(server);

        this.io.on('connection', (socket) => {
            let users = [];
            socket.on('join server', (userName) => {
                const socketIdExiste = !!users.find((user) => user.id === socket.id);

                if (!socketIdExiste) {
                    const user = { userName, id: socket.id, puntaje: 0, winner: false };
                    console.log('new user', user);
                    users.push(user);

                    //Respuesta para el cliente que lanzo el evento
                    socket.emit('new user', { user, users });

                    //Respuesta para los demas
                    socket.broadcast.emit('new user', { user, users });
                }
            });

            socket.on('select', (date) => {
                console.log(`Election ${date} received from ${socket.id.slice(8)}`);
                election(socket, date);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
                users = users.filter((user) => user.id !== socket.id);
                socket.broadcast.emit('user disconnected', users);
            });

            socket.on('nuevoPunto', (id) => {
                console.log('Alguien hizo un punto');
                console.log({ id, users });
                const user = users.find((user) => user.id == id);
                user.puntaje += 1;

                //Respuesta para el cliente que lanzo el evento
                socket.emit('actualizar puntos', users);

                //Respuesta para los demas
                socket.broadcast.emit('actualizar puntos', users);

                if (user.puntaje == MAX_PUNTOS) {
                    user.winner = true;
                    socket.emit('ganador', users);
                    socket.broadcast.emit('ganador', users);
                }
            });

            socket.on('volver a jugar', () => {
                users.forEach((user) => {
                    user.puntaje = 0;
                    user.winner = false;
                });

                socket.emit('actualizar puntos', users);
                socket.broadcast.emit('actualizar puntos', users);

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
