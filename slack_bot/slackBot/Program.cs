using System;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client.Events;

namespace slackBot
{
	public static class Program
	{
		private const string ExchangeName = "open-door";
		private const int MaxTry = 15;

		public static async Task Main(string[] args)
		{
			var factory = new ConnectionFactory() { HostName = "rabbitmq-daemon", Password = "demo", UserName = "admin" };

			using (var connection = await TryMakeConnection(factory, MaxTry))

			using (var channel = connection.CreateModel())
			{
				channel.ExchangeDeclare(ExchangeName, "fanout");

				var queueName = channel.QueueDeclare().QueueName;
				channel.QueueBind(queueName, ExchangeName, "");

				Console.WriteLine(" [*] Waiting for messages.");

				var consumer = new EventingBasicConsumer(channel);
				consumer.Received += (model, ea) =>
				{
					var body = ea.Body;
					var message = Encoding.UTF8.GetString(body);
					Console.WriteLine(" [x] {0}", message);
				};
				channel.BasicConsume(queueName, true, consumer);

				DockerExitHandler.Wait();
			}
		}

		private static async Task<IConnection> TryMakeConnection(IConnectionFactory factory, int maxRetries)
		{
			var countTries = 0;
			while (true)
			{
				try
				{
					return factory.CreateConnection();
				}
				catch
				{
					if (++countTries == maxRetries) { throw; }
					await Task.Delay(3000);
				}
			}
		}
	}
}
