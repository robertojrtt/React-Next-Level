import knex from 'knex'
require('dotenv/config');

const connection = knex({
    client: process.env.CLINTE,
    connection: {
      host : process.env.HOST,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE
    }
});

export default connection;