require('dotenv/config');

module.exports = {

  development: {
    client: 'pg',
    version: '12.2',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    migrations:{
      directory : './src/database/migrations'
    }
  },

  production: {
    client: 'oracledb',
    connection: {
      host : process.env.DB_HOST_P,
      user : process.env.DB_USER_P,
      password : process.env.DB_PASS_P,
      database : process.env.DB_NAME_P,
      port: process.env.DB_PORT_P
    },
    migrations:{
      directory : './src/database/migrations'
    }
  },


};
