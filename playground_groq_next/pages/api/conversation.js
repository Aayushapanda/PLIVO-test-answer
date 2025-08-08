import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import axios from 'axios';

export const config = { api: { bodyParser: true, sizeLimit: '50mb' } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { filename, audio_b64 } = req.body;
    if (!audio_b64) return res.status(400).json({ error: 'audio_b64 required' });

    const tmpPath = path.join('/tmp', filename || 'upload.wav');
    const buf = Buffer.from(audio_b64, 'base64');
    fs.writeFileSync(tmpPath, buf);

    // call python diarization
    const py = spawn('python3', [path.join(process.cwd(), 'python', 'diarization.py'), tmpPath]);
    let out = '';
    py.stdout.on('data', d=> out += d.toString());
    py.stderr.on('data', d=> console.error('pyerr', d.toString()));
    py.on('close', async (code) => {
      try {
        const diarization = JSON.parse(out);
        // simple prompt for Groq: include diarization text
        const prompt = 'Convert the following diarization info into a clean speaker-labelled transcript and concise notes:\n' + JSON.stringify(diarization);
        const groqResp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400
        }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
        res.json({ diarization, groq: groqResp.data });
      } catch (e) {
        res.status(500).json({ error: e.message, raw: out });
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
