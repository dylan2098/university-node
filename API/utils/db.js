const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.HOST,
        user: process.env.USER_HOST,
        password: process.env.PASSWORD_HOST,
        database: process.env.DATABASE,
        port: 3306
    },
    pool: {
        min: 0,
        max: 50
    }
});

module.exports = knex;
