import express, { Request, Response } from 'express';
import pool from '../db';
const app = express();
app.use(express.json());

app.get('/history', async (req: Request, res: Response) => { // Ручка для получения истории действий с возможностью фильтрации и постраничной навигации
  const { page = 1, limit = 10 } = req.query; // Извлечение параметров запроса с значениями по умолчанию
  const userIdParam = req.query.userId; // Получаем userId как параметр запроса

  if (isNaN(Number(page)) || isNaN(Number(limit))) { // Проверка, что параметры page и limit являются числами
    return res.status(400).send('Параметры page и limit должны быть числами.');
  }

  const offset = (Number(page) - 1) * Number(limit); // Расчет смещения для постраничной навигации
  // SQL запрос без фильтрации по пользователю
  let query = `
    SELECT * FROM history
    ORDER BY event_time DESC
    LIMIT $1 OFFSET $2
  `; 
  let values = [Number(limit), offset];

  if (userIdParam) { // Если параметр userId предоставлен, добавляем условие фильтрации по пользователю
    const userId = Number(userIdParam); // Преобразуем userId в число
    if (!isNaN(userId)) {
      query = `
        SELECT * FROM history
        WHERE user_id = $1
        ORDER BY event_time DESC
        LIMIT $2 OFFSET $3
      `;
      values = [userId, Number(limit), offset];
    } else {
      return res.status(400).send('Параметр userId должен быть числом.');
    }
  }

  try {   // Выполнение запроса к базе данных
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    res.status(500).send('Internal Server Error');
  }
});

import { Event } from './interface';  // Ручка для добавления события в историю
app.post('/history', async (req: Request, res: Response) => {
  console.log('Полученные данные:', req.body);
  const event: Event = req.body;
  try { // SQL запрос для вставки события в базу данных
    const query = `
      INSERT INTO history (event_type, user_id, event_time)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [event.eventType, event.userId, event.eventTime];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при сохранении события:', error);
    res.status(500).send('Internal Server Error');
  }
});
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

export default app;