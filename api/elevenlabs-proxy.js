// Прокси-сервер для ElevenLabs API
// Обходит CORS ограничения

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, xi-api-key')
  
  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
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
    
    if (!voiceId || !text || !apiKey) {
      res.status(400).json({ error: 'Missing required parameters' })
      return
    }
    
    // Делаем запрос к ElevenLabs API
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
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }
    
    // Получаем аудио данные
    const audioBuffer = await response.arrayBuffer()
    
    // Отправляем аудио обратно клиенту
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audioBuffer.byteLength)
    res.status(200).send(Buffer.from(audioBuffer))
    
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error.message })
  }
}
