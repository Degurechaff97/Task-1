# Task-1: Сервисы Управления Пользователями и Истории Действий с Пользователями

## Описание проекта

Проект включает в себя два сервиса:
1. **Сервис управления пользователями** (User Service) - предоставляет API для создания, изменения и получения списка пользователей.
2. **Сервис истории действий с пользователями** (User Action History Service) - записывает события создания и изменения пользователей и предоставляет API для получения истории действий с возможностью фильтрации по ID пользователя и постраничной навигации.

## Технологии

- Node.js и Express.js для сервиса пользователей.
- TypeScript и Express.js для сервиса истории действий.
- PostgreSQL для базы данных.

## Структура проекта
```
Task-1/
│
├── user-service/
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
│
├── user-service-history/
│   ├── app.ts
│   ├── interface.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── Readme.md
├── db.js
├── start.js
├── package.json
└── package-lock.json
```
## Установка и запуск

### Предварительные требования

Убедитесь, что у вас установлены Node.js, npm, TypeScript и PostgreSQL.

### Установка зависимостей

Перейдите в каждую папку сервиса и установите зависимости:

	cd ../user-service
	npm install
	cd ../user-service-history
	npm install

### Настройка базы данных

Проверьте пожалуйста данные из файла `db.js` для создания и настройки базы данных PostgreSQL.

### Запуск сервиса управления пользователями
	cd ../user-service
	node app.js

### Запуск сервиса истории действий с пользователями
cd ../user-service-history
ts-node app.ts

### Компиляция TypeScript
Если вы хотите запустить всё одновременно с помощью одного файла start.js, который находится в корневой папке, то перед этим, необходимо скомпилировать TypeScript код в JavaScript:

	cd ../user-service-history
	tsc

### Запуск обоих сервисов
	cd ./
	node start.js

## API Endpoints

Сервис управления пользователями находится на порту 3000, сервис истории действий с пользователями находится на порту 3001!

### Сервис управления пользователями

POST /users - Создание пользователя
	Тело запроса: JSON с полями name и email.
	
	Пример запроса:
    {
      "name": "Иван Иванов",
      "email": "ivan@example.com"
    }
	
	Пример ответа:
    {
      "id": 1,
      "name": "Иван Иванов",
      "email": "ivan@example.com"
    }
	
Пример с использованием curl в Windows Powershell:
	
	curl.exe -X POST "http://localhost:3000/users" -H "Content-Type: application/json" -d "{\"name\": \"Алексей\", \"email\": \"aleksey@example.com\"}"
	
PUT /users/:id - Изменение пользователя (id необязательный)
	Параметры: id - идентификатор пользователя.
	Тело запроса: JSON с полями name и/или email, которые нужно обновить.
	
	Пример запроса:
    {
      "name": "Петр Петров",
      "email": "petr@example.com"
    }
	
	Пример ответа:
	{
      "id": 1,
      "name": "Петр Петров",
      "email": "petr@example.com"
    }
	
GET /users - Получение списка пользователей
	
	Пример ответа:
    [
      {
        "id": 1,
        "name": "Иван Иванов",
        "email": "ivan@example.com"
      },
      {
        "id": 2,
        "name": "Петр Петров",
        "email": "petr@example.com"
      }
    ]
	
### Сервис истории действий с пользователями

GET /history - Получение истории действий
	Параметры: userId (необязательный), page (необязательный), limit (необязательный).

	Пример запроса:
    /history?userId=1&page=1&limit=10
	
	Пример ответа:
    [
      {
        "eventId": 101,
        "eventType": "Пользователь создан",
        "userId": 1,
        "eventTime": "2023-01-01T12:00:00Z"
      },
      {
        "eventId": 102,
        "eventType": "Данные пользователя обновлены",
        "userId": 1,
        "eventTime": "2023-01-02T15:00:00Z"
      }
    ]

## Лицензия

MIT License

## Контакты

Если у вас есть вопросы по проекту, пожалуйста, свяжитесь со мной по почте lunaplaysdota@gmail.com или ЛС в Telegram @Degurechaff97
