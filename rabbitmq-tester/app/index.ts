import { join } from 'path';

import { tryCreateClient } from './rabbitmq/factory';
import { OpenDoorMessage } from './rabbitmq/messages';
import { createAndStartServer } from './server/factory';

export const main = async (): Promise<void> => {
  const server = createAndStartServer(80);

  const client = await tryCreateClient('rabbitmq-daemon', 'admin', 'demo', 'open-door', 15, 1000);

  server.express.get('/', (_req, resp) => {
    resp.sendfile(join(__dirname, '..', 'static', 'index.html'));
  });

  server.io.on('connection', socket => {
    socket.on('open_door', _ => {
      console.log('on open_door');

      client.Publish<OpenDoorMessage>({
        type: 'open_door',
        payload: {
          office: '407',
          origin: 'rabbitmq-tester',
        },
      });
    });
  });

  client.Consume(message => {
    console.debug(`client.consume`);
    server.io.send(message);
  });
};
