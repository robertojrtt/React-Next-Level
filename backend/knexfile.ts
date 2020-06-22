// Update with your config settings.
require('dotenv/config');

import path from 'path';
module.exports = {
  development: {
    client: process.env.CLINTE,
    connection: {
      host : process.env.HOST,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE
    },
    migrations: {
      directory: path.resolve(__dirname, 'src','database','migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src','database','seeds'),
    },
    useNullAsDefault:true,
  }
}