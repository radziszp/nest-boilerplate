export const configuration = {
  port: parseInt(process.env.NOTIFIER_PORT, 10) | 3001,
  kafka: {
    host: process.env.NOTIFIER_KAFKA_HOST || 'localhost',
    port: parseInt(process.env.NOTIFIER_KAFKA_PORT, 10) || 9092,
  }
};
