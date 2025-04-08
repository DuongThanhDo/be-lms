import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class CommentsGateway {
    @WebSocketServer()
    server: Server;
  
    sendNewComment(comment: any) {
      this.server.emit('new-comment', comment);
    }
  }
  