#!/bin/bash

# 🚀 Скрипт загрузки на GitHub

echo "
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         📤 ЗАГРУЗКА НА GITHUB                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"

cd /Users/evgenia.zhuravishkina/PODCAST

echo "✅ Текущая директория: $(pwd)"
echo ""

# Проверяем, что git инициализирован
if [ ! -d .git ]; then
    echo "❌ Git репозиторий не найден!"
    echo "Инициализирую..."
    git init
    git add .
    git commit -m "🎙️ Генератор подкастов - Telegram Mini App"
fi

echo "✅ Git репозиторий готов"
echo ""

# Спрашиваем username
echo "═══════════════════════════════════════════════════════════════"
echo "📋 ВВЕДИТЕ ВАШ GITHUB USERNAME"
echo "═══════════════════════════════════════════════════════════════"
echo ""
read -p "GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username не может быть пустым!"
    exit 1
fi

echo ""
echo "✅ Username: $GITHUB_USERNAME"
echo ""

# URL репозитория
REPO_URL="https://github.com/$GITHUB_USERNAME/podcast-generator.git"

echo "═══════════════════════════════════════════════════════════════"
echo "📋 СОЗДАЙТЕ РЕПОЗИТОРИЙ НА GITHUB"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Откройте: https://github.com/new"
echo "2. Repository name: podcast-generator"
echo "3. Public ✅"
echo "4. НЕ СТАВЬТЕ галочки!"
echo "5. Create repository"
echo ""
read -p "Нажмите Enter когда создадите репозиторий..."

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📤 ЗАГРУЖАЮ КОД НА GITHUB..."
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Проверяем, не добавлен ли уже remote
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' уже существует. Обновляю..."
    git remote set-url origin $REPO_URL
else
    echo "➕ Добавляю remote origin..."
    git remote add origin $REPO_URL
fi

echo "🌿 Переименовываю ветку в main..."
git branch -M main

echo "📤 Загружаю на GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "🎉 УСПЕШНО ЗАГРУЖЕНО НА GITHUB!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
    echo ""
    echo "1️⃣  Репозиторий: https://github.com/$GITHUB_USERNAME/podcast-generator"
    echo ""
    echo "2️⃣  Деплой на Vercel:"
    echo "    - Откройте: https://vercel.com/new"
    echo "    - Войдите через GitHub"
    echo "    - Import Git Repository"
    echo "    - Выберите: podcast-generator"
    echo "    - Deploy!"
    echo ""
    echo "3️⃣  Скопируйте Production URL"
    echo ""
    echo "4️⃣  Telegram @BotFather:"
    echo "    /newbot → /newapp → вставьте URL"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🚀 Готово! Переходите к деплою на Vercel!"
    echo ""
else
    echo ""
    echo "❌ Ошибка при загрузке на GitHub!"
    echo ""
    echo "Возможные причины:"
    echo "1. Репозиторий не создан на GitHub"
    echo "2. Неверный username"
    echo "3. Нужен Personal Access Token вместо пароля"
    echo ""
    echo "Создайте токен: https://github.com/settings/tokens"
    echo "При push используйте токен вместо пароля"
    echo ""
    exit 1
fi

