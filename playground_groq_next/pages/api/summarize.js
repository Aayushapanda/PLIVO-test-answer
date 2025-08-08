import axios from 'axios';
import fetch from 'node-fetch';

export const config = { api: { bodyParser: true, sizeLimit: '10mb' } };

function stripHtmlTags(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { url, filename, doc_b64 } = req.body;
    let text = '';
    if (url) {
      const r = await fetch(url);
      const html = await r.text();
      text = stripHtmlTags(html).slice(0, 3000);
    } else if (doc_b64) {
      // naive: client uploads plain text files as base64. For PDFs/DOCs you should extract text client-side or upload to a worker that can parse them.
      const buf = Buffer.from(doc_b64, 'base64');
      text = buf.toString('utf8').slice(0, 3000);
    } else {
      return res.status(400).json({ error: 'url or doc_b64 required' });
    }

    const prompt = 'Summarize the following content in concise bullet points:\n' + text;
    const groqResp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400
    }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
    res.json({ summary: groqResp.data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
