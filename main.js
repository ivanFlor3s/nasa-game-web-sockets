import * as dotenv from 'dotenv';
import { Server } from './src/core/server';


dotenv.config()

const server = new Server();
server.listen()

