const express = require('express');
const app = express();

app.use(express.json());// Подключаем middleware для разбора JSON-запросов

const actionsHistoryRouter = require('./user-service-history/build/user-service-history/app').default; // Импортируем маршрутизаторы из разных частей приложения
const userServiceRouter = require('./user-service/app');

app.use('/history', actionsHistoryRouter); // Подключаем маршрутизаторы к основному приложению
app.use('/users', userServiceRouter);

const PORT = process.env.PORT || 2999; // Задаем порт для сервера

app.listen(PORT, () => { // Запускаем сервер
  console.log(`Сервер запущен на порту ${PORT}`);
});