# 🚀 Деплой Telegram Mini App

## Шаг 1: Создайте бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Введите название бота (например, "Podcast Generator")
4. Введите username бота (например, "podcast_gen_bot")
5. Сохраните токен бота

## Шаг 2: Создайте Mini App

1. Отправьте `/newapp` боту @BotFather
2. Выберите вашего бота
3. Введите название приложения (например, "Podcast Generator")
4. Введите описание (например, "Генератор подкастов из текста с TTS")
5. Загрузите иконку (512x512 px)
6. Загрузите GIF-демо (опционально)
7. Введите Web App URL (ваш URL после деплоя)

## Шаг 3: Задеплойте на Vercel

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите в Vercel
vercel login

# Задеплойте проект
vercel

# Скопируйте Production URL (например, https://podcast-xxx.vercel.app)
```

## Шаг 4: Настройте Mini App URL

1. Вернитесь к @BotFather
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. Введите название кнопки (например, "🎙️ Создать подкаст")
5. Введите URL с Vercel (из шага 3)

## Шаг 5: Готово! 🎉

Откройте вашего бота в Telegram и нажмите кнопку меню - ваше приложение откроется!

---

## Альтернативные хостинги:

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Загрузите dist/ в gh-pages ветку
```

### Cloudflare Pages
```bash
npm run build
# Подключите GitHub репозиторий к Cloudflare Pages
```

---

## 🔧 Дополнительные настройки

### Установить иконку бота
```
/setuserpic - загрузить аватар бота
```

### Установить описание
```
/setdescription - установить описание бота
```

### Установить команды
```
/setcommands - добавить список команд
start - Запустить бота
help - Помощь
```

---

## 📱 Тестирование

1. Откройте бота в Telegram
2. Нажмите `/start`
3. Нажмите кнопку меню внизу
4. Ваше Mini App откроется!

---

## 🐛 Отладка

- Проверьте URL приложения (должен быть HTTPS)
- Проверьте, что приложение открывается в браузере
- Проверьте консоль браузера в Telegram (Telegram Desktop → Developer Tools)
- Убедитесь, что Web Speech API работает в Telegram

---

## 📚 Полезные ссылки

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [BotFather](https://t.me/BotFather)
- [Vercel](https://vercel.com)
- [Telegram Web App SDK](https://github.com/twa-dev/sdk)

