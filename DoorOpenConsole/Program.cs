using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading;

namespace DoorOpenConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello from the other sideeee!");

            var factory = new ConnectionFactory() { HostName = "127.0.0.1", Port = 8081, UserName = "admin", Password = "demo", RequestedConnectionTimeout = 1000 };
            while(true)
            {
                try
                {
                    using (var connection = factory.CreateConnection())
                    using (var channel = connection.CreateModel())
                    {
                        channel.QueueDeclare(queue: "rabbitmq-deamon",
                                             durable: false,
                                             exclusive: false,
                                             autoDelete: false,
                                             arguments: null);

                        var consumer = new EventingBasicConsumer(channel);
                        consumer.Received += (model, ea) =>
                        {
                            var body = ea.Body;
                            var message = Encoding.UTF8.GetString(body);
                            Console.WriteLine(" [x] Received {0}", message);
                        };
                        channel.BasicConsume(queue: "rabbitmq-deamon",
                                             autoAck: true,
                                             consumer: consumer);

                    }
                }
                catch
                {
                    Console.WriteLine("Connection failed. Attempting retry!");
                    Thread.Sleep(5000);
                }
            }
        }
    }
}
