import formidable from "formidable";
import fs from "fs";
import groqClient from "../../utils/groqClient";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const text = fs.readFileSync(files.document.filepath, "utf8");

    const groqRes = await groqClient.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: `Summarize:\n${text}` }]
    });

    res.json({ summary: groqRes.choices[0].message.content });
  });
}
