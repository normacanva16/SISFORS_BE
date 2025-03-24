require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: '123456789',
    database: 'db_sisfors',
    host: '127.0.0.1',
  dialect: 'postgres',
    timezone: '+07:00',
    port: '5432',
    //migrationStorageTableSchema: "public",
    //schema: process.env.DB_SCHEMA,
  },
};
