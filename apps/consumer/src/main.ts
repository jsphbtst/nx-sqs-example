import AwsSqsInstance from '@sqs-producer-consumer/sqs-service';

async function main(): Promise<void> {
  AwsSqsInstance.getInstance();
  const messages = await AwsSqsInstance.pollMessagesFromQueue();
  console.log('Received messages', messages);

  for (const message of messages) {
    const body = message.Body;
    const parsedBody = JSON.parse(body);
    console.log('parsedBody', parsedBody);

    await AwsSqsInstance.deleteMessageFromQueue(message.ReceiptHandle);
  }
}

console.log('Running consumer...');
main();
