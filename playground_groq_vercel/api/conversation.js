import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    const tempFile = path.join("/tmp", "audio.wav");
    fs.writeFileSync(tempFile, req.body.audio, "base64");
    const py = spawn("python3", [path.join(process.cwd(), "api/_python_worker/diarization.py"), tempFile]);

    let output = "";
    py.stdout.on("data", (data) => { output += data.toString(); });
    py.on("close", async () => {
      const groqRes = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "system", content: "Transcription with diarization" }, { role: "user", content: output }]
      }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
      res.json({ diarization: output, ai_analysis: groqRes.data });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}