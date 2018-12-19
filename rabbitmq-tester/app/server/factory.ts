import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import socketIo, { Server as SocketIoServer } from 'socket.io';

export interface Server {
  express: Express;
  http: HttpServer;
  io: SocketIoServer;
}

export const createAndStartServer = (port: number): Server => {
  const app = express();
  const http = new HttpServer(app);
  const io = socketIo(http);

  http.listen(port);

  return {
    express: app,
    http,
    io,
  };
};
