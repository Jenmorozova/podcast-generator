# 🎙️ Генератор Подкастов

Бесплатный генератор подкастов из текста с использованием Web Speech API.

## ✨ Возможности

- 🎤 Преобразование текста в речь (TTS)
- 🗣️ Поддержка русского языка
- ⚙️ Настройка скорости, тона и громкости
- 📝 Редактирование текста подкаста
- 🎧 Прослушивание в браузере
- 💾 Скачивание настроек
- 📱 **Telegram Mini App**

## 🚀 Быстрый старт

### Локальная разработка

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

### 📱 Деплой в Telegram

См. [QUICK_START_TG.md](./QUICK_START_TG.md) для быстрого деплоя за 5 минут!

## 🎯 Telegram Mini App

Приложение полностью готово для использования как Telegram Mini App!

**За 5 минут:**
1. Задеплойте на Vercel: `vercel --prod`
2. Создайте бота через [@BotFather](https://t.me/BotFather)
3. Настройте Mini App: `/newapp`
4. Готово! 🎉

Подробная инструкция: [TELEGRAM_DEPLOY.md](./TELEGRAM_DEPLOY.md)

## 🔧 Технологии

- **React** - UI библиотека
- **Vite** - сборщик и dev server
- **Web Speech API** - синтез речи (TTS)
- **Telegram Web App SDK** - интеграция с Telegram
- **Lucide React** - иконки
- **Vercel** - хостинг (рекомендуется)

## 📝 Как использовать

1. Введите текст подкаста в редактор
2. Выберите голос из доступных (зависит от ОС)
3. Настройте параметры:
   - Скорость (0.5x - 2x)
   - Высота тона (0 - 2)
   - Громкость (0% - 100%)
4. Нажмите **"Прослушать"** для воспроизведения
5. Нажмите **"Сгенерировать настройки"** для скачивания

## 🗣️ Доступные голоса

Приложение использует голоса, установленные в операционной системе:

### macOS
- Милена (женский) 🇷🇺
- Юрий (мужской) 🇷🇺
- + другие голоса разных языков

### Windows
- Microsoft Irina (женский) 🇷🇺
- Microsoft Pavel (мужской) 🇷🇺
- Microsoft Dmitri (мужской) 🇷🇺

### Linux
- eSpeak
- Festival
- RHVoice

### Как добавить больше голосов?

- **macOS**: Системные настройки → Универсальный доступ → Речь → Загрузить дополнительные голоса
- **Windows**: Панель управления → Речь → Добавить голоса
- **Linux**: Установите пакеты RHVoice, eSpeak или Festival

## 🚢 Деплой

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel login
vercel --prod
```

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

## 🐛 Известные проблемы

### Ошибка "interrupted"
Это нормальное поведение браузера при быстрых переключениях. Просто игнорируется.

### Нет русских голосов
Установите русские голоса в вашей операционной системе (см. выше).

### Не работает в Telegram
- Убедитесь, что URL начинается с `https://`
- Проверьте настройки CSP в vercel.json
- Проверьте, что Web Speech API доступен

## 📄 Структура проекта

```
PODCAST/
├── src/
│   ├── App.jsx          # Главный компонент
│   ├── App.css          # Стили
│   └── main.jsx         # Точка входа
├── public/
│   └── favicon.svg      # Иконка
├── vercel.json          # Конфиг Vercel
├── TELEGRAM_DEPLOY.md   # Инструкция по Telegram
└── QUICK_START_TG.md    # Быстрый старт
```

## 🤝 Вклад

Если вы хотите внести вклад:

1. Fork репозиторий
2. Создайте ветку: `git checkout -b feature/amazing`
3. Commit изменения: `git commit -m 'Add amazing feature'`
4. Push в ветку: `git push origin feature/amazing`
5. Создайте Pull Request

## 📄 Лицензия

MIT License - используйте свободно!

## 👨‍💻 Автор

Создано с ❤️ для Telegram Mini Apps

## 🔗 Полезные ссылки

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Vercel Deployment](https://vercel.com/docs)
- [BotFather](https://t.me/BotFather)

---

**Удачи в создании подкастов! 🎙️✨**
