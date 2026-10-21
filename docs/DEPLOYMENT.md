# Запуск и публикация

## Уже работающие публичные приложения

Оба кабинета доступны всем по ссылке без входа в GPT или Google:
- [УК](https://scoutby-research-uk-oct26.dmitryga.chatgpt.site/uk.html)
- [Житель](https://scoutby-research-uk-oct26.dmitryga.chatgpt.site/resident.html)

На GitHub перенесён код. Работающая общая база пока находится на исходном хостинге. Данные этой базы автоматически в GitHub не копируются. GitHub Pages предназначен для статических сайтов и не заменяет сервер с общей очередью: [документация GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Локальный запуск из чистого клона

Нужны Node.js 22.13 или новее и npm. Для пользователя опубликованного приложения установка не требуется.

```sh
git clone https://github.com/dgolovin1990-glitch/scoutby-requests.git
cd scoutby-requests
npm ci
npm run build
npm run configure:local
npm run db:local
npm run start:standalone -- --port 8789
```

Откройте `http://127.0.0.1:8789/uk.html` и `http://127.0.0.1:8789/resident.html`. Первая загрузка очереди идемпотентно импортирует 150 вымышленных обращений. Локальная база отделена от опубликованной. Команду `db:local` можно запускать повторно: Wrangler учитывает применённые миграции.

Сервер собирается из `app/api/[...path]/route.js`; интерфейсы находятся в `public/uk.html` и `public/resident.html`. Первоначальное исследование сохранено в `public/research/`.

## Публикация в собственном Cloudflare без привязки к аккаунту GPT

Для владельца развёртывания нужен собственный аккаунт Cloudflare и созданная в нём база D1. Посетителям эти аккаунты не нужны. Текущая копия базы исходного хостинга при таком запуске не переносится: создаётся независимая очередь с учебными начальными данными.

1. Установите зависимости и выполните `npm run build`.
2. Авторизуйте Wrangler в своём Cloudflare обычным способом (`npx wrangler login`) либо используйте переменные среды `CLOUDFLARE_API_TOKEN` и `CLOUDFLARE_ACCOUNT_ID` для своей системы публикации. Ключи не размещайте в Git и не пересылайте в переписку.
3. Создайте собственную D1-базу командой `npx wrangler d1 create scoutby-requests-db` и скопируйте её `database_id`.
4. Задайте переменную среды `D1_DATABASE_ID`. При желании задайте `D1_DATABASE_NAME` и `WORKER_NAME`; по умолчанию используются `scoutby-requests-db` и `scoutby-requests`.
5. Выполните:

```sh
npm run configure:cloudflare
npm run db:remote
npm run deploy:cloudflare
```

Для Windows PowerShell переменная задаётся так: `$env:D1_DATABASE_ID='ID вашей базы'`; для shell Linux/macOS — `export D1_DATABASE_ID='ID вашей базы'`.

Скрипт создаёт игнорируемый `wrangler.deploy.json`, сохраняя серверные модули и статические ресурсы сборки. Сначала применяются миграции, затем загружается Worker. В конце Wrangler сообщает реальный публичный URL. Этот самостоятельный вариант подготовлен и проверен локально; отдельный внешний Cloudflare-аккаунт в рамках переноса GitHub не подключался, поэтому независимый домен `workers.dev` пока не опубликован.

Справочники Cloudflare: [D1 и миграции](https://developers.cloudflare.com/workers/wrangler/commands/d1/), [публикация из GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/). Автоматическая публикация из GitHub Actions сейчас не включена: для неё владельцу нужно отдельно настроить доступ к своему хостингу.

## Проверка

```sh
python verification/test_dashboards.py http://127.0.0.1:8789
```

Проверка создаёт одну явно учебную заявку, выполняет назначение и уточнение, затем закрывает её. Отчёт сохраняется в игнорируемой папке `outputs/`. На исходном опубликованном сайте выполнены 15/15 сквозных проверок; сохранённые отчёты находятся в `docs/verification/`.

## Демонстрационные ограничения

Кабинет УК открыт всем для учебного тестирования. Не вводите реальные персональные данные. Для промышленного использования нужны авторизация сотрудников и права доступа. Приложение фиксирует назначение подразделения и историю, но не отправляет сообщения в реальные службы. Первичный разбор новых обращений делает алгоритм правил, который требует проверки диспетчером.
