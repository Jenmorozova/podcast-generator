// Прокси-сервер для ElevenLabs API
// Обходит CORS ограничения

export default async function handler(req, res) {
  console.log('🔍 Прокси-сервер вызван:', req.method, req.url)
  
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, xi-api-key')
  
  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight обработан')
    res.status(200).end()
    return
  }
  
  // Только POST запросы
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  
  try {
    const { voiceId, text, apiKey } = req.body
    
    console.log('📝 Параметры запроса:', { voiceId, textLength: text?.length, hasApiKey: !!apiKey })
    
    if (!voiceId || !text || !apiKey) {
      console.error('❌ Отсутствуют обязательные параметры')
      res.status(400).json({ error: 'Missing required parameters' })
      return
    }
    
    // Делаем запрос к ElevenLabs API
    console.log('🌐 Запрос к ElevenLabs API...')
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    })
    
    console.log('📡 ElevenLabs response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ ElevenLabs API error:', response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }
    
    // Получаем аудио данные
    console.log('📦 Получение аудио данных...')
    const audioBuffer = await response.arrayBuffer()
    console.log('✅ Аудио данные получены, размер:', audioBuffer.byteLength, 'байт')
    
    // Отправляем аудио обратно клиенту
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audioBuffer.byteLength)
    res.status(200).send(Buffer.from(audioBuffer))
    console.log('✅ Аудио отправлено клиенту')
    
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error.message })
  }
}
