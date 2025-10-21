#!/bin/bash

# 🚀 Скрипт автоматического деплоя в Telegram Mini App

echo "🎙️ Генератор Подкастов - Деплой в Telegram"
echo "=========================================="
echo ""

# Проверка установки Vercel
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI не установлен!"
    echo "📦 Устанавливаю Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI найден"
echo ""

# Сборка проекта
echo "🔨 Собираю проект..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки!"
    exit 1
fi

echo "✅ Проект успешно собран"
echo ""

# Проверка авторизации
echo "🔐 Проверяю авторизацию в Vercel..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Вы не авторизованы в Vercel"
    echo "🔑 Запускаю процесс авторизации..."
    vercel login
fi

echo "✅ Авторизация подтверждена"
echo ""

# Деплой
echo "🚀 Деплою на Vercel..."
echo ""

vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ ДЕПЛОЙ УСПЕШЕН!"
    echo "=========================================="
    echo ""
    echo "📋 Следующие шаги:"
    echo ""
    echo "1️⃣  Скопируйте Production URL выше"
    echo "2️⃣  Откройте @BotFather в Telegram"
    echo "3️⃣  Отправьте: /newbot"
    echo "4️⃣  Создайте бота"
    echo "5️⃣  Отправьте: /newapp"
    echo "6️⃣  Вставьте Production URL"
    echo "7️⃣  Готово! 🎉"
    echo ""
    echo "📖 Подробная инструкция: START_HERE.md"
    echo ""
else
    echo ""
    echo "❌ Ошибка деплоя!"
    echo "📖 Попробуйте вручную: vercel login && vercel --prod"
    exit 1
fi

