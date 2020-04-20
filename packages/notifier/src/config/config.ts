export const configuration = {
  port: parseInt(process.env.NOTIFIER_PORT, 10) | 3001,
  kafka: {
    host: process.env.NOTIFIER_KAFKA_HOST || 'localhost',
    port: parseInt(process.env.NOTIFIER_KAFKA_PORT, 10) || 9092,
  },
  mailer: {
    host: process.env.NOTIFIER_MAILER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.NOTIFIER_MAILER_PORT, 10) || 587,
    secure: process.env.NOTIFIER_MAILER_SECURE || false,
    username: process.env.NOTIFIER_MAILER_USERNAME || '',
    password: process.env.NOTIFIER_MAILER_PASSWORD || '',
    from: process.env.NOTIFIER_MAILER_FROM || 'TODO app',
  }
};
