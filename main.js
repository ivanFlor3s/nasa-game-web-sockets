import * as dotenv from 'dotenv';
import { Server } from './src/core/server.js';


dotenv.config()

console.log(process.env.DB_PORT)

const server = new Server();
server.listen()

