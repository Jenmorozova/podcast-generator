# 📤 Загрузка на GitHub - Пошаговая инструкция

## ✅ Готово

- [x] Git репозиторий создан локально
- [x] Все файлы добавлены в commit
- [x] Git настроен (Evgenia Zhuravishkina)

---

## 🚀 Шаг 1: Создайте репозиторий на GitHub

1. Откройте: **https://github.com/new**

2. Заполните форму:
   - **Repository name**: `podcast-generator`
   - **Description**: `🎙️ Генератор подкастов для Telegram Mini App с TTS`
   - **Public** ✅ (рекомендую для открытого доступа)
   
3. **НЕ СТАВЬТЕ** галочки:
   - ❌ Add a README file
   - ❌ Add .gitignore  
   - ❌ Choose a license

4. Нажмите **"Create repository"**

---

## 📋 Шаг 2: Загрузите код

После создания репозитория, выполните команды ниже в терминале.

**ВАЖНО**: Замените `YOUR_USERNAME` на ваш реальный GitHub username!

### Команды для терминала:

```bash
cd /Users/evgenia.zhuravishkina/PODCAST

git remote add origin https://github.com/YOUR_USERNAME/podcast-generator.git

git branch -M main

git push -u origin main
```

---

## 🔐 Если попросит пароль

GitHub больше не принимает пароли. Используйте Personal Access Token:

1. Откройте: https://github.com/settings/tokens
2. Нажмите "Generate new token (classic)"
3. Выберите срок действия: 90 days
4. Поставьте галочку: **repo** (полный доступ к репозиториям)
5. Нажмите "Generate token"
6. **СКОПИРУЙТЕ ТОКЕН** (он больше не появится!)
7. Используйте его вместо пароля при git push

---

## 🎯 Шаг 3: Подключите Vercel

После успешной загрузки на GitHub:

1. Откройте: **https://vercel.com/new**
2. Войдите через GitHub
3. Нажмите **"Import Git Repository"**
4. Найдите `podcast-generator` в списке
5. Нажмите **"Import"**
6. Настройки оставьте по умолчанию
7. Нажмите **"Deploy"**
8. Подождите 1-2 минуты ⏳

---

## 📱 Шаг 4: Получите URL

После успешного деплоя:

1. Vercel покажет: **"Congratulations! Your project has been deployed."**
2. Скопируйте **Production URL**: `https://podcast-generator-xyz.vercel.app`
3. Откройте его в браузере - проверьте, что работает ✅

---

## 🤖 Шаг 5: Создайте Telegram бота

### A. Создайте бота

1. Откройте Telegram
2. Найдите **@BotFather**
3. Отправьте: `/newbot`
4. Введите название: `Podcast Generator` или `Генератор Подкастов`
5. Введите username: `your_name_podcast_bot` (должен быть уникальным)
6. **Сохраните токен бота!**

### B. Создайте Mini App

1. В @BotFather отправьте: `/newapp`
2. Выберите вашего бота
3. **Title**: `Podcast Generator`
4. **Description**: `Создавайте подкасты из текста с AI озвучкой`
5. **Photo** (640x360): Пропустите (send /empty)
6. **Web App URL**: Вставьте ваш Vercel URL
7. **Short name**: `podcast`
8. **Photo** (512x512): Пропустите (send /empty)

---

## 🎉 Готово!

Теперь:
1. Откройте вашего бота в Telegram
2. Нажмите `/start`
3. Нажмите **кнопку меню** (три полоски внизу)
4. Ваше приложение откроется!

---

## 🔄 Обновление приложения

После изменений в коде:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически задеплоит новую версию! 🚀

---

## 🆘 Проблемы?

### "Authentication failed"
- Используйте Personal Access Token вместо пароля
- Создайте здесь: https://github.com/settings/tokens

### "Repository not found"
- Проверьте правильность username
- Убедитесь, что репозиторий создан

### "Permission denied"
- Проверьте права доступа к токену
- Создайте новый токен с правами "repo"

---

**Удачи с деплоем! 🚀**

