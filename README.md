# Сайт для автосервиса Toyota Lexus

### PWA (Windows и Android)
![Первая страница](https://github.com/rus-sharafiev/toyota-lexus-service/blob/master/screenshots/screenshot.png?raw=true)

![Страница с моделями](https://github.com/rus-sharafiev/toyota-lexus-service/blob/master/screenshots/screenshot-mobile.png?raw=true)

## Frontend
### Стек технологий
- HTML5
- CSS3
- JS
    - ES6
    - React + React-router
    - Workbox
- TypeScript

## Backend
### Стек технологий
- PHP8
- MySQL

Сервер принимает запросы в формате JSON и в этом же формате отправляет ответ, e.g.
https://tls.srrlab.ru/api/cars/ - список моделей с поколениями
https://tls.srrlab.ru/api/cars/?id=toyota_rav4_V - информация по модели

Дев версия без сервис-воркера https://tls.srrlab.ru/
Демо панели администратора https://tls.srrlab.ru/admin логин admin, пароль admin