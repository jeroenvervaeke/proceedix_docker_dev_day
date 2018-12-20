using System;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client.Events;

namespace slackBot
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var exchangeValue = "open-door";
            var factory = new ConnectionFactory() {HostName = "rabbitmq-daemon", Password = "demo", UserName = "admin"};
            var max_try = 15;

            using (var connection = await TryMakeConnection(factory, max_try))

            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: exchangeValue, type: "fanout");

                var queueName = channel.QueueDeclare().QueueName;
                channel.QueueBind(queue: queueName,
                    exchange: exchangeValue,
                    routingKey: "");

                Console.WriteLine(" [*] Waiting for logs.");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body;
                    var message = Encoding.UTF8.GetString(body);
                    Console.WriteLine(" [x] {0}", message);
                };
                channel.BasicConsume(queue: queueName,
                    autoAck: true,
                    consumer: consumer);

                Console.WriteLine(" Press [enter] to exit.");
                Console.ReadLine();
            }
        }

        public static async Task<IConnection> TryMakeConnection(ConnectionFactory factory, int maxRetries)
        {
            var countTries=0;
            while (true)
            {
                try
                {
                    return factory.CreateConnection();
                }
                catch
                {
                    if (++countTries == maxRetries)
                        throw;
                    await Task.Delay(3000);
                }
            }
        }
    }
}
