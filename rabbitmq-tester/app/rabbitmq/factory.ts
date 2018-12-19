import { connect, Connection, Channel } from 'amqplib';
import { Client } from './client';

export const tryCreateClient = async (hostname: string, username: string, password: string, exchange_name: string, max_retries: number, timeout: number): Promise<Client> => {
  console.debug(`Attempting to connect`);
  const ampq = await tryConnect(hostname, username, password, max_retries, timeout);
  console.debug(`Connected`);

  console.debug(`Attempting to create channel`);
  const channel = await ampq.createChannel();
  console.log(`Channel created`);

  console.debug(`Asserting if exchange '${exchange_name}' exists`);
  channel.assertExchange(exchange_name, 'fanout', { durable: false });
  console.debug(`${exchange_name} exists!`);

  return new Client(ampq, channel, exchange_name);
};

async function tryConnect(hostname: string, username: string, password: string, max_retries: number, timeout: number): Promise<Connection> {
  let retries = 0;

  while (true) {
    try {
      return await connect({ hostname, username, password });
    } catch (err) {
      console.log(`[${retries}] Connecting failed, retrying`);
      if (++retries === max_retries) {
        throw err;
      }
      await sleep(timeout);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
