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
      // Google Translate TTS
      { id: 'google-female', name: 'Google (женский)', provider: 'Google', gender: 'female', lang: 'ru' },
      { id: 'google-male', name: 'Google (мужской)', provider: 'Google', gender: 'male', lang: 'ru' },
      
      // Yandex SpeechKit
      { id: 'yandex-jane', name: 'Яндекс Джейн', provider: 'Yandex', gender: 'female', lang: 'ru' },
      { id: 'yandex-omazh', name: 'Яндекс Омаж', provider: 'Yandex', gender: 'female', lang: 'ru' },
      { id: 'yandex-zahar', name: 'Яндекс Захар', provider: 'Yandex', gender: 'male', lang: 'ru' },
      { id: 'yandex-ermil', name: 'Яндекс Ермил', provider: 'Yandex', gender: 'male', lang: 'ru' },
      
      // Microsoft Azure
      { id: 'azure-dmitry', name: 'Azure Дмитрий', provider: 'Microsoft', gender: 'male', lang: 'ru' },
      { id: 'azure-svetlana', name: 'Azure Светлана', provider: 'Microsoft', gender: 'female', lang: 'ru' },
      { id: 'azure-dariya', name: 'Azure Дарья', provider: 'Microsoft', gender: 'female', lang: 'ru' },
      
      // Google Cloud TTS
      { id: 'google-wavenet-a', name: 'Google WaveNet A', provider: 'Google Cloud', gender: 'female', lang: 'ru' },
      { id: 'google-wavenet-b', name: 'Google WaveNet B', provider: 'Google Cloud', gender: 'male', lang: 'ru' },
      { id: 'google-wavenet-c', name: 'Google WaveNet C', provider: 'Google Cloud', gender: 'female', lang: 'ru' },
      { id: 'google-wavenet-d', name: 'Google WaveNet D', provider: 'Google Cloud', gender: 'male', lang: 'ru' }
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
      
      console.log(`🎤 Загружено голосов: ${availableVoices.length}`)
      console.log(`🇷🇺 Русских голосов: ${russianVoices.length}`)
      console.log('📋 Доступные голоса:', availableVoices.map(v => `${v.name} (${v.lang})`))
      
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
   * Воспроизведение через внешние API
   */
  const playExternalTTS = async (text, voice) => {
    setIsListening(true)
    
    try {
      let audioUrl = ''
      
      if (voice.provider === 'Google') {
        // Google Translate TTS
        const gender = voice.gender === 'female' ? '0' : '1'
        audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(text)}&ttsspeed=${rate}`
      } else if (voice.provider === 'Yandex') {
        // Yandex SpeechKit (требует API ключ, используем демо)
        const voiceName = voice.id.split('-')[1]
        audioUrl = `https://tts.voicetech.yandex.net/generate?text=${encodeURIComponent(text)}&lang=ru&voice=${voiceName}&speed=${rate}&format=mp3`
      } else if (voice.provider === 'Microsoft') {
        // Microsoft Azure (требует API ключ, используем демо)
        const voiceName = voice.id.split('-')[1] + 'Neural'
        audioUrl = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/tts?text=${encodeURIComponent(text)}&voice=ru-RU-${voiceName}&rate=${rate}&volume=${volume}`
      } else if (voice.provider === 'Google Cloud') {
        // Google Cloud TTS (требует API ключ, используем демо)
        const voiceName = voice.id.replace('google-', 'ru-RU-')
        audioUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=demo&input.text=${encodeURIComponent(text)}&voice.name=${voiceName}&audioConfig.audioEncoding=MP3`
      }
      
      // Создаем аудио элемент
      const audio = new Audio(audioUrl)
      
      audio.onloadstart = () => {
        console.log(`🌐 Загружаем аудио от ${voice.provider}`)
      }
      
      audio.oncanplay = () => {
        console.log('✅ Аудио готово к воспроизведению')
        audio.play()
      }
      
      audio.onended = () => {
        setIsListening(false)
        console.log('✅ Воспроизведение завершено')
      }
      
      audio.onerror = (error) => {
        setIsListening(false)
        console.error('❌ Ошибка загрузки аудио:', error)
        alert(`Ошибка загрузки аудио от ${voice.provider}. Попробуйте другой голос.`)
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

    // Если выбран внешний TTS
    if (useExternalTTS && selectedExternalVoice) {
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
      const utterance = new SpeechSynthesisUtterance(script)
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

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
      const utterance = new SpeechSynthesisUtterance('Привет! Это тест русского голоса.')
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
      const utterance = new SpeechSynthesisUtterance(script)
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

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
                <label htmlFor="voice-select">Выбор голоса ({voices.length} системных + {externalVoices.length} внешних)</label>
                
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
                                {voice.name} {voice.lang.startsWith('ru') ? '🇷🇺' : voice.lang.startsWith('en') ? '🇺🇸' : '🌍'}
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
                        disabled={isTestingVoices || voices.filter(v => v.lang.startsWith('ru')).length === 0}
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
                        onClick={() => alert('Внешние голоса работают через онлайн API. Требуется интернет-соединение.')}
                        title="Информация о внешних голосах"
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
              className="btn btn-secondary"
              onClick={generatePodcast}
              disabled={isGenerating || !script.trim()}
            >
              <Mic size={20} />
              {isGenerating ? 'Генерация...' : 'Сгенерировать настройки'}
            </button>
          </div>

          {audioUrl && (
            <div className="audio-controls">
              <button
                className="btn btn-success"
                onClick={downloadPodcast}
              >
                <Download size={20} />
                Скачать настройки
              </button>
            </div>
          )}

          <div className="info-text">
            <p>💡 <strong>Совет:</strong> Сначала нажмите "Прослушать" чтобы услышать, как звучит ваш текст, затем "Сгенерировать настройки" для скачивания файла с настройками воспроизведения.</p>
            <p>🇷🇺 <strong>Русские голоса:</strong> Системных: {russianVoicesCount}, Внешних: {externalVoices.length}. {isTestingVoices && currentTestVoice && `Тестируем: ${currentTestVoice.name}`}</p>
            {russianVoicesCount === 0 && !useExternalTTS && (
              <p style={{color: '#e53e3e', fontWeight: 'bold'}}>
                ⚠️ Системные русские голоса не найдены! Переключитесь на "🌐 Внешние" для использования альтернативных голосов.
              </p>
            )}
            {useExternalTTS && (
              <p style={{color: '#38a169', fontWeight: 'bold'}}>
                ✅ Внешние голоса загружены! Выберите голос из списка и нажмите "Прослушать". 
                <br/>
                <small style={{color: '#4a5568', fontWeight: 'normal'}}>
                  💡 Совет: "Браузер" и "Системный" используют встроенные голоса браузера
                </small>
              </p>
            )}
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

