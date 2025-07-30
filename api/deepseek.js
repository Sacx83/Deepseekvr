export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error('Missing DEEPSEEK_API_KEY in environment variables.');
    return res.status(500).json({ error: 'Missing API key' });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    console.error('Missing prompt in request body.');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    console.log('DeepSeek raw response:', JSON.stringify(data));

    const reply = data?.choices?.[0]?.message?.content || "I didn't understand that.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('DeepSeek API Error:', err);
    return res.status(500).json({ error: 'API request failed' });
  }
}
