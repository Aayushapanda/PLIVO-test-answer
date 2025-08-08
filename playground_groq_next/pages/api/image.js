import axios from 'axios';
export const config = { api: { bodyParser: true, sizeLimit: '20mb' } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { filename, image_b64 } = req.body;
    if (!image_b64) return res.status(400).json({ error: 'image_b64 required' });
    // We won't send raw binary to Groq; instead prompt the model to imagine a description from the uploaded image.
    // For better results, you could upload the image to a hosting bucket and provide the URL.
    const prompt = `User uploaded an image (filename: ${filename}). Provide a detailed textual description of the image, including objects, colors, likely setting, and possible actions. Keep it concise but thorough.`;
    const groqResp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400
    }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
    res.json({ caption: groqResp.data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
