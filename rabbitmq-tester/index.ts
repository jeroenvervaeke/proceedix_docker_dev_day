import { connect, Connection } from 'amqplib';

async function main() {
  try {
  const url = 'amqp://rabbitmq-deamon';
  console.log(`Attempting to connect to: '${url}'`);
  
  const ampq = await tryConnect(url);
  console.log(`Connected!`);

  const channel = await ampq.createChannel();
  console.log(`Channel created`);

  const queue_name = 'open-door-queue';
  channel.assertQueue(queue_name, {durable: true});

  channel.sendToQueue(queue_name, new Buffer('it works!'), { persistent: true });
  console.log(`Message sent to ${queue_name}`);

  await channel.close();
  
  await ampq.close();
  } catch(err) {
    console.error(err);
  }
}

function sleep(ms: number) : Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryConnect(url: string): Promise<Connection> { 
  let retries = 0;

  while(true) {
    try {
      return await connect(url);
    } catch (err) {
      console.log(`[${retries}] Connecting failed, retrying`)
      if (++retries === 15) { throw err; }
      await sleep(1000);
    }
  }
}

main();