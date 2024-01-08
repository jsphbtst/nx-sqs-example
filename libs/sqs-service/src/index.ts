import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import {
  CONSUMER_MAX_NUMBER_OF_MESSAGES,
  CONSUMER_WAIT_TIME_IN_SECONDS,
} from '@sqs-producer-consumer/app-constants';

import type { SendMessageCommandInput, Message } from '@aws-sdk/client-sqs';

class AwsSqsInstance {
  private static instance: SQSClient;
  private static sqsUrl: string;

  static getInstance(): SQSClient {
    if (!AwsSqsInstance?.instance) {
      AwsSqsInstance.instance = AwsSqsInstance.createInstance();
    }

    return AwsSqsInstance.instance;
  }

  private static createInstance(): SQSClient {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_SQS_URL
    ) {
      throw new Error('AWS credentials are not set in environment variables');
    }

    AwsSqsInstance.sqsUrl = process.env.AWS_SQS_URL;

    return new SQSClient({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  static async sendMessageToQueue(
    body: SendMessageCommandInput['MessageBody']
  ): Promise<void> {
    if (!AwsSqsInstance?.instance) {
      AwsSqsInstance.getInstance();
    }

    try {
      const command = new SendMessageCommand({
        MessageBody: body,
        QueueUrl: AwsSqsInstance.sqsUrl,
      });
      const response = await AwsSqsInstance.instance.send(command);
      console.log('response', response);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Something went wrong';
      console.error(error);
    }
  }

  static async pollMessagesFromQueue(): Promise<Message[]> {
    if (!AwsSqsInstance?.instance) {
      AwsSqsInstance.getInstance();
    }

    try {
      const command = new ReceiveMessageCommand({
        MaxNumberOfMessages: CONSUMER_MAX_NUMBER_OF_MESSAGES,
        QueueUrl: AwsSqsInstance.sqsUrl,
        WaitTimeSeconds: CONSUMER_WAIT_TIME_IN_SECONDS,
        MessageAttributeNames: ['All'],
      });
      const response = await AwsSqsInstance.instance.send(command);
      return response.Messages;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Something went wrong';
      console.error(error);
    }
  }

  static async deleteMessageFromQueue(receiptHandle: string): Promise<void> {
    if (!AwsSqsInstance?.instance) {
      AwsSqsInstance.getInstance();
    }

    try {
      const command = new DeleteMessageCommand({
        QueueUrl: AwsSqsInstance.sqsUrl,
        ReceiptHandle: receiptHandle,
      });
      const response = await AwsSqsInstance.instance.send(command);
      console.log('Successfully deleted message queue', response);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Something went wrong';
      console.error(error);
    }
  }
}

export default AwsSqsInstance;
