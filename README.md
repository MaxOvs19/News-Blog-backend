# News Blog Backend

## Версия 1.0.0

### Автор

- Максим ( [MaxOvs19](https://github.com/AnnOvs19/News-Blog-Frontend) ) - Full-stack developer

### Полноценный новостной блог с возможностью :

- Регистрации и входа по jwt-токену
- Редактированя профиля
- Создание/редактирование/удаление постов
- Создание/редактирование/удаление типов новостей
- Сохранение файлов изображений профиля/новости

## Установка

### Запуск без докера

- Клонирование репозитория
- Установка базы данных PostgreSQL
- Создание пустой БД
- Создание файла .env
- Создание папки static в корне приложения
- `npm install` - Установка зависимостей
- `npm start` - Запуск приложения

### Запуск с докером

- docker-compose up

### Конфиг .env

- `DB_NAME=news-blog` - название БД
- `DB_USER=postgres` - юзер БД
- `DB_PASSWORD=root` - пароль от БД
- `DB_HOST=localhost` - хост
- `DB_PORT=5432` - порт БД
- `SECRET_KEY=my-key` - Секретный ключ для генерации JWT токена

- `POSTGRESDB_LOCAL_PORT=5433` - Локальный порт для БД
- `POSTGRESDB_DOCKER_PORT=5432` - Порт для Докера БД

- `NODE_LOCAL_PORT=6868` - Порт приложения
- `NODE_DOCKER_PORT=8080` - Порт для Докера(Приложения)
