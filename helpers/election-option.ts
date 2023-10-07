import { Socket } from "socket.io";

export const election = (socket:Socket, option: number) => {
    const log = `Election ${option} received from ${ socket.id.slice(8)}`;
    socket.broadcast.emit('Election', log);
}