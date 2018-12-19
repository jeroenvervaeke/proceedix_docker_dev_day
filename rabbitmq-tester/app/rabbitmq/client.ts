import { Connection, Channel } from 'amqplib';
import { AllMessages, isValidMessage } from './messages';

export class Client {
  private readonly routing_key = '';

  public constructor(private readonly connection: Connection, private readonly channel: Channel, private readonly exchange_name: string) {}

  public Publish = <T>(message: T): void => {
    this.channel.publish(this.exchange_name, this.routing_key, new Buffer(JSON.stringify(message)));
  };

  public Consume = async (subscriber: (message: AllMessages) => void): Promise<void> => {
    const queue = await this.channel.assertQueue('rabbitmq-tester', {
      exclusive: true,
    });
    this.channel.bindQueue(queue.queue, this.exchange_name, this.routing_key);

    this.channel.consume(queue.queue, message => {
      if (message == null) {
        return;
      }

      const messageString = message.content.toString();

      try {
        const obj = JSON.parse(messageString);

        if (isValidMessage(obj)) {
          subscriber(obj);
        } else {
          console.warn(`invalid message`);
          console.warn(obj);
        }
      } catch {
        console.warn(`invalid json: ${messageString}`);
      }
    });
  };

  public Close = async (): Promise<void> => {
    await this.channel.close();
    await this.connection.close();
  };
}
