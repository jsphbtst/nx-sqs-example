# NX Example with AWS SQS

This repository outlines an example of using NX to create a monorepo that houses code for your `producer` and `consumer` codebases that use AWS SQS. Moreover, it also shows that code can be further abstracted through the use of `libs`, where we house our repo-wide constants (`libs/app-constants`) and our class util for AWS SQS (`libs/sqs-service`).

This repo example does not include deployment instructions, as I assume you would know how to run the `build` command and work with the output of that in your favor come deployment. Moreover, deployment comes in many forms, so I'd rather not prescribe one here.

## Commands

To run the `producer` locally, just run this in your terminal:

```
npx nx run producer:serve
```

Similar pattern for `consumer`:

```
npx nx run consumer:serve
```

## Screenshots

Terminal outputs from both the producer and consumer codes:

![producer](./docs/producer.png)
![consumer](./docs/consumer.png)
