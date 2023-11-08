import express from 'express';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import * as dotenv from 'dotenv'

import morganBody from 'morgan-body';
import bodyParser from 'body-parser';

dotenv.config()

// Initializations
const app = express();
const server = http.createServer(app);

const MAX_PUNTOS = 20;

const socketIoServer = new SocketServer(server);

//TODO agregar descripcion
const rooms = [
    {name: 'Sala 1',  users: []},
    {name: 'Sala 2', users: []},
    {name: 'Sala 3', users: []},
]
    

let users = [];

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173','http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

morganBody(app);

//Routes
app.get('/api/rooms', (req, res) => {
    res.status(200).json(rooms);
});

app.post('/api/rooms', (req, res) => {
    const {room} = req.body;
    const {name, users} = room;
    rooms.push({name, users});
    res.status(200).json(rooms);
});


socketIoServer.on('connection', (socket) => {
    
    socket.on('join server', (userName) => {
        const socketIdExiste = !!users.find(user => user.id === socket.id);

        if(!socketIdExiste){
            const user = { userName, id: socket.id, puntaje: 0, winner: false };
            console.log('new user', user);
            users.push(user);
    
            //Respuesta para el cliente que lanzo el evento
            socket.emit('new user', {user, users} );
    
            //Respuesta para los demas
            socket.broadcast.emit('new user', {user, users});
        }
    })

    socket.on('select', (date) => {
        console.log(`Election ${date} received from ${ socket.id.slice(8)}`);
        election(socket, date);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        users = users.filter(user => user.id !== socket.id);
        socket.broadcast.emit('user disconnected', users );
    })

    socket.on('nuevoPunto', (id)=>{
        console.log('Alguien hizo un punto')
        console.log({id, users})
        const user = users.find(user  => user.id == id)
        user.puntaje += 1
      
         //Respuesta para el cliente que lanzo el evento
         socket.emit('actualizar puntos', users );
    
         //Respuesta para los demas
         socket.broadcast.emit('actualizar puntos', users);

        if(user.puntaje == MAX_PUNTOS){
            user.winner = true;
            socket.emit('ganador',users); 
            socket.broadcast.emit('ganador',users);
        }
    })

    socket.on('volver a jugar',() => {
        users.forEach(user => {
            user.puntaje = 0;
            user.winner = false;
        })
        
        socket.emit('actualizar puntos', users );
        socket.broadcast.emit('actualizar puntos', users);

        socket.broadcast.emit('ir a game');
    })
});
 

server.listen(process.env.PORT);
console.log(`server on port ${process.env.PORT}`);
