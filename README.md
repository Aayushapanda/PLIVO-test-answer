# Playground AI (Groq Integrated)

A developer prototype that demonstrates:
- Conversation Analysis (audio upload → VAD + diarization (local) → speaker-labeled transcription)
- Image Analysis (image upload → BLIP captioning)
- Document/URL Summarization (upload PDF/DOC or provide URL → concise summary)

Stack:
- Frontend: React + Vite
- Backend: Node.js + Express
- Worker: Python scripts (Groq API for summarization)
- Orchestration: Docker Compose

## Quickstart (Docker)
1. Copy `.env.example` -> `.env` and fill secrets.
2. `docker-compose up --build`
3. Open `http://localhost:5173`
