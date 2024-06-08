const express = require('express');
const app = express();
let fetch;

(async () => { // Динамический импорт модуля node-fetch для использования fetch API в Node.js
  fetch = (await import('node-fetch')).default;
})();

app.use(express.json());  // Middleware для парсинга JSON-форматированных тел запросов
const pool = require('../db'); // Импорт pool из db.js, который находится в папке на уровень выше

async function testDBConnection() { // Функция для тестирования соединения с базой данных
    try {
        const { rows } = await pool.query('SELECT NOW()');
        console.log('Текущее время в базе данных:', rows[0].now);
    } catch (err) {
        console.error('Ошибка при подключении к базе данных:', err);
    }
}

testDBConnection();  // Вызов функции для тестирования соединения

async function sendEvent(event) { // Функция для отправки событий в сервис истории действий
  try {
    const response = await fetch('http://localhost:3001/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
      timeout: 1000  // 1000 миллисекунд = 1 секунда. Нужна чтобы консоль не зависала.
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Ошибка при отправке события:', data);
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      console.log('Сообщение отправлено:', data);
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
}

app.post('/users', async (req, res) => { // Ручка для создания пользователя
  const { name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    await sendEvent({
      eventType: 'Пользователь создан',
      userId: result.rows[0].id,
      details: result.rows[0],
      eventTime: new Date().toISOString()
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/users/:id', async (req, res) => { // Ручка для обновления данных пользователя
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    if (result.rows.length > 0) {
      await sendEvent({
        eventType: 'Данные пользователя обновлены',
        userId: id,
        details: result.rows[0],
        eventTime: new Date()
      });
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Пользователь не найден.');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => { // Ручка для получения списка всех пользователей
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => { // Ручка для получения данных конкретного пользователя по ID
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Пользователь не найден.');
    }
  } catch (err) {
    console.error('Ошибка при запросе пользователя:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3000; // Запуск сервера на определенном порту
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app; // Экспорт app для возможности тестирования