import express from 'express';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import morgan from 'morgan';
import http from 'http';
import * as dotenv from 'dotenv'

import { election } from './helpers/election-option';

dotenv.config()

// Initializations
const app = express();
const server = http.createServer(app);

const socketIoServer = new SocketServer(server, {
    // cors: {
    //   origin: "http://localhost:3000",
    // },
});

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

socketIoServer.on('connection', (socket) => {
    
    console.log('New connection', socket.id);

    socket.on('saludo', (body) => {
        console.log('Message received', body);
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(8),
        });
    });

    socket.on('election', (option) => {
        console.log(`Election ${option} received from ${ socket.id.slice(8)}`);
        election(socket, option);
    })

});


server.listen(process.env.PORT);
console.log(`server on port ${process.env.PORT}`);
