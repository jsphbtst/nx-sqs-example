import AwsSqsInstance from '@sqs-producer-consumer/sqs-service';

async function main(): Promise<void> {
  AwsSqsInstance.getInstance();

  const message = JSON.stringify({ message: 'Hello, world!' });
  await AwsSqsInstance.sendMessageToQueue(message);
}

main();
