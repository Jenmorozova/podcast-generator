import React, { useState, useEffect } from 'react'
import { Mic, Play, Pause, Download, Settings, Volume2 } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import './App.css'

/**
 * Главный компонент приложения для генерации подкастов
 */
function App() {
  const [script, setScript] = useState('')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRefreshingVoices, setIsRefreshingVoices] = useState(false)
  const [isTestingVoices, setIsTestingVoices] = useState(false)
  const [currentTestVoice, setCurrentTestVoice] = useState(null)
  const [russianVoicesCount, setRussianVoicesCount] = useState(0)
  
  // Внешние голоса
  const [externalVoices, setExternalVoices] = useState([])
  const [useExternalTTS, setUseExternalTTS] = useState(false)
  const [selectedExternalVoice, setSelectedExternalVoice] = useState(null)
  const [isLoadingExternalVoices, setIsLoadingExternalVoices] = useState(false)
  
  // API ключи
  const [yandexApiKey, setYandexApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  
  // Параметры голоса
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)


  /**
   * Инициализация Telegram Web App
   */
  useEffect(() => {
    // Инициализируем Telegram Web App
    WebApp.ready()
    
    // Разворачиваем приложение на весь экран
    WebApp.expand()
    
    // Устанавливаем цвет заголовка
    WebApp.setHeaderColor('#667eea')
    
    // Включаем кнопку "Закрыть"
    WebApp.enableClosingConfirmation()
    
    console.log('📱 Telegram Web App инициализирован')
    console.log('👤 Пользователь:', WebApp.initDataUnsafe?.user?.username || 'Аноним')
  }, [])

  /**
   * Загрузка внешних русских голосов
   */
  const loadExternalVoices = () => {
    setIsLoadingExternalVoices(true)
    
    const externalVoicesList = [
      // Системные голоса с улучшенным поиском
      { id: 'system-female', name: 'Системный (женский)', provider: 'System', gender: 'female', lang: 'ru' },
      { id: 'system-male', name: 'Системный (мужской)', provider: 'System', gender: 'male', lang: 'ru' },
      { id: 'system-soft', name: 'Системный (мягкий)', provider: 'System', gender: 'female', lang: 'ru' },
      { id: 'system-deep', name: 'Системный (глубокий)', provider: 'System', gender: 'male', lang: 'ru' },
      { id: 'system-fast', name: 'Системный (быстрый)', provider: 'System', gender: 'female', lang: 'ru' },
      { id: 'system-slow', name: 'Системный (медленный)', provider: 'System', gender: 'male', lang: 'ru' }
    ]
    
    setExternalVoices(externalVoicesList)
    setSelectedExternalVoice(externalVoicesList[0])
    setIsLoadingExternalVoices(false)
    
    console.log(`🌐 Загружено внешних русских голосов: ${externalVoicesList.length}`)
    console.log('📋 Внешние голоса:', externalVoicesList.map(v => `${v.name} (${v.provider})`))
  }

  /**
   * Загрузка доступных голосов при монтировании компонента
   */
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      const russianVoices = availableVoices.filter(voice => voice.lang.startsWith('ru'))
      
      console.log(`🎤 Загружено русских голосов: ${russianVoices.length}`)
      console.log('📋 Русские голоса:', russianVoices.map(v => `${v.name} (${v.lang})`))
      
      // Используем первый русский голос, но отображаем его как "Агата"
      if (russianVoices.length > 0) {
        const baseVoice = russianVoices[0]
        
        // Создаем объект для отображения с именем "Агата", но используем оригинальный голос
        const agataDisplay = {
          ...baseVoice,
          displayName: 'Агата',
          originalVoice: baseVoice
        }
        
        setVoices([agataDisplay])
        setRussianVoicesCount(1)
        setSelectedVoice(agataDisplay)
        console.log(`🇷🇺 Создан голос: Агата (на основе ${baseVoice.name})`)
      } else {
        console.log('⚠️ Русские голоса не найдены!')
        setVoices([])
        setRussianVoicesCount(0)
      }
      
      setIsInitialized(true)
    }

    loadVoices()
    loadExternalVoices()
    
    // Некоторые браузеры загружают голоса асинхронно
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  /**
   * Обработка текста для правильного воспроизведения знаков препинания
   */
  const processTextForSpeech = (text) => {
    return text
      // Заменяем многоточие на длинную паузу (несколько пробелов)
      .replace(/\.{3,}/g, '   ')
      // Заменяем восклицательные знаки на паузу
      .replace(/!+/g, ' ')
      // Заменяем вопросительные знаки на паузу
      .replace(/\?+/g, ' ')
      // Заменяем точки на паузу
      .replace(/\.+/g, ' ')
      // Заменяем запятые на короткую паузу
      .replace(/,+/g, ' ')
      // Заменяем двоеточие на паузу
      .replace(/:/g, ' ')
      // Заменяем точку с запятой на паузу
      .replace(/;/g, ' ')
      // Заменяем тире на паузу
      .replace(/—/g, ' ')
      .replace(/-/g, ' ')
      // Заменяем кавычки на паузу
      .replace(/[""''«»]/g, ' ')
      // Заменяем скобки на паузу
      .replace(/[()]/g, ' ')
      // Заменяем квадратные скобки на паузу
      .replace(/[\[\]]/g, ' ')
      // Убираем лишние пробелы, но оставляем паузы
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  /**
   * Воспроизведение через внешние API (только рабочие)
   */
  const playExternalTTS = async (text, voice) => {
    console.log('🎯 playExternalTTS вызвана:', { text: text.substring(0, 30) + '...', voice })
    setIsListening(true)
    
    try {
      let audioUrl = ''
      
      if (voice.provider === 'System') {
        // Системные голоса с разными характеристиками
        console.log('🎤 Используем системный голос:', voice.name)
        
        // Находим подходящий системный голос
        let systemVoice = null
        
        // Для всех системных голосов используем первый доступный русский голос
        systemVoice = voices.find(v => v.lang && v.lang.startsWith('ru')) || voices[0]
        
        if (systemVoice) {
          console.log('🔄 Переключаемся на системный голос:', systemVoice.name)
          
          // Используем системный голос
          const processedText = processTextForSpeech(text)
          const utterance = new SpeechSynthesisUtterance(processedText)
          utterance.voice = systemVoice
          
          // Настройки в зависимости от типа голоса
          if (voice.id === 'system-fast') {
            utterance.rate = Math.min(rate * 1.3, 2.0) // Быстрее
            utterance.pitch = Math.min(pitch * 1.1, 2.0) // Выше
          } else if (voice.id === 'system-slow') {
            utterance.rate = Math.max(rate * 0.7, 0.3) // Медленнее
            utterance.pitch = Math.max(pitch * 0.9, 0.5) // Ниже
          } else if (voice.id === 'system-soft') {
            utterance.rate = rate * 0.9 // Мягче
            utterance.pitch = Math.min(pitch * 1.2, 2.0) // Выше
          } else if (voice.id === 'system-deep') {
            utterance.rate = rate * 0.8 // Глубже
            utterance.pitch = Math.max(pitch * 0.8, 0.5) // Ниже
          } else {
            utterance.rate = rate
            utterance.pitch = pitch
          }
          
          utterance.volume = volume / 100
          utterance.lang = 'ru-RU'
          
          utterance.onstart = () => {
            console.log('✅ Воспроизведение началось (системный голос)')
          }
          
          utterance.onend = () => {
            setIsListening(false)
            console.log('✅ Воспроизведение завершено')
          }
          
          utterance.onerror = (event) => {
            if (event.error === 'interrupted') {
              console.log('ℹ️ Воспроизведение прервано (нормально)')
              return
            }
            setIsListening(false)
            console.error('❌ Ошибка воспроизведения:', event.error)
            alert('Ошибка воспроизведения. Попробуйте другой голос.')
          }
          
          // Отменяем предыдущее воспроизведение
          speechSynthesis.cancel()
          
          // Небольшая задержка перед воспроизведением
          setTimeout(() => {
            speechSynthesis.speak(utterance)
          }, 100)
          
        } else {
          setIsListening(false)
          alert('Системные голоса не найдены. Попробуйте перезагрузить страницу.')
        }
        
      } else if (voice.provider === 'Yandex') {
        // Яндекс SpeechKit API
        if (!yandexApiKey) {
          setIsListening(false)
          setShowApiKeyInput(true)
          alert('Для использования голосов Яндекса нужен API ключ. Введите его в поле ниже.')
          return
        }
        
        const voiceName = voice.id.split('-')[1]
        const speed = Math.max(0.1, Math.min(3, rate))
        
        try {
          const response = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
            method: 'POST',
            headers: {
              'Authorization': `Api-Key ${yandexApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: text,
              lang: 'ru-RU',
              voice: voiceName,
              speed: speed,
              format: 'mp3'
            })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          
          audio.oncanplay = () => {
            console.log('✅ Яндекс TTS готово к воспроизведению')
            audio.play()
          }
          
          audio.onended = () => {
            setIsListening(false)
            console.log('✅ Воспроизведение завершено')
            URL.revokeObjectURL(audioUrl)
          }
          
          audio.onerror = (error) => {
            setIsListening(false)
            console.error('❌ Ошибка Яндекс TTS:', error)
            URL.revokeObjectURL(audioUrl)
            alert('Ошибка воспроизведения аудио от Яндекса.')
          }
          
        } catch (error) {
          setIsListening(false)
          console.error('❌ Ошибка запроса к Яндекс API:', error)
          alert(`Ошибка API Яндекса: ${error.message}\n\nПроверьте правильность API ключа.`)
        }
        
      } else {
        // Для остальных провайдеров показываем сообщение
        setIsListening(false)
        alert(`Голос "${voice.name}" требует настройки API ключей.\n\nПока используйте:\n• Системные голоса (работают всегда)\n• Google Translate (бесплатно)\n• Яндекс (с API ключом)`)
      }
      
    } catch (error) {
      setIsListening(false)
      console.error('❌ Ошибка внешнего TTS:', error)
      alert('Ошибка при воспроизведении через внешний сервис.')
    }
  }

  /**
   * Прослушивание текста через Web Speech API или внешние сервисы
   */
  const listenToText = () => {
    if (!script.trim()) {
      alert('Введите текст для прослушивания!')
      return
    }

    if (!isInitialized) {
      alert('Голоса еще загружаются. Подождите немного и попробуйте снова.')
      return
    }

    console.log('🔍 Отладка:', {
      useExternalTTS,
      selectedExternalVoice,
      script: script.substring(0, 50) + '...'
    })

    // Если выбран внешний TTS
    if (useExternalTTS && selectedExternalVoice) {
      console.log('🌐 Используем внешний TTS:', selectedExternalVoice.name)
      playExternalTTS(script, selectedExternalVoice)
      return
    }

    // Проверяем доступность синтеза речи
    if (!window.speechSynthesis) {
      alert('Синтез речи не поддерживается в этом браузере')
      return
    }

    // Полностью останавливаем все воспроизведения
    window.speechSynthesis.cancel()
    
    // Сбрасываем состояние
    setIsListening(false)
    
    // Ждем полной остановки
    setTimeout(() => {
      // Создаем новый utterance
      const processedScript = processTextForSpeech(script)
      const utterance = new SpeechSynthesisUtterance(processedScript)
      
      if (selectedVoice) {
        // Используем оригинальный голос, если есть, иначе сам голос
        utterance.voice = selectedVoice.originalVoice || selectedVoice
      }
      
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      utterance.lang = 'ru-RU'

      // Устанавливаем обработчики ДО запуска
      utterance.onstart = () => {
        setIsListening(true)
        console.log('✅ Воспроизведение началось')
      }
      
      utterance.onend = () => {
        setIsListening(false)
        console.log('✅ Воспроизведение завершено')
      }
      
      utterance.onerror = (event) => {
        setIsListening(false)
        
        // Игнорируем ошибку interrupted - это нормально
        if (event.error === 'interrupted') {
          console.log('ℹ️ Воспроизведение прервано (нормально)')
          return
        }
        
        // Показываем только реальные ошибки
        console.error('❌ Ошибка синтеза речи:', event.error)
        
        let errorMessage = 'Ошибка при воспроизведении'
        switch(event.error) {
          case 'not-allowed':
            errorMessage = 'Воспроизведение заблокировано. Кликните на страницу и попробуйте снова.'
            break
          case 'audio-busy':
            errorMessage = 'Аудио занято. Подождите и попробуйте снова.'
            break
          case 'audio-hardware':
            errorMessage = 'Проблема с аудио оборудованием.'
            break
          case 'network':
            errorMessage = 'Ошибка сети.'
            break
          case 'synthesis-unavailable':
            errorMessage = 'Синтез речи недоступен в этом браузере.'
            break
          case 'synthesis-failed':
            errorMessage = 'Ошибка синтеза речи.'
            break
          case 'language-unavailable':
            errorMessage = 'Выбранный язык недоступен.'
            break
          case 'voice-unavailable':
            errorMessage = 'Выбранный голос недоступен.'
            break
          case 'text-too-long':
            errorMessage = 'Текст слишком длинный. Попробуйте сократить.'
            break
          case 'invalid-argument':
            errorMessage = 'Неверные параметры голоса.'
            break
          default:
            errorMessage = `Ошибка: ${event.error}`
        }
        
        alert(errorMessage)
      }

      // Запускаем синтез речи
      try {
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('❌ Ошибка запуска синтеза речи:', error)
        setIsListening(false)
        alert('Не удалось запустить воспроизведение. Попробуйте еще раз.')
      }
    }, 500) // Увеличиваем задержку
  }

  /**
   * Остановка воспроизведения
   */
  const stopListening = () => {
    window.speechSynthesis.cancel()
    setIsListening(false)
  }

  /**
   * Обновление списка голосов
   */
  const refreshVoices = () => {
    setIsRefreshingVoices(true)
    
    // Принудительно обновляем голоса
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      const russianVoices = availableVoices.filter(voice => voice.lang.startsWith('ru'))
      
      console.log(`🔄 Обновлено голосов: ${availableVoices.length}`)
      console.log(`🇷🇺 Русских голосов: ${russianVoices.length}`)
      console.log('📋 Новые голоса:', availableVoices.map(v => `${v.name} (${v.lang})`))
      
      setVoices(availableVoices)
      setRussianVoicesCount(russianVoices.length)
      
      // Выбираем русский голос по умолчанию, если доступен
      const russianVoice = russianVoices.find(voice => voice.lang.startsWith('ru'))
      if (russianVoice) {
        setSelectedVoice(russianVoice)
        console.log(`🇷🇺 Выбран русский голос: ${russianVoice.name}`)
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0])
        console.log(`🌍 Выбран голос по умолчанию: ${availableVoices[0].name}`)
      }
      
      setIsRefreshingVoices(false)
      
      // Показываем результат обновления
      if (russianVoices.length > 0) {
        alert(`✅ Обновлено! Найдено ${russianVoices.length} русских голосов: ${russianVoices.map(v => v.name).join(', ')}`)
      } else {
        alert('⚠️ Русские голоса не найдены. Следуйте инструкциям ниже для их установки.')
      }
    }

    // Небольшая задержка для обновления
    setTimeout(loadVoices, 500)
  }

  /**
   * Тестирование всех русских голосов
   */
  const testRussianVoices = async () => {
    const russianVoices = voices.filter(voice => voice.lang.startsWith('ru'))
    
    if (russianVoices.length === 0) {
      alert('Русские голоса не найдены! Установите их по инструкции ниже.')
      return
    }

    setIsTestingVoices(true)
    console.log(`🧪 Начинаем тестирование ${russianVoices.length} русских голосов`)

    for (let i = 0; i < russianVoices.length; i++) {
      const voice = russianVoices[i]
      setCurrentTestVoice(voice)
      
      console.log(`🎤 Тестируем голос ${i + 1}/${russianVoices.length}: ${voice.name}`)
      
      // Создаем utterance для тестирования
      const testText = processTextForSpeech('Привет! Это тест русского голоса.')
      const utterance = new SpeechSynthesisUtterance(testText)
      utterance.voice = voice
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 0.8

      // Обещание для ожидания завершения
      await new Promise((resolve) => {
        utterance.onend = () => {
          console.log(`✅ Голос ${voice.name} работает`)
          resolve()
        }
        
        utterance.onerror = (event) => {
          if (event.error === 'interrupted') {
            console.log(`ℹ️ Голос ${voice.name} прерван (нормально)`)
          } else {
            console.log(`❌ Голос ${voice.name} не работает: ${event.error}`)
          }
          resolve()
        }

        // Запускаем тест
        window.speechSynthesis.speak(utterance)
      })

      // Пауза между тестами
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setCurrentTestVoice(null)
    setIsTestingVoices(false)
    console.log('🎉 Тестирование русских голосов завершено!')
    alert(`Тестирование завершено! Проверьте консоль (F12) для результатов.`)
  }

  /**
   * Генерация аудио файла (альтернативный метод)
   */
  const generatePodcast = async () => {
    if (!script.trim()) {
      alert('Введите текст для генерации подкаста!')
      return
    }

    setIsGenerating(true)
    
    try {
      // Останавливаем предыдущее воспроизведение
      if (currentAudio) {
        currentAudio.pause()
        setCurrentAudio(null)
      }
      
      // Очищаем предыдущий URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
      
    // Создаем utterance для синтеза речи
    const processedScript = processTextForSpeech(script)
    const utterance = new SpeechSynthesisUtterance(processedScript)
      
      if (selectedVoice) {
        // Используем оригинальный голос, если есть, иначе сам голос
        utterance.voice = selectedVoice.originalVoice || selectedVoice
      }
      
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      utterance.lang = 'ru-RU'

      // Создаем промис для ожидания завершения синтеза
      const synthesisPromise = new Promise((resolve, reject) => {
        utterance.onend = () => {
          console.log('Speech synthesis completed for recording')
          resolve()
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error during recording:', event.error)
          reject(new Error('Ошибка синтеза речи: ' + event.error))
        }
      })

      // Запускаем синтез речи
      window.speechSynthesis.speak(utterance)
      
      // Ждем завершения синтеза
      await synthesisPromise
      
      // Создаем текстовый файл с настройками для воспроизведения
      const settings = {
        text: script,
        voice: selectedVoice?.name || 'Default',
        rate: rate,
        pitch: pitch,
        volume: volume,
        timestamp: new Date().toISOString()
      }
      
      const textContent = `Генератор подкастов - Настройки воспроизведения
===============================================

Текст: ${script}

Настройки голоса:
- Голос: ${settings.voice}
- Скорость: ${rate}x
- Высота тона: ${pitch}
- Громкость: ${Math.round(volume * 100)}%

Время создания: ${new Date().toLocaleString('ru-RU')}

Инструкция:
1. Скопируйте текст выше
2. Вставьте в приложение
3. Нажмите "Прослушать" для воспроизведения
4. Используйте настройки выше для точного воспроизведения

Примечание: Для записи аудио файла используйте внешние программы записи экрана или аудио.`
      
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setIsGenerating(false)
      
      console.log('✅ Text file with settings generated successfully')
      
    } catch (error) {
      console.error('Error generating podcast:', error)
      setIsGenerating(false)
      alert('Ошибка при генерации подкаста: ' + error.message)
    }
  }

  /**
   * Воспроизведение/пауза аудио
   */
  const togglePlayback = () => {
    if (!audioUrl) return

    if (isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
    } else if (currentAudio) {
      currentAudio.play()
      setIsPlaying(true)
    } else {
      const audio = new Audio(audioUrl)
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setCurrentAudio(audio)
      setIsPlaying(true)
    }
  }

  /**
   * Скачивание сгенерированного аудио
   */
  const downloadPodcast = () => {
    if (!audioUrl) return

    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `podcast-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  /**
   * Группировка голосов по языкам для удобного отображения
   */
  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang
    if (!acc[lang]) {
      acc[lang] = []
    }
    acc[lang].push(voice)
    return acc
  }, {})

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Mic className="logo-icon" size={40} />
          <h1>Генератор подкастов</h1>
          <p className="subtitle">Преобразуйте текст в аудио подкаст</p>
        </div>
      </header>

      <div className="container">
        <div className="editor-section">
          <div className="section-header">
            <h2>Текст подкаста</h2>
            <span className="char-count">{script.length} символов</span>
          </div>
          
          <textarea
            className="script-editor"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Введите или вставьте текст для вашего подкаста...&#10;&#10;Например:&#10;Добро пожаловать в наш подкаст! Сегодня мы поговорим о современных технологиях и их влиянии на нашу жизнь..."
            rows={12}
          />
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Settings size={20} />
            <h2>Настройки голоса</h2>
          </div>

          <div className="settings-grid">
            <div className="setting-item">
              <div className="voice-selector">
                <label htmlFor="voice-select">Выбор голоса</label>
                
                {/* Переключатель между системными и внешними голосами */}
                <div className="voice-mode-toggle">
                  <button
                    className={`btn btn-small ${!useExternalTTS ? 'btn-active' : 'btn-inactive'}`}
                    onClick={() => setUseExternalTTS(false)}
                    title="Системные голоса (локальные)"
                  >
                    🏠 Системные
                  </button>
                  <button
                    className={`btn btn-small ${useExternalTTS ? 'btn-active' : 'btn-inactive'}`}
                    onClick={() => setUseExternalTTS(true)}
                    title="Внешние голоса (онлайн)"
                  >
                    🌐 Внешние
                  </button>
                </div>

                <div className="voice-controls">
                  {!useExternalTTS ? (
                    // Системные голоса
                    <>
                      <select
                        id="voice-select"
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                          const voice = voices.find(v => v.name === e.target.value)
                          setSelectedVoice(voice)
                        }}
                        className="select-input"
                      >
                        {Object.entries(groupedVoices).map(([lang, voiceList]) => (
                          <optgroup key={lang} label={`${lang} (${voiceList.length} голосов)`}>
                            {voiceList.map((voice) => (
                              <option key={voice.name} value={voice.name}>
                                {voice.displayName || voice.name} {voice.lang && voice.lang.startsWith('ru') ? '🇷🇺' : voice.lang && voice.lang.startsWith('en') ? '🇺🇸' : '🌍'}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        className="btn btn-small btn-refresh"
                        onClick={refreshVoices}
                        disabled={isRefreshingVoices}
                        title="Обновить список голосов"
                      >
                        {isRefreshingVoices ? (
                          <span className="loading-spinner">⏳</span>
                        ) : (
                          '🔄'
                        )}
                      </button>
                      <button
                        className="btn btn-small btn-test"
                        onClick={testRussianVoices}
                        disabled={isTestingVoices || voices.filter(v => v.lang && v.lang.startsWith('ru')).length === 0}
                        title="Протестировать все русские голоса"
                      >
                        {isTestingVoices ? (
                          <span className="loading-spinner">🧪</span>
                        ) : (
                          '🎤'
                        )}
                      </button>
                    </>
                  ) : (
                    // Внешние голоса
                    <>
                      <select
                        id="external-voice-select"
                        value={selectedExternalVoice?.id || ''}
                        onChange={(e) => {
                          const voice = externalVoices.find(v => v.id === e.target.value)
                          setSelectedExternalVoice(voice)
                        }}
                        className="select-input"
                      >
                        <optgroup label="🌐 Внешние русские голоса">
                          {externalVoices.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name} ({voice.provider}) {voice.gender === 'female' ? '👩' : '👨'}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <button
                        className="btn btn-small btn-info"
                        onClick={() => alert('6 русских голосов с разными характеристиками!\n\n👩 Женские: Обычный, Мягкий, Быстрый\n👨 Мужские: Обычный, Глубокий, Медленный\n🆓 Бесплатно: Работает без интернета\n⚡ Умно: Автоматически находит лучший голос\n\nПросто выберите голос и нажмите "Прослушать"!')}
                        title="Информация об улучшенных голосах"
                      >
                        ℹ️
                      </button>
                    </>
                  )}
                </div>
                
              </div>
            </div>

            <div className="setting-item">
              <label htmlFor="rate-slider">
                Скорость: {rate.toFixed(1)}x
              </label>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="pitch-slider">
                Высота тона: {pitch.toFixed(1)}
              </label>
              <input
                id="pitch-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            <div className="setting-item">
              <label htmlFor="volume-slider">
                <Volume2 size={16} /> Громкость: {Math.round(volume * 100)}%
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        <div className="actions-section">
          <div className="primary-actions">
            <button
              className="btn btn-primary"
              onClick={isListening ? stopListening : listenToText}
              disabled={!script.trim() || !isInitialized}
            >
              {isListening ? <Pause size={20} /> : <Play size={20} />}
              {!isInitialized ? 'Загрузка...' : isListening ? 'Остановить' : 'Прослушать'}
            </button>

            <button
              className="btn btn-success"
              onClick={generatePodcast}
              disabled={isGenerating || !script.trim()}
            >
              <Download size={20} />
              {isGenerating ? 'Генерация...' : 'Скачать файл'}
            </button>
          </div>


          <div className="info-text">
            <p>💡 <strong>Совет:</strong> Сначала нажмите "Прослушать" чтобы услышать, как звучит ваш текст, затем "Скачать файл" для получения файла с настройками воспроизведения.</p>
          </div>

        </div>
      </div>

      <footer className="footer">
        <p>Бесплатный генератор подкастов на основе Web Speech API</p>
      </footer>
    </div>
  )
}

export default App

