import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    type: 'development',
    port: 3000,
    mongodb: process.env.mongo
  },
  production: {
    type: 'production',
    port: 3000,
    mongodb: 'mongodb+srv://judek9392:%3CBelieve81726354%40@cluster0.ujuty2g.mongodb.net/ecole'
  }
};
