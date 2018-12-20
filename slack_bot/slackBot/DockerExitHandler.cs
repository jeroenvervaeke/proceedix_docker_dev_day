using System;
using System.Threading;

namespace slackBot
{
    public class DockerExitHandler
    {
	    private static readonly AutoResetEvent AutoResetEvent = new AutoResetEvent(false);

	    public static void Wait()
	    {
		    Console.CancelKeyPress += (o, e) =>
		    {
			    Console.WriteLine("Exiting");
			    AutoResetEvent.Set();
		    };

		    AutoResetEvent.WaitOne();
		}
	}
}
