const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', //используем стандартного пользователя
  host: 'localhost', //база данных находится на локальном компьютере
  database: 'task-1', // имя нашей БД
  password: 'postgres', // используем стандартный пароль Postgres для доступа к базе данных
  port: 5432, // используем стандартный порт для подключения к базе данных
});

module.exports = pool;